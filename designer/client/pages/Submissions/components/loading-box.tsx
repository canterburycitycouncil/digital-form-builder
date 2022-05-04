import React, { useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

interface Props {
  loading: boolean;
  onScroll: () => void;
}

export const LoadingBox = ({ loading, onScroll }: Props) => {
  const loadingCSS = {
    height: "100px",
    margin: "30px",
  };
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loadingRef, {});

  if (entry?.isIntersecting && !loading) {
    onScroll();
  }

  const loadingTextCSS = {
    display: loading ? "block" : "none",
  };
  return (
    <div className="loading-box" ref={loadingRef} style={loadingCSS}>
      <span style={loadingTextCSS}>Loading...</span>
    </div>
  );
};
