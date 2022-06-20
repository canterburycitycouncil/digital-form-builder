import SelectConditions from "@xgovformbuilder/designer/client/components/Conditions/SelectConditions";
import {
  findPage,
  updateLink,
} from "@xgovformbuilder/designer/client/components/Page/data";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { Edge } from "@xgovformbuilder/designer/client/pages/Designer/Visualisation/types";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { FormDefinition, Page } from "@xgovformbuilder/model/src";
import React from "react";

interface Props {
  edge: Edge;
  onEdit: (data: FormDefinition) => void;
  data: any;
}

interface State {
  page: Page;
  link: any;
  selectedCondition?: string;
}

class LinkEdit extends React.Component<Props, State> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    const { data } = this.context;
    const { edge } = this.props;
    const [page] = findPage(data, edge.source);
    const link = page.next?.find((n) => n.path === edge.target);

    this.state = {
      page: page,
      link: link,
      selectedCondition: link?.condition,
    };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { link, page, selectedCondition } = this.state;
    const { data, save } = this.context;
    const updatedData = updateLink(
      data,
      page.path,
      link.path,
      selectedCondition
    );

    try {
      await save(updatedData);
      this.props.onEdit(updatedData);
    } catch (err) {
      logger.error("LinkEdit", err);
    }
  };

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { link, page } = this.state;
    const { data, save } = this.context;

    const copy = { ...data };
    const [copyPage] = findPage(data, page.path);
    if (copyPage.next) {
      const copyLinkIdx = copyPage.next.findIndex((n) => n.path === link.path);
      copyPage.next.splice(copyLinkIdx, 1);
    }
    copy.pages = copy.pages.map((page) =>
      page.path === copyPage.path ? copyPage : page
    );

    save(copy)
      .then((data) => {
        this.props.onEdit(data);
      })
      .catch((err) => {
        logger.error("LinkEdit", err);
      });
  };

  render() {
    const { data, edge } = this.props;
    const { pages } = data;

    return (
      <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-source">
            From
          </label>
          <select
            value={edge.source}
            className="govuk-select"
            id="link-source"
            disabled
          >
            <option />
            {pages.map((page) => (
              <option key={page.path} value={page.path}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="link-target">
            To
          </label>
          <select
            value={edge.target}
            className="govuk-select"
            id="link-target"
            disabled
          >
            <option />
            {pages.map((page) => (
              <option key={page.path} value={page.path}>
                {page.title}
              </option>
            ))}
          </select>
        </div>
        <SelectConditions
          path={edge.target ? edge.target : edge.source}
          data={data}
          hints={[]}
          conditionsChange={this.conditionSelected}
          noFieldsHintText={i18n("addLink.noFieldsAvailable")}
        />
        <button className="govuk-button" type="submit">
          Save
        </button>
        &nbsp;
        <button
          className="govuk-button"
          type="button"
          onClick={this.onClickDelete}
        >
          Delete
        </button>
      </form>
    );
  }

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition: selectedCondition,
    });
  };
}

export default LinkEdit;
