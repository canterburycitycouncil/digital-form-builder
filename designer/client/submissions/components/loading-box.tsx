import React, { MutableRefObject } from "react";

interface Props {
  ref: MutableRefObject<null>;
  loading: boolean;
}

export const LoadingBox = ({ ref, loading }: Props) => {
  const loadingCSS = {
    height: "100px",
    margin: "30px",
  };

  const loadingTextCSS = {
    display: loading ? "block" : "none",
  };
  return (
    <div className="loading-box" ref={ref} style={loadingCSS}>
      <span style={loadingTextCSS}>Loading...</span>
    </div>
  );
};
