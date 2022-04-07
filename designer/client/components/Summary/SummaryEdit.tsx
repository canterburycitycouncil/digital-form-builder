import React from "react";
import { DataPrettyPrint } from "./DataPrettyPrint/DataPrettyPrint";
import { Tabs, useTabs } from "../Menu/useTabs";

export interface SummaryEditProps {
  data: any;
}

const SummaryEdit = ({ data }: SummaryEditProps) => {
  const { selectedTab, handleTabChange } = useTabs();

  return (
    <div className="js-enabled" style={{ paddingTop: "3px" }}>
      <div className="govuk-tabs" data-module="tabs">
        <h2 className="govuk-tabs__title">Summary</h2>
        <ul className="govuk-tabs__list">
          <li className="govuk-tabs__list-item">
            <button
              className="govuk-tabs__tab"
              aria-selected={selectedTab === Tabs.model}
              onClick={(e) => handleTabChange(e, Tabs.model)}
            >
              Data Model
            </button>
          </li>
          <li className="govuk-tabs__list-item">
            <button
              className="govuk-tabs__tab"
              aria-selected={selectedTab === Tabs.json}
              data-testid={"tab-json-button"}
              onClick={(e) => handleTabChange(e, Tabs.json)}
            >
              JSON
            </button>
          </li>
          <li className="govuk-tabs__list-item">
            <button
              className="govuk-tabs__tab"
              aria-selected={selectedTab === Tabs.summary}
              data-testid="tab-summary-button"
              onClick={(e) => handleTabChange(e, Tabs.summary)}
            >
              Summary
            </button>
          </li>
        </ul>
        {selectedTab === Tabs.model && (
          <section className="govuk-tabs__panel" data-testid="tab-model">
            <DataPrettyPrint data={data} />
          </section>
        )}
        {selectedTab === Tabs.json && (
          <section className="govuk-tabs__panel" data-testid="tab-json">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </section>
        )}
        {selectedTab === Tabs.summary && (
          <section className="govuk-tabs__panel" data-testid="tab-summary">
            <pre>
              {JSON.stringify(
                data.pages.map((page) => page.path),
                null,
                2
              )}
            </pre>
          </section>
        )}
      </div>
    </div>
  );
};

export default SummaryEdit;
