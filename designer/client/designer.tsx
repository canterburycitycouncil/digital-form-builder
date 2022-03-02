import React, { Component, useEffect } from "react";
import Menu from "./components/Menu/Menu";
import { Visualisation } from "./components/Visualisation";
import { FormDefinition } from "@xgovformbuilder/model";
import { FlyoutContext, DataContext } from "./context";
import { FeatureFlagProvider } from "./context/FeatureFlagContext";
import newFormJson from "../new-form.json";
import { DesignerApi } from "./api/designerApi";
import { i18n } from "./i18n";
import { Prompt } from "react-router-dom";
import { keysIn } from "lodash";
import { callbackify } from "util";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

interface State {
  id?: any;
  flyoutCount?: number;
  loading?: boolean;
  error?: string; // not using as of now
  newConfig?: boolean; // TODO - is this required?
  data?: FormDefinition;
  page?: any;
  updatedAt?: any;
  downloadedAt?: any;
  needsUpload?: boolean;
}

export default class Designer extends Component<Props, State> {
  state = { loading: true, flyoutCount: 0 };

  designerApi = new DesignerApi();

  get id() {
    return this.props.match?.params?.id;
  }

  updateDownloadedAt = (time) => {
    this.setState({ downloadedAt: time });
  };

  incrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount;
    this.setState({ flyoutCount: ++currentCount }, callback());
  };

  decrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount;
    this.setState({ flyoutCount: --currentCount }, callback());
  };

  save = async (toUpdate, callback = () => {}) => {
    try {
      this.setState(
        {
          data: toUpdate, //optimistic save
          updatedAt: new Date().toLocaleTimeString(),
          error: undefined,
          needsUpload: true,
        },
        callback()
      );
      return toUpdate;
    } catch (e) {
      this.setState({ error: e.message });
      this.props.history.push({
        pathname: "/save-error",
        state: { id: this.id },
      });
    }
  };

  upload = async (toUpdate, callback = () => {}) => {
    try {
      await this.designerApi.save(this.id, toUpdate);
      this.setState(
        {
          data: toUpdate, //optimistic save
          updatedAt: new Date().toLocaleTimeString(),
          error: undefined,
          needsUpload: false,
        },
        callback()
      );
      return toUpdate;
    } catch (e) {
      this.setState({ error: e.message });
      this.props.history.push({
        pathname: "/save-error",
        state: { id: this.id },
      });
    }
  };

  delete = async (callback = () => {}): Promise<any> => {
    try {
      const response = await this.designerApi.delete(this.id);
      console.log(response);
      this.setState(
        {
          data: null,
          updatedAt: null,
          error: undefined,
          needsUpload: false,
        },
        callback()
      );
      return response;
    } catch (e) {
      this.setState({ error: e.message });
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
    console.log(this.props);
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
    const { flyoutCount, data, loading, error } = this.state;
    const { previewUrl } = window;
    if (loading) {
      return <p>Loading ...</p>;
    }

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter,
    };

    const dataContextProviderValue = {
      data,
      save: this.save,
      upload: this.upload,
      deleteForm: this.delete,
    };
    return (
      <FeatureFlagProvider>
        <DataContext.Provider value={dataContextProviderValue}>
          <FlyoutContext.Provider value={flyoutContextProviderValue}>
            {data && (
              <div id="app">
                <Prompt when={!error} message={`${i18n("leaveDesigner")}`} />
                <Menu
                  id={this.id}
                  updateDownloadedAt={this.updateDownloadedAt}
                  updatePersona={this.updatePersona}
                  history={this.props.history}
                />
                <Visualisation
                  downloadedAt={this.state.downloadedAt}
                  updatedAt={this.state.updatedAt}
                  needsUpload={this.state.needsUpload}
                  persona={this.state.persona}
                  id={this.id}
                  previewUrl={previewUrl}
                />
              </div>
            )}
          </FlyoutContext.Provider>
        </DataContext.Provider>
      </FeatureFlagProvider>
    ); //
  }
}
