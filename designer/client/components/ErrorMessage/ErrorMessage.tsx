import classNames from "classnames";
import { i18n } from "designer/client/i18n";
import React, { FC } from "react";

interface Props {
  className?: string;
}

export const ErrorMessage: FC<Props> = ({ children, className, ...props }) => {
  return (
    <span className={classNames("govuk-error-message", className)} {...props}>
      <span className="govuk-visually-hidden">{i18n("error")}</span> {children}
    </span>
  );
};
