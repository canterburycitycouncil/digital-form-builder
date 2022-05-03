import { Output } from "@xgovformbuilder/data-model";
import { Flyout } from "designer/client/components/Flyout";
import { DataContext } from "designer/client/context";
import { withI18n, WithI18nProps } from "designer/client/i18n";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import { findOutput } from "../../data/findOutput";
import { Point } from "../../types";
import { OutputEdit } from "./output-edit";
import { OutputLinkage } from "./OutputLinkage";

interface Props extends WithI18nProps {
  output: Output;
  layout: Point | undefined;
}

interface State {
  showEditor: boolean;
}

const SortableList = SortableContainer(() => {
  return <div className="component-list"></div>;
});

export class OutputDisplay extends React.Component<Props> {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
  }

  state: State = {
    showEditor: false,
  };

  onSortEnd = () => {
    const { save, data } = this.context;
    const { output } = this.props;

    const copy = { ...data };
    const [copyOutput, index] = findOutput(output, output.name);
    copy.outputs[index] = copyOutput;
    save(copy);
  };

  toggleEditor = () => {
    this.setState((prevState: State) => ({
      showEditor: !prevState.showEditor,
    }));
  };

  render() {
    const { output, i18n } = this.props;

    let outputTitle = output.title;

    return (
      <div
        id={output.name}
        title={output.name}
        className="page"
        style={this.props.layout}
      >
        <div className="page__heading">
          <h3>{outputTitle}</h3>
          <OutputLinkage output={output} layout={this.props.layout} />
        </div>

        <SortableList
          pressDelay={200}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          helperClass="dragging"
          lockToContainerEdges
          useDragHandle
        />

        <div className="page__actions">
          <button title={i18n("Edit output")} onClick={this.toggleEditor}>
            {i18n("Edit output")}
          </button>
        </div>

        <Flyout
          title="Edit Output"
          show={this.state.showEditor}
          onHide={this.toggleEditor}
          NEVER_UNMOUNTS={true}
        >
          <OutputEdit
            output={output}
            onEdit={this.toggleEditor}
            i18n={this.props.i18n}
          />
        </Flyout>
      </div>
    );
  }
}

export default withI18n(OutputDisplay);
