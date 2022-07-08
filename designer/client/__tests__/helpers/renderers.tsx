import {
  ComponentContext,
  componentReducer,
  initComponentState,
} from "@xgovformbuilder/designer/client/components/FormComponent/componentReducer/componentReducer";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import { FormDefinition } from "@xgovformbuilder/model";
import React, { useReducer } from "react";

export function RenderWithContext({ children, stateProps = {} }) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState({
      ...stateProps,
    })
  );
  return (
    <ComponentContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentContext.Provider>
  );
}

export function RenderWithContextAndDataContext({
  children,
  stateProps = {},
  mockData = {},
  mockSave = jest.fn(),
}) {
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState({
      ...stateProps,
    })
  );

  return (
    <DataContext.Provider
      value={{ data: mockData as FormDefinition, save: mockSave }}
    >
      <ComponentContext.Provider value={{ state, dispatch }}>
        {children}
      </ComponentContext.Provider>
    </DataContext.Provider>
  );
}
