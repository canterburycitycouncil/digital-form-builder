import { FormDefinition, Page, Section } from "@xgovformbuilder/model";
import React from "react";

import { Flyout } from "../Flyout";
import { RenderInPortal } from "../RenderInPortal";
import SectionEdit from "./section-edit";

interface Props {
  page: Page;
  data: FormDefinition;
}

interface State {
  section?: Section;
  isEditingSection?: boolean;
}

class SectionsEdit extends React.Component<Props, State> {
  state: State = {};

  onClickSection = (e, section?) => {
    e.preventDefault();
    this.setState({
      section,
      isEditingSection: true,
    });
  };

  // TODO:- This is borrowed from page-edit.js. Needs refactor. (hooks hooks hooks)
  closeFlyout = (sectionName) => {
    const propSection = this.state.section ?? this.props.page?.section ?? {};
    this.setState({
      isEditingSection: false,
      section: sectionName
        ? this.findSectionWithName(sectionName)
        : (propSection as Section),
    });
  };

  findSectionWithName(name) {
    const { data } = this.props;
    const { sections } = data;
    return sections.find((section) => section.name === name);
  }

  render() {
    const { data } = this.props;
    const { sections } = data;
    const { section, isEditingSection } = this.state;

    return (
      <div className="govuk-body">
        <ul className="govuk-list">
          {sections.map((section) => (
            <li key={section.name}>
              <a href="#" onClick={(e) => this.onClickSection(e, section)}>
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <hr />
            <a href="#" onClick={(e) => this.onClickSection(e)}>
              Add section
            </a>
          </li>
        </ul>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={`${
                section?.name ? `Editing ${section.name}` : "Add a new section"
              }`}
              show={isEditingSection}
              onHide={this.closeFlyout}
            >
              <form>
                <SectionEdit
                  section={section}
                  data={data}
                  closeFlyout={this.closeFlyout}
                />
              </form>
            </Flyout>
          </RenderInPortal>
        )}
      </div>
    );
  }
}

export default SectionsEdit;
