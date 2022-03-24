import React, { ChangeEvent } from "react";
import { i18n } from "../../i18n";
import { GovUKInput } from "../govuk-fields";

interface Props {
  errors: any;
  handleTitleInputBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  title: string;
}
export const FormDetailsTitle = (props: Props) => {
  const { title, errors, handleTitleInputBlur } = props;

  return (
    <GovUKInput
      fieldName="title"
      fieldParent="form"
      value={title}
      translationNamespace="form"
      type="text"
      handleChange={handleTitleInputBlur}
    />
    // <Input
    //   id="form-title"
    //   name="title"
    //   label={{
    //     className: "govuk-label--s",
    //     children: [i18n("Title")],
    //   }}
    //   onChange={handleTitleInputBlur}
    //   defaultValue={title}
    //   errorMessage={
    //     errors?.title ? { children: errors.title.children } : undefined
    //   }
    // />
  );
};
