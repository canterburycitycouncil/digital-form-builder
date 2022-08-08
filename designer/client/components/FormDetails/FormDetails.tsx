import "@xgovformbuilder/designer/client/components/FormDetails/FormDetails.scss";
import "@xgovformbuilder/designer/client/components/FormDetails/Draft.css";
import "@xgovformbuilder/designer/client/components/FormDetails/custom-draft.css";

import { FormDetailsFeedback } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsFeedback";
import { FormDetailsInternalOnly } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsInternalOnly";
import { FormDetailsPhaseBanner } from "@xgovformbuilder/designer/client/components/FormDetails/FormDetailsPhaseBanner";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import ErrorSummary from "@xgovformbuilder/designer/client/error-summary";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import { FormConfiguration } from "@xgovformbuilder/model";
import { FormDefinition } from "@xgovformbuilder/model";
import isFunction from "lodash/isFunction";
import React, { ChangeEvent, Component, ContextType, FormEvent } from "react";

import { FormDetailsSubmissionMessage } from "./FormDetailsSubmissionMessage";
import { FormDetailsTitle } from "./FormDetailsTitle";
type PhaseBanner = Exclude<FormDefinition["phaseBanner"], undefined>;
type Phase = PhaseBanner["phase"];

interface Props {
  id: string;
  onCreate?: () => void;
}

interface State {
  id: string;
  title: string;
  phase: Phase;
  feedbackForm: boolean;
  formConfigurations: FormConfiguration[];
  selectedFeedbackForm?: string;
  errors: any;
  internalOnly: boolean;
  submissionMessage?: string;
}

export class FormDetails extends Component<Props, State> {
  static contextType = DataContext;
  context!: ContextType<typeof DataContext>;
  isUnmounting = false;

  constructor(props: Props, context) {
    super(props, context);
    const { data } = context;
    const selectedFeedbackForm = data.feedback?.url?.substr(1) ?? "";
    this.state = {
      id: props.id,
      title: data.title !== "" ? data.title : props.id.replace(/-/g, " "),
      feedbackForm: data.feedback?.feedbackForm ?? false,
      formConfigurations: [],
      selectedFeedbackForm,
      phase: data.phaseBanner?.phase,
      submissionMessage: data.submissionMessage,
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
      submissionMessage,
      title,
    } = this.state;
    if (data) {
      const { phaseBanner = {} } = data;
      const { onCreate } = this.props;
      let copy: FormDefinition = { ...data };
      copy.title = title;
      copy.internalOnly = internalOnly;
      copy.feedback = {
        feedbackForm,
      };
      if (selectedFeedbackForm) {
        copy.feedback.url = `/${selectedFeedbackForm}`;
      }

      if (submissionMessage) {
        copy.submissionMessage = submissionMessage;
      }

      copy.phaseBanner = {
        ...phaseBanner,
        phase,
      };

      try {
        await save(copy);
        if (isFunction(onCreate)) {
          onCreate();
        }
      } catch (err) {
        logger.error("FormDetails", err);
      }
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
    this.setState({ internalOnly: event.target.checked });
  };

  handleSubmissionMessageChange = (value: string) => {
    this.setState({
      submissionMessage: value,
    });
  };

  handleTitleInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
    });
  };

  render() {
    const {
      id,
      title,
      phase,
      feedbackForm,
      selectedFeedbackForm,
      formConfigurations,
      errors,
      internalOnly,
      submissionMessage,
    } = this.state;

    const { data } = this.context;

    return (
      <>
        {Object.keys(errors).length > 0 && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          <div className="govuk-label govuk-label--s">Form id</div>
          <div className="govuk-hint">
            The form id cannot be changed after being created.
          </div>
          <div className="govuk-label form-id">{id}</div>
          <FormDetailsTitle
            title={title}
            handleTitleInputBlur={this.handleTitleInputBlur}
            errors={errors}
          />
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
          <FormDetailsSubmissionMessage
            defaultValue={submissionMessage}
            onChange={this.handleSubmissionMessageChange}
            data={data as FormDefinition}
          />
          <button type="submit" className="govuk-button">
            {i18n("Save")}
          </button>
        </form>
      </>
    );
  }
}
