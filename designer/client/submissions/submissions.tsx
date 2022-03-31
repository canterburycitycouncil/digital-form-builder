import React, { useEffect, useState, useRef } from "react";
import Menu from "./components/submissions-menu";
import { Submission, SubmissionKey } from "./types";
import { SubmissionApi } from "../api/submissionApi";
import { DesignerApi } from "../api/designerApi";
import { FormDefinition } from "@xgovformbuilder/model";
import { LoadingBox } from "./components/loading-box";
import { SubmissionsTable } from "./components/submissions-table";
import "./submissions.scss";

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
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [prevY, setPrevY] = useState<number>(0);
  const loadingRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);

  let submissionApi = new SubmissionApi();
  let designerApi = new DesignerApi();

  useEffect(() => {
    if (!hasSearched) {
      submissionApi
        .getSubmissionsForForm(props.match?.params?.id, "external")
        .then((res) => {
          setSubmissions(res.submissions);
          if (res.lastKey) {
            setLastEvaluatedKey(res.lastKey);
          }
          sethasSearched(true);
        });
    }

    if (!formConfiguration) {
      console.log(props);
      designerApi
        .fetchData(props.match?.params?.id)
        .then((data) => setFormConfiguration(data));
    }

    if (!observer) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      };
      setObserver(new IntersectionObserver(handleScroll, options));
    }

    if (observer && loadingRef?.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      observer?.disconnect();
    };
  }, [hasSearched, formConfiguration, observer]);

  const handleScroll = async (entries: IntersectionObserverEntry[]) => {
    const y = entries[0].boundingClientRect.y;
    if (prevY > y) {
      await getMoreSubs();
    }
    setPrevY(y);
  };

  const getMoreSubs = async () => {
    if (lastEvaluatedKey) {
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
          }
          setLoading(false);
        });
    }
  };

  console.log(submissions);

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
      <LoadingBox ref={loadingRef} loading={loading} />
    </div>
  );
};
