import React from "react";
import { Input } from "govuk-react-jsx";
import {
  Section,
  Page,
  ComponentDef,
  FormDefinition,
} from "@xgovformbuilder/model";
import SelectConditions from "../Conditions/SelectConditions";
import { toUrl, randomId } from "../../helpers";
import { RenderInPortal } from "../RenderInPortal";
import { Flyout } from "../Flyout";
import SectionEdit from "../Section/section-edit";
import { withI18n, I18n } from "../../i18n";
import ErrorSummary from "../../error-summary";
import { validateTitle, hasValidationErrors } from "../../validations";
import { DataContext } from "../../context";
import { addLink, addPage } from "./data";
import logger from "../../plugins/logger";
import { Path } from "../FormComponent/componentData/types";

interface DataProps {
  value: PageValue;
}

interface Props {
  page: Page;
  onCreate: ({ value }: DataProps) => void;
  data: FormDefinition;
  i18n: I18n;
}

interface ErrorsObject {
  [key: string]: any;
}

interface State {
  path: string;
  controller: string;
  title: string;
  section: Section;
  isEditingSection: boolean;
  errors: ErrorsObject;
  linkFrom?: string;
  pageType?: string;
  selectedCondition?: string;
}

interface PageValue {
  path: string;
  title: string;
  components: ComponentDef[];
  next: Path[];
  section?: Section;
  controller?: string;
}

class PageCreate extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    const { page } = this.props;
    this.state = {
      path: "/",
      controller: page?.controller ?? "",
      title: page?.title,
      section: page?.section ?? {},
      isEditingSection: false,
      errors: {},
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const { data, save } = this.context;

    const title = this.state.title?.trim();
    const linkFrom = this.state.linkFrom?.trim();
    const section = this.state.section?.name?.trim();
    const pageType = this.state.pageType?.trim();
    const selectedCondition = this.state.selectedCondition?.trim();
    const path = this.state.path;

    let validationErrors = this.validate(title, path);
    if (hasValidationErrors(validationErrors)) return;

    const value: PageValue = {
      path,
      title,
      components: [],
      next: [],
    };
    if (section) {
      value.section = section;
    }
    if (pageType) {
      value.controller = pageType;
    }

    let copy = addPage({ ...data }, value);

    if (linkFrom) {
      copy = addLink(copy, linkFrom, path, selectedCondition);
    }
    try {
      await save(copy);
      this.props.onCreate({ value });
    } catch (err) {
      logger.error("PageCreate", err);
    }
  };

  validate = (title, path) => {
    const { data, i18n } = this.props;
    const titleErrors = validateTitle("page-title", title, i18n);
    const errors = { ...titleErrors };
    const alreadyExists = data.pages.find((page) => page.path === path);
    if (alreadyExists) {
      errors.path = {
        href: "#page-path",
        children: `Path '${path}' already exists`,
      };
    }

    this.setState({ errors });

    return errors;
  };

  generatePath(title, data) {
    let path = toUrl(title);
    if (
      title.length > 0 &&
      data.pages.find((page) => page.path.startsWith(path))
    ) {
      path = `${path}-${randomId()}`;
    }

    return path;
  }

  findSectionWithName(name) {
    const { data } = this.props;
    const { sections } = data;
    return sections.find((section) => section.name === name);
  }

  onChangeSection = (e) => {
    this.setState({
      section: this.findSectionWithName(e.target.value),
    });
  };

  onChangeLinkFrom = (e) => {
    const input = e.target;
    this.setState({
      linkFrom: input.value,
    });
  };

  onChangePageType = (e) => {
    const input = e.target;
    this.setState({
      pageType: input.value,
    });
  };

  onChangeTitle = (e) => {
    const { data } = this.context;
    const input = e.target;
    const title = input.value;
    this.setState({
      title: title,
      path: this.generatePath(title, data),
    });
  };

  onChangePath = (e) => {
    const input = e.target;
    const path = input.value.startsWith("/") ? input.value : `/${input.value}`;
    const sanitisedPath = path.replace(/\s/g, "-");
    this.setState({
      path: sanitisedPath,
    });
  };

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition: selectedCondition,
    });
  };

  editSection = (e, section) => {
    e.preventDefault();
    this.setState({
      section,
      isEditingSection: true,
    });
  };

  closeFlyout = (sectionName) => {
    const propSection = this.state.section ?? {};
    this.setState({
      isEditingSection: false,
      section: sectionName
        ? this.findSectionWithName(sectionName)
        : propSection,
    });
  };

  render() {
    const { data, i18n } = this.props;
    const { sections, pages } = data;
    const {
      pageType,
      linkFrom,
      title,
      section,
      path,
      isEditingSection,
      errors,
    } = this.state;

    return (
      <div>
        {hasValidationErrors(errors) && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="page-type">
              {i18n("addPage.pageTypeOption.title")}
            </label>
            <span className="govuk-hint">
              {i18n("addPage.pageTypeOption.helpText")}
            </span>
            <select
              className="govuk-select"
              id="page-type"
              name="page-type"
              value={pageType}
              onChange={this.onChangePageType}
            >
              <option value="">Question Page</option>
              <option value="./pages/start.js">Start Page</option>
              <option value="./pages/summary.js">Summary Page</option>
            </select>
          </div>

          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="link-from">
              {i18n("addPage.linkFromOption.title")}
            </label>
            <span className="govuk-hint">
              {i18n("addPage.linkFromOption.helpText")}
            </span>
            <select
              className="govuk-select"
              id="link-from"
              name="from"
              value={linkFrom}
              onChange={this.onChangeLinkFrom}
            >
              <option />
              {pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.path}
                </option>
              ))}
            </select>
          </div>

          {linkFrom && linkFrom.trim() !== "" && (
            <SelectConditions
              data={data}
              hints={[]}
              path={linkFrom}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n("conditions.noFieldsAvailable")}
            />
          )}

          <Input
            id="page-title"
            name="title"
            label={{
              className: "govuk-label--s",
              children: [i18n("addPage.pageTitleField.title")],
            }}
            value={title || ""}
            onChange={this.onChangeTitle}
            errorMessage={
              errors?.title ? { children: errors?.title.children } : undefined
            }
          />

          <Input
            id="page-path"
            name="path"
            label={{
              className: "govuk-label--s",
              children: [i18n("addPage.pathField.title")],
            }}
            hint={{
              children: [i18n("addPage.pathField.helpText")],
            }}
            value={path}
            onChange={this.onChangePath}
            errorMessage={
              errors?.path ? { children: errors?.path?.children } : undefined
            }
          />

          <div className="govuk-form-group">
            <label
              className="govuk-label govuk-label--s"
              htmlFor="page-section"
            >
              {i18n("addPage.sectionOption.title")}
            </label>
            <span className="govuk-hint">
              {i18n("addPage.sectionOption.helpText")}
            </span>
            {sections.length > 0 && (
              <select
                className="govuk-select"
                id="page-section"
                name="section"
                value={section?.name}
                onChange={this.onChangeSection}
              >
                <option />
                {sections.map((section) => (
                  <option key={section.name} value={section.name}>
                    {section.title}
                  </option>
                ))}
              </select>
            )}
            {section?.name && (
              <a
                href="#"
                className="govuk-link govuk-!-display-block"
                onClick={(e) => this.editSection(e, section)}
              >
                Edit section
              </a>
            )}
            <a
              href="#"
              className="govuk-link govuk-!-display-block"
              onClick={(e) => this.editSection(e, section)}
            >
              Create section
            </a>
          </div>

          <button type="submit" className="govuk-button">
            Save
          </button>
        </form>
        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={`${
                section?.name ? `Editing ${section.name}` : "Add a new section"
              }`}
              onHide={this.closeFlyout}
              show={true}
            >
              <SectionEdit
                section={section}
                data={data}
                closeFlyout={this.closeFlyout}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </div>
    );
  }
}

export default withI18n(PageCreate);