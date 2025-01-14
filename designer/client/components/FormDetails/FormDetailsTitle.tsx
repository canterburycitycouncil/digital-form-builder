import { GovUKInput } from "@xgovformbuilder/designer/client/components/GovUKFields";
import React, { ChangeEvent } from "react";

interface Props {
  errors: any;
  handleTitleInputBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
}
export const FormDetailsTitle = (props: Props) => {
  const { title, handleTitleInputBlur } = props;

  return (
    <GovUKInput
      fieldName="title"
      fieldParent="form"
      value={title}
      translationNamespace="formDetails"
      type="text"
      handleChange={handleTitleInputBlur}
    />
  );
};
