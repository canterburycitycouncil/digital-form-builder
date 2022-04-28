import { ComponentTypes } from "@xgovformbuilder/components";
import { DateFieldEdit } from "designer/client/components/FieldEditors/date-field-edit";
import DetailsEdit from "designer/client/components/FieldEditors/details-edit";
import ListFieldEdit from "designer/client/components/FieldEditors/list-field-edit";
import { NumberFieldEdit } from "designer/client/components/FieldEditors/number-field-edit";
import { ParaEdit } from "designer/client/components/FieldEditors/para-edit";
import SelectFieldEdit from "designer/client/components/FieldEditors/select-field-edit";
import { TextFieldEdit } from "designer/client/components/FieldEditors/text-field-edit";
import FieldEdit from "designer/client/field-edit";
import { FileUploadFieldEdit } from "designer/client/file-upload-field-edit";
import { MultilineTextFieldEdit } from "designer/client/multiline-text-field-edit";
import { ComponentContext } from "designer/client/reducers/component/componentReducer";
import React, { useContext } from "react";

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
