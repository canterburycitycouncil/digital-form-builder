import "@xgovformbuilder/designer/client/components/FormDetails/FormDetails.scss";

import { FormDetailsFeedback } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsFeedback";
import { FormDetailsInternalOnly } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsInternalOnly";
import { FormDetailsPhaseBanner } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsPhaseBanner";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { FormConfiguration } from "@xgovformbuilder/form";
import { FormDefinition } from "@xgovformbuilder/model/src";
import isFunction from "lodash/isFunction";
import React, { ChangeEvent, Component, ContextType, FormEvent } from "react";
type PhaseBanner = Exclude<FormDefinition["phaseBanner"], undefined>;
type Phase = PhaseBanner["phase"];

interface Props {
  onCreate?: (saved: boolean) => void;
}

interface State {
  phase: Phase;
  feedbackForm: boolean;
  formConfigurations: FormConfiguration[];
  selectedFeedbackForm?: string;
  errors: any;
  internalOnly: boolean;
}

export class FormDetails extends Component<Props, State> {
  static contextType = DataContext;
  context!: ContextType<typeof DataContext>;
  isUnmounting = false;

  constructor(props, context) {
    super(props, context);
    const { data } = context;
    const selectedFeedbackForm = data.feedback?.url?.substr(1) ?? "";
    this.state = {
      feedbackForm: data.feedback?.feedbackForm ?? false,
      formConfigurations: [],
      selectedFeedbackForm,
      phase: data.phaseBanner?.phase,
      errors: {},
      internalOnly: data.internalOnly || false,
    };
  }

  onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data, save } = this.context;
    const {
      feedbackForm = false,
      selectedFeedbackForm,
      phase,
      internalOnly,
    } = this.state;
    const { phaseBanner = {} } = data;
    const { onCreate } = this.props;

    let copy: FormDefinition = { ...data };
    copy.internalOnly = internalOnly;
    copy.feedback = {
      feedbackForm,
    };
    if (selectedFeedbackForm) {
      copy.feedback.url = `/${selectedFeedbackForm}`;
    }

    copy.phaseBanner = {
      ...phaseBanner,
      phase,
    };

    try {
      const saved = await save(copy);
      if (isFunction(onCreate)) {
        onCreate(saved);
      }
    } catch (err) {
      logger.error("FormDetails", err);
    }
  };

  onSelectFeedbackForm = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedFeedbackForm = event.target.value;
    this.setState({ selectedFeedbackForm });
  };

  handleIsFeedbackFormRadio = (event: ChangeEvent<HTMLSelectElement>) => {
    const isFeedbackForm = event.target.value === "true";
    logger.info("FormDetails", "handle is feedback");

    if (isFeedbackForm) {
      this.setState({ feedbackForm: true, selectedFeedbackForm: undefined });
    } else {
      this.setState({ feedbackForm: false });
    }
  };

  handlePhaseBannerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const phase = event.target.value as Phase;
    this.setState({ phase: phase || undefined });
  };

  handleInternalOnlyInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    this.setState({ internalOnly: event.target.checked });
  };

  render() {
    const {
      phase,
      feedbackForm,
      selectedFeedbackForm,
      formConfigurations,
      errors,
      internalOnly,
    } = this.state;

    return (
      <>
        {Object.keys(errors).length > 0 && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          <FormDetailsInternalOnly
            internalOnly={internalOnly}
            handleInternalOnlyInputBlur={this.handleInternalOnlyInputBlur}
          />
          <FormDetailsPhaseBanner
            phase={phase}
            handlePhaseBannerChange={this.handlePhaseBannerChange}
          />
          <FormDetailsFeedback
            feedbackForm={feedbackForm}
            selectedFeedbackForm={selectedFeedbackForm}
            formConfigurations={formConfigurations}
            handleIsFeedbackFormRadio={this.handleIsFeedbackFormRadio}
            onSelectFeedbackForm={this.onSelectFeedbackForm}
          />
          <button type="submit" className="govuk-button">
            {i18n("Save")}
          </button>
        </form>
      </>
    );
  }
}
