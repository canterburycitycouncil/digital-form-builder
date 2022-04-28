import { getLayout } from "designer/client/components/Visualisation/getLayout";
import { Pos } from "designer/client/components/Visualisation/types";
import { DataContext } from "designer/client/context";
import { useContext, useEffect, useState } from "react";

export function useVisualisation(ref) {
  const { data } = useContext(DataContext);
  const [layout, setLayout] = useState<Pos>();

  useEffect(() => {
    const layout = getLayout(data, ref.current!);
    setLayout(layout.pos);
  }, [data, ref]);

  return { layout, data };
}
