import { Input } from "govuk-react-jsx";
import React, { ChangeEvent, FC, MouseEvent, useState } from "react";

interface Props {
  url: string;
  onChange: (url: string) => void;
}

export const SubmissionMessageLinkCreate: FC<Props> = ({ url, onChange }) => {
  const [urlValue, setUrlValue] = useState(url);

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    onChange(urlValue);
  };

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrlValue(e.target.value);
  };
  return (
    <div>
      <Input
        id="urlValue"
        label={{
          className: "govuk-label--s",
          children: ["Link url"],
        }}
        name="urlValue"
        value={urlValue}
        onChange={(e) => onUrlChange(e)}
      />
      <button
        type="button"
        className="govuk-button"
        onClick={(e) => handleSubmit(e)}
      >
        Save
      </button>
    </div>
  );
};
