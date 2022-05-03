import "./ComponentCreate.scss";

import { ComponentDef } from "@xgovformbuilder/components";
import { Page } from "@xgovformbuilder/data-model";
import { DataContext } from "designer/client/context";
import { addComponent } from "designer/client/data";
import logger from "designer/client/plugins/logger";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import { Actions } from "designer/client/reducers/component/types";
import { hasValidationErrors } from "designer/client/validations";
import {
  FormEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export const useComponentCreate = (props) => {
  const [renderTypeEdit, setRenderTypeEdit] = useState<boolean>(false);
  const { data, save } = useContext(DataContext);
  const { state, dispatch } = useContext(ComponentContext);
  const { selectedComponent, errors = [], hasValidated } = state;
  const { page, toggleAddComponent = () => {} } = props;

  const [isSaving, setIsSaving] = useState(false);
  const hasErrors = hasValidationErrors(errors);

  useEffect(() => {
    // render in the next re-paint to allow the DOM to reflow without the list
    // thus resetting the Flyout wrapper scrolling position
    // This is a quick work around the bug in small screens
    // where once user scrolls down the components list and selects one of the bottom components
    // then the component edit screen renders already scrolled to the bottom
    let isMounted = true;

    if (selectedComponent?.type) {
      window.requestAnimationFrame(() => {
        if (isMounted) setRenderTypeEdit(true);
      });
    } else {
      setRenderTypeEdit(false);
    }

    dispatch({ type: Actions.SET_PAGE, payload: page.path });

    return () => {
      isMounted = false;
    };
  }, [selectedComponent?.type, page.path]);

  useLayoutEffect(() => {
    if (hasValidated && !hasErrors) {
      handleSubmit()
        .then()
        .catch((err) => {
          logger.error("ComponentCreate", err);
        });
    }
  }, [hasValidated, hasErrors]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!hasValidated) {
      dispatch({ type: Actions.VALIDATE });
      return;
    }

    if (hasErrors) {
      return;
    }

    setIsSaving(true);
    const { selectedComponent } = state;
    const updatedData = addComponent(
      data,
      (page as Page).path,
      selectedComponent
    );

    await save(updatedData);
    toggleAddComponent();
  };

  const handleTypeChange = (component: ComponentDef) => {
    dispatch({
      type: Actions.EDIT_TYPE,
      payload: {
        type: component.type,
      },
    });
  };

  const reset = (e) => {
    e.preventDefault();
    dispatch({ type: Actions.SET_COMPONENT });
  };

  return {
    handleSubmit,
    handleTypeChange,
    hasErrors,
    errors: Object.values(errors),
    component: selectedComponent,
    isSaving,
    reset,
    renderTypeEdit,
  };
};
