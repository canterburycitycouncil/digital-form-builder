import { ComponentTypes } from "@xgovformbuilder/components";
import React, { useContext } from "react";

import { ComponentContext } from "./componentReducer/componentReducer";
import { DateFieldEdit } from "./FieldEditors/date-field-edit";
import DetailsEdit from "./FieldEditors/details-edit";
import FieldEdit from "./FieldEditors/field-edit";
import { FileUploadFieldEdit } from "./FieldEditors/file-upload-field-edit";
import ListFieldEdit from "./FieldEditors/list-field-edit";
import { MultilineTextFieldEdit } from "./FieldEditors/multiline-text-field-edit";
import { NumberFieldEdit } from "./FieldEditors/number-field-edit";
import { ParaEdit } from "./FieldEditors/para-edit";
import SelectFieldEdit from "./FieldEditors/select-field-edit";
import { TextFieldEdit } from "./FieldEditors/text-field-edit";

const componentTypeEditors = {
  TextField: TextFieldEdit,
  EmailAddressField: TextFieldEdit,
  TelephoneNumberField: TextFieldEdit,
  MultilineTextField: MultilineTextFieldEdit,
  NumberField: NumberFieldEdit,
  AutocompleteField: ListFieldEdit,
  SelectField: SelectFieldEdit,
  RadiosField: ListFieldEdit,
  CheckboxesField: ListFieldEdit,
  FlashCard: ListFieldEdit,
  List: ListFieldEdit,
  Details: DetailsEdit,
  Para: ParaEdit,
  Html: ParaEdit,
  InsetText: ParaEdit,
  WarningText: ParaEdit,
  FileUploadField: FileUploadFieldEdit,
  DatePartsField: DateFieldEdit,
  DateTimeField: DateFieldEdit,
  DateTimePartsField: DateFieldEdit,
  DateField: DateFieldEdit,
};

function ComponentTypeEdit(props) {
  const { context = ComponentContext, page } = props;
  const { state } = useContext(context);
  const { selectedComponent } = state;
  const type = ComponentTypes.find(
    (t) => t.name === selectedComponent?.type ?? ""
  );

  const needsFieldInputs =
    type?.subType !== "content" || ["FlashCard", "List"].includes(type?.name);

  const TagName = componentTypeEditors[type?.name ?? ""];
  return (
    <div>
      {needsFieldInputs && (
        <FieldEdit isContentField={type?.subType === "content"} />
      )}
      {TagName && <TagName page={page} />}
    </div>
  );
}

export default ComponentTypeEdit;
