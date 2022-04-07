import React, { useCallback, useState, Fragment, useContext } from "react";
import { RenderInPortal } from "../RenderInPortal";
import { DataContext } from "../../../../context";
import { addLink } from "../../data";

type Position = {
  x: string;
  y: string;
};

export function OutputLinkage({ output, layout }) {
  const { data, save } = useContext(DataContext);
  const [lineStart, setLineStart] = useState<Position | null>(null);
  const [lineEnd, setLineEnd] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const reset = () => {
    setIsDraggingOver(false);
    setIsDragging(false);
    setLineStart(null);
    setLineEnd(null);
  };

  const handleDragStart = useCallback(
    (event) => {
      const { clientX: x, clientY } = event;
      const y = clientY + window.pageYOffset;

      setIsDragging(true);
      setLineEnd({ x, y });
      setLineStart({ x, y });
      event.dataTransfer.setData("linkingOutput", JSON.stringify(output));
    },
    [output]
  );

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

      const linkingoutput = JSON.parse(
        event.dataTransfer.getData("linkingoutput")
      );
      if (linkingoutput.name !== output.name) {
        const updatedData = addLink(data, linkingoutput.name, output.name);
        await save(updatedData);
      }
      reset();
    },
    [data, output.name, save]
  );

  const handleDragEnd = useCallback((event) => {
    event.preventDefault();
    reset();
  }, []);

  const showHighlight = isDragging || isDraggingOver;

  const outputNodeSize = {
    width: layout?.node?.width,
    height: layout?.node?.height,
  };

  return (
    <Fragment>
      {showHighlight && (
        <div
          className="output-linkage__highlight-area"
          style={outputNodeSize}
        />
      )}
      <div
        className="output-linkage__drag-area"
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
          <svg className="output-linkage__line" width="9000" height="9000">
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
