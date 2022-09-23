import { ConditionValue } from "@xgovformbuilder/model";
import React from "react";
import Select from "react-select";

export const SelectValues = (props) => {
  const { fieldDef, updateValue, value } = props;

  const onChangeSelect = (e) => {
    const input = e;
    const newValue = input.value;
    let value;
    if (newValue && newValue?.trim() !== "") {
      const option = fieldDef.values?.find(
        (value) => String(value.value) === newValue
      );
      value = new ConditionValue(String(option.value), option.label);
    }
    updateValue(value);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "black",
      backgroundColor: state.isFocused ? "#999999" : null,
    }),
    control: (provided) => ({
      ...provided,
      border: 0,
      boxShadow: "none",
    }),
    container: (provided) => ({
      ...provided,
      height: "auto",
      width: "390px",
      margin: 0,
      paddingBottom: 0,
      paddingTop: 0,
    }),
  };

  return (
    <Select
      className="govuk-select"
      id="cond-value"
      data-testid={"cond-value"}
      name="cond-value"
      styles={customStyles}
      onChange={onChangeSelect}
      options={
        fieldDef.values.map((option) => ({
          label: option.text,
          value: option.value,
          key: option.value,
        })) ?? [{ label: "", value: "" }]
      }
      defaultValue={
        value
          ? {
              label: value.display,
              value: value.value,
            }
          : { label: "", value: "" }
      }
    />
  );
};
