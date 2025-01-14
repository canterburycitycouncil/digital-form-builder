import "./submissions.scss";

import { FormDefinition } from "@xgovformbuilder/model";
import React, { useEffect, useState } from "react";

import { DesignerApi } from "../../api/designerApi";
import { SubmissionApi } from "../../api/submissionApi";
import { LoadingBox } from "./components/loading-box";
import Menu from "./components/submissions-menu";
import { SubmissionsTable } from "./components/submissions-table";
import { Submission, SubmissionKey } from "./types";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

export const Submissions = (props: Props) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hasSearched, sethasSearched] = useState<boolean>(false);
  const [
    lastEvaluatedKey,
    setLastEvaluatedKey,
  ] = useState<SubmissionKey | null>(null);
  const [
    formConfiguration,
    setFormConfiguration,
  ] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  let submissionApi = new SubmissionApi();
  let designerApi = new DesignerApi();

  useEffect(() => {
    if (!hasSearched) {
      submissionApi
        .getSubmissionsForForm(props.match?.params?.id, "external")
        .then((res) => {
          console.log(res);
          setSubmissions(res.submissions);
          if (res.lastKey) {
            setLastEvaluatedKey(res.lastKey);
          } else {
            setLastEvaluatedKey(null);
          }
          sethasSearched(true);
        });
    }

    if (!formConfiguration) {
      designerApi
        .fetchData(props.match?.params?.id)
        .then((data) => setFormConfiguration(data));
    }
  }, [hasSearched, formConfiguration]);

  const getMoreSubs = async () => {
    if (lastEvaluatedKey && formConfiguration) {
      setLoading(true);
      submissionApi
        .getSubmissionsForForm(
          formConfiguration.id,
          "external",
          lastEvaluatedKey
        )
        .then((res) => {
          let submissionsCopy = submissions.slice(0);
          submissionsCopy = submissionsCopy.concat(res.submissions);
          setSubmissions(submissionsCopy);
          if (res.lastKey) {
            setLastEvaluatedKey(res.lastKey);
          } else {
            setLastEvaluatedKey(null);
          }
          setLoading(false);
        });
    }
  };

  return (
    <div id="app">
      <Menu />
      <div className="form-title">
        <h1 className="govuk-heading-m">
          Submissions for{" "}
          {formConfiguration && formConfiguration.id.replace(/-/g, " ")}
        </h1>
      </div>
      <div className="submissions-table">
        {formConfiguration && (
          <SubmissionsTable
            submissions={submissions}
            parentPath={location.pathname}
          />
        )}
      </div>
      {submissions && <LoadingBox loading={loading} onScroll={getMoreSubs} />}
    </div>
  );
};
