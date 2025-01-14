import { Options } from "./types";

interface ConditionAction {
  type: Options.EDIT_OPTIONS_CONDITION;
  payload: string;
}

interface AnyAction {
  type: Options;
  payload: any;
}

type OptionsActions = ConditionAction | AnyAction;

export function optionsReducer(state, action: OptionsActions) {
  const { type, payload } = action;
  const { selectedComponent } = state;
  const { options } = selectedComponent;
  switch (type) {
    case Options.EDIT_OPTIONS_HIDE_TITLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, hideTitle: payload },
        },
      };
    case Options.EDIT_OPTIONS_REQUIRED:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, required: payload },
        },
      };
    case Options.EDIT_OPTIONS_ROWS:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, rows: payload },
        },
      };

    case Options.EDIT_OPTIONS_HIDE_OPTIONAL:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, optionalText: payload },
        },
      };
    case Options.EDIT_OPTIONS_FILE_UPLOAD_MULTIPLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, multiple: payload },
        },
      };
    case Options.EDIT_OPTIONS_CLASSES:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, classes: payload },
        },
      };

    case Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, maxDaysInFuture: payload },
        },
      };
    case Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, maxDaysInPast: payload },
        },
      };
    case Options.EDIT_OPTIONS_CONDITION:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, condition: payload },
        },
      };
    case Options.EDIT_OPTIONS_TYPE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, type: payload },
        },
      };
    case Options.EDIT_OPTIONS_AUTOCOMPLETE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, autocomplete: payload },
        },
      };
    case Options.EDIT_OPTIONS_CUSTOM_MESSAGE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, customValidation: payload },
        },
      };
    case Options.EDIT_OPTIONS_PARAMETER_NAME:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, parameterName: payload },
        },
      };
    case Options.EDIT_OPTIONS_IS_INTERNAL:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, isInternal: payload },
        },
      };
    case Options.EDIT_OPTIONS_IS_EXTERNAL:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, isExternal: payload },
        },
      };
    case Options.EDIT_OPTIONS_VARIABLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, variable: payload },
        },
      };
  }
}
