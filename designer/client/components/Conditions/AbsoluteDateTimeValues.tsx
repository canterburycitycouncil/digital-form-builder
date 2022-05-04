import {
  AbsoluteDateValues,
  YearMonthDay,
} from "@xgovformbuilder/designer/client/components/Conditions/AbsoluteDateValues";
import {
  AbsoluteTimeValues,
  HourMinute,
} from "@xgovformbuilder/designer/client/components/Conditions/AbsoluteTimeValues";
import { isInt } from "@xgovformbuilder/designer/client/components/Conditions/inline-condition-helpers";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import isValid from "date-fns/isValid";
import React from "react";

interface Props {
  value?: Date;
  updateValue: (date: Date) => void;
}

export const AbsoluteDateTimeValues = ({ value, updateValue }: Props) => {
  const [dateTimeParts, setDateTimeParts] = React.useState(() => {
    return {
      year: value && value.getUTCFullYear(),
      month: value && value.getUTCMonth() + 1,
      day: value && value.getUTCDate(),
      hour: value && value.getUTCHours(),
      minute: value && value.getUTCMinutes(),
    };
  });

  const dateTimeChanged = (updated: YearMonthDay | HourMinute) => {
    const updatedDateTime = {
      ...dateTimeParts,
      ...updated,
    };
    setDateTimeParts(updatedDateTime);
    const { year, month, day, hour, minute } = updatedDateTime;
    if (year && month && day && isInt(hour) && isInt(minute)) {
      const utcMilliseconds = Date.UTC(year, month - 1, day, hour, minute);
      const date = new Date(utcMilliseconds);
      if (isValid(date)) {
        updateValue(date);
      }
    }
  };

  const { year, month, day, hour, minute } = dateTimeParts;
  return (
    <div>
      <AbsoluteDateValues
        value={{ year, month, day }}
        updateValue={dateTimeChanged}
      />
      <AbsoluteTimeValues
        value={{ hour, minute }}
        updateValue={dateTimeChanged}
      />
      <div>{i18n("enterDateTimeAsGmt")}</div>
    </div>
  );
};
