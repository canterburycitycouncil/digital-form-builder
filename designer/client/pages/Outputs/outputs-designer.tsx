import { DesignerApi } from "@xgovformbuilder/designer/client/api/designerApi";
import {
  DataContext,
  FlyoutContext,
} from "@xgovformbuilder/designer/client/context";
import { FeatureFlagProvider } from "@xgovformbuilder/designer/client/context/FeatureFlagContext";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import newFormJson from "@xgovformbuilder/designer/new-form.json";
import { FormDefinition } from "@xgovformbuilder/model/src";
import React, { Component } from "react";
import { Prompt } from "react-router-dom";

import Menu from "./outputs-menu";
import { Visualisation } from "./outputs-visualiser";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

interface State {
  id: any;
  flyoutCount: number | null;
  loading: boolean | null;
  error: string | null; // not using as of now
  newConfig: boolean | null; // TODO - is this required?
  data: FormDefinition | null;
  page: any;
  updatedAt: any;
  downloadedAt: any;
  needsUpload: boolean;
}

export class OutputsDesigner extends Component<Props, State> {
  state = {
    loading: true,
    flyoutCount: 0,
    id: null,
    error: null,
    newConfig: null,
    data: null,
    page: null,
    updatedAt: undefined,
    downloadedAt: undefined,
    needsUpload: false,
  };

  designerApi = new DesignerApi();

  get id() {
    return this.props.match?.params?.id;
  }

  updateDownloadedAt = (time) => {
    this.setState({ downloadedAt: time });
  };

  incrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount;
    this.setState(
      { flyoutCount: currentCount ? ++currentCount : currentCount },
      callback
    );
  };

  decrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount;
    this.setState(
      { flyoutCount: currentCount ? --currentCount : currentCount },
      callback
    );
  };

  save = async (toUpdate, callback = () => {}) => {
    try {
      await this.designerApi.save(this.id, toUpdate);
      this.setState(
        {
          data: toUpdate, //optimistic save
          updatedAt: new Date().toLocaleTimeString(),
          error: null,
        },
        callback
      );
      return toUpdate;
    } catch (e) {
      this.setState({ error: (e as Error).message });
      this.props.history.push({
        pathname: "/save-error",
        state: { id: this.id },
      });
    }
  };

  updatePageContext = (page) => {
    this.setState({ page });
  };

  componentDidMount() {
    const id = this.props.match?.params?.id;
    this.setState({ id });
    this.designerApi.fetchData(id).then((data) => {
      const newFormItemNames = Object.getOwnPropertyNames(newFormJson);
      newFormItemNames?.forEach((item) => {
        if (!data?.hasOwnProperty(item)) {
          data[item] = newFormJson[item];
        }
      });
      const dataFormItems = Object.getOwnPropertyNames(data);
      dataFormItems?.forEach((item) => {
        if (!newFormJson?.hasOwnProperty(item)) {
          delete data[item];
        }
      });
      this.setState({ loading: false, data });
    });
  }

  render() {
    const { flyoutCount, loading, data, error } = this.state;
    if (loading) {
      return <p>Loading ...</p>;
    }

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter,
    };

    const dataContextProviderValue = { data, save: this.save };
    return (
      <FeatureFlagProvider>
        <DataContext.Provider value={dataContextProviderValue}>
          <FlyoutContext.Provider value={flyoutContextProviderValue}>
            <div id="app">
              <Prompt when={!error} message={`${i18n("leaveDesigner")}`} />
              <Menu />
              <Visualisation
                downloadedAt={this.state.downloadedAt}
                updatedAt={this.state.updatedAt}
                id={this.id}
              />
            </div>
          </FlyoutContext.Provider>
        </DataContext.Provider>
      </FeatureFlagProvider>
    ); //
  }
}
