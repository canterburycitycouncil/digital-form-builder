import React, { useEffect, useState } from "react";
import "../submissions.scss";

interface Props {
  formValues: {
    [key: string]: any;
  };
}

export const SubmissionFormValues = ({ formValues }: Props) => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const pages = Object.keys(formValues);

  useEffect(() => {
    if (!currentPage && formValues) {
      setCurrentPage(Object.keys(formValues)[0]);
    }
  }, [currentPage, formValues]);

  const handleBack = () => {
    setCurrentPage(pages[pages.indexOf(currentPage as string) - 1]);
  };

  const handleNext = () => {
    setCurrentPage(pages[pages.indexOf(currentPage as string) + 1]);
  };

  return (
    <React.Fragment>
      {currentPage && (
        <>
          <div className="submission-form-container">
            <div className="form-page-title">
              <h2 className="govuk-heading-s">{currentPage}</h2>
            </div>
            {Object.keys(formValues[currentPage]).map((field) => (
              <div key={field} className="form-value">
                <span className="field-name">{field}</span>
                <span className="field-value">
                  {formValues[currentPage][field]}
                </span>
              </div>
            ))}
            <div className="submission-form-buttons">
              {pages.indexOf(currentPage) > 0 && (
                <div className="button-previous-container">
                  <button className="btn btn--icon-left" onClick={handleBack}>
                    Back
                  </button>
                </div>
              )}
              {pages.indexOf(currentPage) < pages.length - 1 && (
                <div className="button-next-container">
                  <button className="btn btn--icon-right" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </React.Fragment>
  );
};
