import { useEffect, useContext, useState } from "react";
import { getLayout, Pos } from "./getLayout";
import { DataContext } from "../../context";

export function useVisualisation(ref) {
  const { data } = useContext(DataContext);
  const [layout, setLayout] = useState<Pos>();

  useEffect(() => {
    const layout = getLayout(data, ref.current!);
    setLayout(layout.pos);
  }, [data, ref]);

  return { layout, data };
}
