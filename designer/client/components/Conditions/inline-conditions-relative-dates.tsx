import { DateDirections, RelativeTimeValue } from "@xgovformbuilder/model";
import { DateTimeUnitValues } from "@xgovformbuilder/model";
import React from "react";

interface Props {
  value?: {
    timePeriod: string;
    timeUnit: string;
    direction: string;
  };
  units?: {
    value: string;
    display: string;
  }[];
  updateValue: (value: RelativeTimeValue) => void;
  timeOnly?: boolean;
}

interface State {
  timePeriod: string;
  timeUnits: string;
  direction: string;
}

class RelativeTimeValues extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      timePeriod: props.value?.timePeriod,
      timeUnits: props.value?.timeUnit,
      direction: props.value?.direction,
    };
  }

  updateState(state) {
    this.setState(state, () => {
      this.passValueToParentComponentIfComplete();
    });
  }

  passValueToParentComponentIfComplete() {
    const { timePeriod, timeUnits, direction } = this.state;
    if (timePeriod && timeUnits && direction) {
      this.props.updateValue(
        new RelativeTimeValue(
          timePeriod,
          timeUnits as DateTimeUnitValues,
          direction as DateDirections,
          this.props.timeOnly || false
        )
      );
    }
  }

  render() {
    const { timePeriod, timeUnits, direction } = this.state;

    return (
      <div>
        <input
          className="govuk-input govuk-input--width-20"
          id="cond-value-period"
          name="cond-value-period"
          type="text"
          defaultValue={timePeriod}
          required
          onChange={(e) => this.updateState({ timePeriod: e.target.value })}
          data-testid="cond-value-period"
        />

        <select
          className="govuk-select"
          id="cond-value-units"
          name="cond-value-units"
          value={timeUnits ?? ""}
          onChange={(e) => this.updateState({ timeUnits: e.target.value })}
          data-testid="cond-value-units"
        >
          <option />
          {this.props.units &&
            Object.values(this.props.units).map((unit) => {
              return (
                <option key={unit.value} value={unit.value}>
                  {unit.display}
                </option>
              );
            })}
        </select>

        <select
          className="govuk-select"
          id="cond-value-direction"
          name="cond-value-direction"
          value={direction ?? ""}
          onChange={(e) => this.updateState({ direction: e.target.value })}
          data-testid="cond-value-direction"
        >
          <option />
          {Object.values(DateDirections).map((direction) => {
            return (
              <option key={direction as string} value={direction as string}>
                {direction as string}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
export default RelativeTimeValues;
