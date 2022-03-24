export const convertFieldNameToCamelCase = (fieldName: string) => {
  if (fieldName.indexOf("-") > -1) {
    let fieldNameParts = fieldName.split("-");
    fieldNameParts.map((part, index) => {
      if (index > 0) {
        return part.substring(0, 1).toUpperCase() + part.substring(1);
      }
      return part;
    });
    fieldName = fieldNameParts.join("");
  }
  return fieldName;
};
