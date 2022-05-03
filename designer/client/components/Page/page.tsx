import { ComponentDef, ComponentTypes } from "@xgovformbuilder/components";
import { FormDefinition, Page } from "@xgovformbuilder/data-model";
import { Component } from "designer/client/components/FormComponent/component";
import { ComponentContextProvider } from "designer/client/components/FormComponent/componentReducer/componentReducer";
import { DataContext } from "designer/client/context";
import { I18n, withI18n } from "designer/client/i18n";
import React from "react";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";

import { Flyout } from "../Flyout";
import { ComponentCreate } from "../FormComponent/ComponentCreate";
import { findPage } from "./data";
import PageEdit from "./page-edit";
import { PageLinkage } from "./PageLinkage";

interface SortableElementProps {
  index: number;
  page: Page;
  component: ComponentDef;
  data: FormDefinition;
}

interface SortableContainerProps {
  page: Page;
  data: FormDefinition;
}

interface PageProps {
  page: Page;
  i18n: I18n;
  previewUrl: string;
  persona: any;
  id: string;
  layout: any;
}

interface PageState {
  showEditor: boolean;
  showAddComponent: boolean;
}

const SortableItem = SortableElement(
  ({ index, page, component, data }: SortableElementProps) => (
    <div className="component-item">
      <Component key={index} page={page} component={component} data={data} />
    </div>
  )
);

const SortableList = SortableContainer(
  ({ page, data }: SortableContainerProps) => {
    const { components = [] } = page;
    return (
      <div className="component-list">
        {components.map((component, index) => (
          <SortableItem
            key={index}
            index={index}
            page={page}
            component={component}
            data={data}
          />
        ))}
      </div>
    );
  }
);

export class PageComponent extends React.Component<PageProps, PageState> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
  }

  state = {
    showEditor: false,
    showAddComponent: false,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { save, data } = this.context;
    const { page } = this.props;

    const copy = { ...data };
    const [copyPage, index] = findPage(data, page.path);
    copyPage.components &&
      (copyPage.components = arrayMove(
        copyPage.components,
        oldIndex,
        newIndex
      ));
    copy.pages[index] = copyPage;
    save(copy);
  };

  toggleAddComponent = () => {
    this.setState((prevState) => ({
      showAddComponent: !prevState.showAddComponent,
    }));
  };

  toggleEditor = () => {
    this.setState((prevState) => ({
      showEditor: !prevState.showEditor,
    }));
  };

  render() {
    const { data } = this.context;
    const { sections } = data;

    const { page, previewUrl, persona, i18n, id } = this.props;

    const previewHref = new URL(`${id}${page.path}`, previewUrl);
    const formComponents =
      page?.components?.filter(
        (comp) =>
          ComponentTypes.find((type) => type.name === comp.type)?.subType ===
          "field"
      ) ?? [];

    const section =
      page.section && sections.find((section) => section.name === page.section);
    const conditional = !!page.condition;

    let pageTitle =
      page.title ||
      (formComponents.length === 1 &&
      page.components &&
      page.components[0] === formComponents[0]
        ? formComponents[0].title
        : page.title);

    // if (pageTitle && typeof pageTitle === "object") {
    //   pageTitle = pageTitle.en;
    // }

    const highlight = persona?.paths?.includes(page.path);
    const pageClassName = [
      `page${conditional ? " conditional" : ""}`,
      `${highlight ? "highlight" : ""}`,
    ].join(" ");

    return (
      <div
        id={page.path}
        className={pageClassName}
        title={page.path}
        style={this.props.layout}
      >
        <div className="page__heading">
          <h3>
            {section && <span>{section.title}</span>}
            {pageTitle}
          </h3>
          <PageLinkage page={page} layout={this.props.layout} />
        </div>

        <SortableList
          page={page}
          data={data}
          pressDelay={200}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          helperClass="dragging"
          lockToContainerEdges
          useDragHandle
        />

        <div className="page__actions">
          <button title={i18n("Edit page")} onClick={this.toggleEditor}>
            {i18n("Edit page")}
          </button>
          <button
            title={i18n("Create component")}
            onClick={this.toggleAddComponent}
          >
            {i18n("Create component")}
          </button>
          <a
            title={i18n("Preview page")}
            href={previewHref.toString()}
            target="_blank"
            rel="noreferrer"
          >
            {i18n("Preview")}{" "}
            <span className="govuk-visually-hidden">{pageTitle}</span>
          </a>
        </div>

        <Flyout
          title="Edit Page"
          show={this.state.showEditor}
          onHide={this.toggleEditor}
          NEVER_UNMOUNTS={true}
        >
          <PageEdit page={page} onEdit={this.toggleEditor} />
        </Flyout>
        {this.state.showAddComponent && (
          <Flyout show={true} onHide={this.toggleAddComponent}>
            <ComponentContextProvider>
              <ComponentCreate
                renderInForm={true}
                toggleAddComponent={this.toggleAddComponent}
                page={page}
              />
            </ComponentContextProvider>
          </Flyout>
        )}
      </div>
    );
  }
}

export default withI18n(PageComponent);
