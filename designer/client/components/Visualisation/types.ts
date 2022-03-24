export type Point = {
  node: {
    x: number;
    y: number;
    width: number;
    height: number;
    class?: string | undefined;
    label?: string | undefined;
    padding?: number | undefined;
    paddingX?: number | undefined;
    paddingY?: number | undefined;
    rx?: number | undefined;
    ry?: number | undefined;
    shape?: string | undefined;
  };
  top: string;
  left: string;
};

export type Edge = {
  source: string;
  target: string;
  label: string;
  points: {
    y: number;
    x: number;
  }[];
};

export type Pos = {
  nodes: Point[];
  edges: Edge[];
  width: string;
  height: string;
};

export type Layout = {
  g: dagre.graphlib.Graph<{}>;
  pos: Pos;
};
