import { FormDefinition } from "@xgovformbuilder/model";
import { createContext } from "react";

export const DataContext = createContext<{
  data: FormDefinition | null;
  save: (toUpdate: FormDefinition) => Promise<false>;
  upload?: (toUpdate: FormDefinition) => Promise<false>;
  deleteForm?: () => Promise<false>;
}>({
  data: {} as FormDefinition | null,
  save: async (_data: FormDefinition) => false,
  upload: async (_data: FormDefinition) => false,
  deleteForm: async () => false,
});
