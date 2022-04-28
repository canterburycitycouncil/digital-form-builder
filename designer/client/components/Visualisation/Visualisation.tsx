import "designer/client/components/Visualisation/visualisation.scss";

import SaveMenu from "designer/client/components/SaveMenu";
import { Info } from "designer/client/components/Visualisation/Info";
import { Lines } from "designer/client/components/Visualisation/Lines";
import { Minimap } from "designer/client/components/Visualisation/Minimap";
import { useVisualisation } from "designer/client/components/Visualisation/useVisualisation";
import Page from "designer/client/page";
import React, { useRef } from "react";

type Props = {
  updatedAt?: string;
  downloadedAt?: string;
  previewUrl?: string;
  persona?: any;
  id?: string;
  needsUpload?: boolean;
};

export function Visualisation(props: Props) {
  const ref = useRef(null);
  const { layout, data } = useVisualisation(ref);

  const {
    updatedAt,
    downloadedAt,
    previewUrl,
    persona,
    id,
    needsUpload,
  } = props;
  const { pages } = data;

  const wrapperStyle = layout && {
    width: layout?.width,
    height: layout?.height,
  };

  return (
    <>
      <div className="visualisation">
        <div className="visualisation__pages-wrapper">
          <div ref={ref} style={wrapperStyle}>
            {pages.map((page, index) => (
              <Page
                key={index}
                page={page}
                persona={persona}
                previewUrl={previewUrl}
                layout={layout?.nodes[index]}
                id={id}
              />
            ))}

            {layout && <Lines layout={layout} data={data} persona={persona} />}
          </div>
        </div>

        {needsUpload && <SaveMenu />}

        {layout && <Info downloadedAt={downloadedAt} updatedAt={updatedAt} />}

        {layout && <Minimap layout={layout} />}
      </div>
    </>
  );
}
