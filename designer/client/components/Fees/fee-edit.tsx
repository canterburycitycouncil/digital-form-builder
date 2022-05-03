import { clone, Fee } from "@xgovformbuilder/model";
import { Input } from "govuk-react-jsx";
import React from "react";

import { DataContext } from "../../context";
import ErrorSummary from "../../error-summary";
import logger from "../../plugins/logger";
import FeeItems from "./fee-items";

interface Props {
  data: any;
  fee: Fee;
  onCreate: ({ data }) => void;
  onEdit: ({ data }) => void;
}

interface Errors {
  [key: string]: any;
}

interface State {
  errors: Errors;
  hasValidationErrors: boolean;
}

class FeeEdit extends React.Component<Props, State> {
  static contextType = DataContext;
  feeItemsRef: React.RefObject<FeeItems>;

  constructor(props) {
    super(props);
    this.feeItemsRef = React.createRef();
    this.state = {
      errors: {},
      hasValidationErrors: false,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new window.FormData(form);
    const { data } = this.props;
    const { save } = this.context;

    // Items
    const payApiKey = (formData.get("pay-api-key") as string).trim();
    const descriptions = (formData.getAll("description") as string[]).map((t) =>
      t.trim()
    );
    const amount = (formData.getAll("amount") as string[]).map((t) => t.trim());
    const conditions = (formData.getAll("condition") as string[]).map((t) =>
      t.trim()
    );

    let hasValidationErrors = this.validate(payApiKey, form);
    if (hasValidationErrors) return;

    const copy = clone(data);
    copy.payApiKey = payApiKey;
    copy.fees = descriptions.map((description, i) => ({
      description,
      amount: amount[i],
      condition: conditions[i],
    }));

    save(copy)
      .then((data) => {
        this.props.onCreate({ data });
      })
      .catch((err) => {
        logger.error("FeeEdit", err);
      });
  };

  validate = (payApiKey, form) => {
    let apiKeyHasErrors = !payApiKey || payApiKey.length < 1;
    let itemValidationErrors = this.feeItemsRef.current?.validate(form);
    let hasValidationErrors =
      apiKeyHasErrors || Object.keys(itemValidationErrors).length > 0;
    let errors: Errors = {};
    if (apiKeyHasErrors) {
      errors.payapi = { href: "#pay-api-key", children: "Enter Pay API key" };
    }
    this.setState({
      errors: {
        ...itemValidationErrors,
        ...errors,
      },
      hasValidationErrors,
    });

    return hasValidationErrors;
  };

  onClickDelete = (e) => {
    e.preventDefault();

    if (!window.confirm("Confirm delete")) {
      return;
    }

    const { save } = this.context;
    const { data, fee } = this.props;
    const copy = clone(data);

    (copy.fees as Fee[]).splice(data.fees.indexOf(fee), 1);

    save(copy)
      .then((data) => {
        this.props.onEdit({ data });
      })
      .catch((err) => {
        logger.error("FeeEdit", err);
      });
  };

  render() {
    const { data } = this.props;
    const { fees, conditions, payApiKey, fee, onEdit } = data;
    const { errors, hasValidationErrors } = this.state;
    return (
      <div className="govuk-body">
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
          {hasValidationErrors && (
            <ErrorSummary
              titleChildren="There is a problem"
              errorList={Object.values(errors)}
            />
          )}
          <Input
            id="pay-api-key"
            name="pay-api-key"
            label={{
              className: "govuk-label--s",
              children: ["Pay API Key"],
            }}
            defaultValue={payApiKey}
            errorMessage={
              errors?.payapi
                ? { children: errors?.payapi?.children }
                : undefined
            }
          />
          <FeeItems
            items={fees as Fee[]}
            conditions={conditions}
            ref={this.feeItemsRef}
            data={data}
            fee={fee}
            onEdit={onEdit}
          />

          <button className="govuk-button" type="submit">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default FeeEdit;
