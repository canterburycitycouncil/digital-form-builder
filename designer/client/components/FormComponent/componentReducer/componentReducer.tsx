import { ErrorListItem } from "@xgovformbuilder/designer/client/error-summary";
import { randomId } from "@xgovformbuilder/designer/client/helpers";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { ComponentDef } from "@xgovformbuilder/model/src";
import React, { createContext, useReducer } from "react";

import { fieldsReducer } from "../componentReducer/componentReducer.fields";
import { metaReducer } from "../componentReducer/componentReducer.meta";
import { optionsReducer } from "../componentReducer/componentReducer.options";
import { schemaReducer } from "../componentReducer/componentReducer.schema";
import type { ComponentActions } from "../componentReducer/types";
import { Actions, Fields, Meta, Options, Schema } from "./types";

type ComponentState = {
  selectedComponent: Partial<ComponentDef>;
  isNew?: boolean;
  initialName?: ComponentDef["name"];
  pagePath?: string;
  listItemErrors?: {};
  errors?: ErrorListItem[];
  hasValidated?: boolean;
};

const defaultValues = {
  selectedComponent: {},
};
/**
 * Context providing the {@link ComponentState} and {@link dispatch} for changing any values specified by {@link Actions}
 */
export const ComponentContext = createContext<{
  state: ComponentState;
  dispatch: React.Dispatch<any>;
}>({
  state: defaultValues,
  dispatch: () => {},
});

/**
 * A map of the Actions and the associated reducer
 */
const ActionsReducerCollection = [
  [Meta, metaReducer],
  [Options, optionsReducer],
  [Fields, fieldsReducer],
  [Schema, schemaReducer],
];

export function valueIsInEnum<T>(value: keyof ComponentActions, enumType: T) {
  return Object.values(enumType).indexOf(value) !== -1;
}

/**
 * when an {@link Actions} is passed to getSubReducer, it will return the associated reducer defined in {@link ActionsReducerCollection}
 */
export function getSubReducer(type) {
  return ActionsReducerCollection.find((a) => valueIsInEnum(type, a[0]))?.[1];
}

const isNotValidate = (type): type is Meta.VALIDATE => {
  return Object.values(Actions).includes(type);
};

export function componentReducer(
  state,
  action: {
    type: ComponentActions;
    payload: any;
  }
) {
  const { type } = action;
  const { selectedComponent } = state;

  if (isNotValidate(type)) {
    state.hasValidated = false;
  }

  const subReducer: any = getSubReducer(type);

  if (subReducer) {
    return {
      ...state,
      ...subReducer(state, action),
    };
  } else {
    logger.info("Unrecognised action:", action.type);
    return { ...state, selectedComponent };
  }
}

export const initComponentState = (props) => {
  const selectedComponent = props?.component;
  const newName = randomId();
  return {
    selectedComponent: selectedComponent ?? { name: newName, options: {} },
    initialName: selectedComponent?.name ?? newName,
    pagePath: props?.pagePath,
    isNew: props?.isNew || ((selectedComponent?.name && false) ?? true),
    listItemErrors: {},
  };
};

/**
 * Allows components to retrieve {@link ComponentState} and {@link dispatch} from any component nested within `<ComponentContextProvider>`
 */
export const ComponentContextProvider = (props) => {
  const { children, ...rest } = props;
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(rest)
  );

  return (
    <ComponentContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentContext.Provider>
  );
};
