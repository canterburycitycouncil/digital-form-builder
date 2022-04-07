import React, { useContext, useEffect, useRef, useState } from "react";

import Output from "./components/outputs/output";
import { Lines } from "./components/OutputLines";
import { Minimap } from "../Designer/Visualisation/Minimap";
import { getOutputsLayout } from "./getOutputsLayout";
import { Pos } from "./types";
import { DataContext } from "../../context";
import "../Designer/Visualisation/visualisation.scss";

type Props = {
  updatedAt?: string;
  downloadedAt?: string;
  previewUrl?: string;
  persona?: any;
  id?: string;
};

export function useVisualisation(ref) {
  const { data } = useContext(DataContext);
  const [layout, setLayout] = useState<Pos>();

  useEffect(() => {
    const layout = getOutputsLayout(data, ref.current!);
    setLayout(layout.pos);
  }, [data, ref]);

  return { layout };
}

export function Visualisation(props: Props) {
  const ref = useRef(null);
  const { layout } = useVisualisation(ref);
  const { data } = useContext(DataContext);

  const { persona } = props;
  const outputs = data.outputs;

  const wrapperStyle = layout && {
    width: layout?.width,
    height: layout?.height,
  };

  return (
    <>
      <div className="visualisation">
        <div className="visualisation__pages-wrapper">
          <div ref={ref} style={wrapperStyle}>
            {outputs.map((output, index) => (
              <Output
                key={index}
                output={output}
                layout={layout?.nodes[index]}
              />
            ))}

            {layout && <Lines layout={layout} data={data} persona={persona} />}
          </div>
        </div>

        {layout && <Minimap layout={layout} />}
      </div>
    </>
  );
}
