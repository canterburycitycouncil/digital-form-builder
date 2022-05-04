import "./visualisation.scss";

import Page from "@xgovformbuilder/designer/client/components/Page/page";
import SaveMenu from "@xgovformbuilder/designer/client/components/SaveMenu";
import React, { useRef } from "react";

import { Info } from "./Info";
import { Lines } from "./Lines";
import { Minimap } from "./Minimap";
import { useVisualisation } from "./useVisualisation";

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

  const wrapperStyle = layout && {
    width: layout?.width,
    height: layout?.height,
  };

  if (data) {
    const { pages } = data;
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
                  previewUrl={previewUrl as string}
                  layout={layout?.nodes[index]}
                  id={id as string}
                />
              ))}

              {layout && (
                <Lines layout={layout} data={data} persona={persona} />
              )}
            </div>
          </div>

          {needsUpload && <SaveMenu />}

          {layout && <Info downloadedAt={downloadedAt} updatedAt={updatedAt} />}

          {layout && <Minimap layout={layout} />}
        </div>
      </>
    );
  }
  return <></>;
}
