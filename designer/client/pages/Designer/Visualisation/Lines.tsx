import { FormDefinition } from "@xgovformbuilder/data-model";
import { Flyout } from "designer/client/components/Flyout";
import LinkEdit from "designer/client/components/Links/link-edit";
import { DataContext } from "designer/client/context";
import React from "react";

import { Edge, Layout } from "./getLayout";

type Props = {
  layout: Layout["pos"];
  data: FormDefinition;
  persona: any;
};

type State = {
  showEditor: Edge | boolean;
};

export class Lines extends React.Component<Props, State> {
  static contextType = DataContext;

  state = {
    showEditor: false,
  };

  constructor(props, context) {
    super(props, context);
  }

  editLink = (edge: Edge) => {
    this.setState({
      showEditor: edge,
    });
  };

  render() {
    const { layout, persona } = this.props;
    const { data } = this.context;

    return (
      <div>
        <svg height={layout.height} width={layout.width}>
          {layout.edges.map((edge) => {
            const { source, target, points, label } = edge;
            const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

            const xs = edge.points.map((p) => p.x);
            const ys = edge.points.map((p) => p.y);

            const textX = xs.reduce((a, b) => a + b, 0) / xs.length;
            const textY = ys.reduce((a, b) => a + b, 0) / ys.length - 5;

            const highlight = [source, target].every((path) =>
              persona?.paths?.includes(path)
            );
            return (
              <g key={pointsString}>
                <polyline
                  onClick={() => this.editLink(edge)}
                  points={pointsString}
                  className={`${highlight ? "highlight" : ""}`}
                  data-testid={`${source}-${target}`.replace(/\//g, "")}
                />
                {label && (
                  <text
                    textAnchor="middle"
                    x={textX}
                    y={textY}
                    fill="black"
                    pointerEvents="none"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {this.state.showEditor && (
          <Flyout
            title="Edit Link"
            onHide={() => this.setState({ showEditor: false })}
          >
            <LinkEdit
              edge={this.state.showEditor}
              data={data}
              onEdit={() => this.setState({ showEditor: false })}
            />
          </Flyout>
        )}
      </div>
    );
  }
}
