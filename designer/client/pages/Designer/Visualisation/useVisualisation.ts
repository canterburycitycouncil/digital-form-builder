import { useEffect, useContext, useState } from "react";
import { getLayout } from "./getLayout";
import { Pos } from "./types";
import { DataContext } from "../../../context";

export function useVisualisation(ref) {
  const { data } = useContext(DataContext);
  const [layout, setLayout] = useState<Pos>();

  useEffect(() => {
    const layout = getLayout(data, ref.current!);
    setLayout(layout.pos);
  }, [data, ref]);

  return { layout, data };
}
