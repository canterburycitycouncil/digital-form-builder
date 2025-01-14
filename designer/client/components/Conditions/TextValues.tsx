import { ConditionValue } from "@xgovformbuilder/model";
import React from "react";

export const TextValues = (props) => {
  const { updateValue, value } = props;

  const onChangeTextInput = (e) => {
    const input = e.target;
    const newValue = input.value;
    updateValue(new ConditionValue(newValue));
  };

  return (
    <input
      className="govuk-input govuk-input--width-20"
      id="cond-value"
      name="cond-value"
      type="text"
      defaultValue={value?.value}
      required
      onChange={onChangeTextInput}
    />
  );
};
