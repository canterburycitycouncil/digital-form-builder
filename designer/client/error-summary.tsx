import { i18n } from "@xgovformbuilder/designer/client/i18n";
import React, { useEffect, useRef } from "react";

import { ValidationError } from "./components/FormComponent/componentReducer/componentReducer.validations";

export interface ErrorListItem {
  reactListKey?: string;
  href?: string;
  children: string;
}

interface ErrorSummaryProps {
  className?: string;
  descriptionChildren?: string;
  errorList: ValidationError[];
  titleChildren?: string;
}

export function ErrorSummary({
  className,
  descriptionChildren,
  errorList,
  titleChildren = "There is a problem",
}: ErrorSummaryProps) {
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, []);

  let description;
  if (descriptionChildren) {
    description = <p>{descriptionChildren}</p>;
  }

  const handleClick = (id) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView();
      element.focus();
    }
  };

  console.log(errorList);

  return (
    <div
      className={`govuk-error-summary ${className || ""}`}
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      ref={errorSummaryRef}
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {titleChildren}
      </h2>
      <div className="govuk-error-summary__body">
        {description}
        <ul className="govuk-list govuk-error-summary__list">
          {errorList.map((error, index) => (
            <li key={index}>
              {error.href ? (
                <a
                  href={error.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(error.href);
                  }}
                >
                  {Array.isArray(error.children)
                    ? i18n(...error.children)
                    : error.children}
                </a>
              ) : (
                <>
                  {Array.isArray(error.children)
                    ? i18n(...error.children)
                    : error.children}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ErrorSummary;
