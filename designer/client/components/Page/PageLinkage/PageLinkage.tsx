import { RenderInPortal } from "@xgovformbuilder/designer/client/components/RenderInPortal";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { EdgePoint } from "@xgovformbuilder/designer/client/pages/Designer/Visualisation/types";
import React, { Fragment, useCallback, useContext, useState } from "react";

import { addLink } from "../data";

export function PageLinkage({ page, layout }) {
  const { data, save } = useContext(DataContext);
  const [lineStart, setLineStart] = useState<EdgePoint | null>(null);
  const [lineEnd, setLineEnd] = useState<EdgePoint | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const reset = () => {
    setIsDraggingOver(false);
    setIsDragging(false);
    setLineStart(null);
    setLineEnd(null);
  };

  const handleDragStart = useCallback((event) => {
    const { clientX: x, clientY } = event;
    const y = clientY + window.pageYOffset;

    setIsDragging(true);
    setLineEnd({ x, y });
    setLineStart({ x, y });
    event.dataTransfer?.setData("linkingPage", JSON.stringify(page));
  }, []);

  const handleDrag = useCallback((event) => {
    const { clientX: x, clientY } = event;
    const y = clientY + window.pageYOffset;

    if (!x && !y) {
      // event might return 0 0 moved outside dom or drop occurs outside linkage
      reset();
    } else {
      setLineEnd({ x, y });
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();

      const linkingPage = JSON.parse(event.dataTransfer.getData("linkingPage"));
      if (linkingPage.path !== page.path && data) {
        const updatedData = addLink(data, linkingPage.path, page.path);
        if (!(updatedData instanceof Error)) await save(updatedData);
      }
      reset();
    },
    [data]
  );

  const handleDragEnd = useCallback((event) => {
    event.preventDefault();
    reset();
  }, []);

  const showHighlight = isDragging || isDraggingOver;

  const pageNodeSize = {
    width: layout?.node?.width,
    height: layout?.node?.height,
  };

  return (
    <Fragment>
      {showHighlight && (
        <div className="page-linkage__highlight-area" style={pageNodeSize} />
      )}
      <div
        className="page-linkage__drag-area"
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        draggable="true"
      />
      {isDragging && lineEnd && (
        <RenderInPortal>
          <svg className="page-linkage__line" width="9000" height="9000">
            <defs>
              <marker
                id="arrow"
                markerWidth="6"
                markerHeight="6"
                refX="0"
                refY="3"
                orient="auto"
                fill="transparent"
              >
                <polygon
                  points="0 0, 0 6, 6 3"
                  fill="#f7b315"
                  stroke="transparent"
                />
              </marker>
            </defs>
            <line
              x1={lineStart?.x}
              y1={lineStart?.y}
              x2={lineEnd?.x}
              y2={lineEnd?.y}
              markerEnd="url(#arrow)"
            />
          </svg>
        </RenderInPortal>
      )}
    </Fragment>
  );
}
