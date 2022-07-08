import { FormDefinition } from "@xgovformbuilder/model";
import dagre from "dagre";

import { Layout, Point, Pos } from "./types";

type GetLayout = (data: FormDefinition, el: HTMLDivElement) => Layout;

export const getOutputsLayout: GetLayout = (data, el) => {
  // Create a new directed graph
  var g = new dagre.graphlib.Graph();

  // Set an object for the graph label
  g.setGraph({
    rankdir: "LR",
    marginx: 50,
    marginy: 100,
    ranksep: 160,
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each node
  data.outputs.forEach((output, index) => {
    const outputEl = el.children[index] as HTMLDivElement;

    g.setNode(output.name, {
      label: output.name,
      width: outputEl.offsetWidth,
      height: outputEl.offsetHeight,
    });
  });

  // Add edges to the graph.
  data.outputs.forEach((output) => {
    if (Array.isArray(output.next)) {
      output.next.forEach((next) => {
        // The linked node (next output) may not exist if it's filtered
        const exists = data.outputs.find((output) => output.name === next);
        if (exists) {
          g.setEdge(output.name, next);
        }
      });
    }
  });

  dagre.layout(g);

  const output = g.graph();

  const pos: Pos = {
    nodes: [],
    edges: [],
    width: output.width + "px",
    height: output.height + "px",
  };

  g.nodes().forEach((v) => {
    const node = g.node(v);
    const pt: Point = {
      node,
      top: node.y - node.height / 2 + "px",
      left: node.x - node.width / 2 + "px",
    };
    pos.nodes.push(pt);
  });

  g.edges().forEach((e) => {
    const edge = g.edge(e);
    pos.edges.push({
      source: e.v,
      target: e.w,
      label: edge.condition || "",
      points: edge.points.map((p) => {
        return {
          y: p.y,
          x: p.x,
        };
      }),
    });
  });

  return { g, pos };
};
