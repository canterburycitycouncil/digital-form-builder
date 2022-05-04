import { DataContext } from "@xgovformbuilder/designer/client/context";
import { useContext, useEffect, useState } from "react";

import { getLayout } from "./getLayout";
import { Pos } from "./types";

export function useVisualisation(ref) {
  const { data } = useContext(DataContext);
  const [layout, setLayout] = useState<Pos>();

  useEffect(() => {
    if (data && ref) {
      const layout = getLayout(data, ref.current!);
      setLayout(layout.pos);
    }
  }, [data, ref]);

  return { layout, data };
}
