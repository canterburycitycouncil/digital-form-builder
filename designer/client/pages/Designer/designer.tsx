import React, { Component } from "react";
import Menu from "../../components/Menu/Menu";
import { Visualisation } from "./Visualisation";
import { FormDefinition } from "@xgovformbuilder/model";
import { FlyoutContext, DataContext } from "../../context";
import { FeatureFlagProvider } from "../../context/FeatureFlagContext";
import newFormJson from "../../../new-form.json";
import { DesignerApi } from "../../api/designerApi";
import { i18n } from "../../i18n";
import { Prompt } from "react-router-dom";
import { formatForm } from "../../helpers";

interface Props {
  match?: any;
  location?: any;
  history?: any;
}

declare global {
  interface Window {
    previewUrl: string;
  }
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

export default class Designer extends Component<Props, State> {
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
    this.setState({ flyoutCount: ++currentCount }, callback);
  };

  decrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount;
    this.setState({ flyoutCount: --currentCount }, callback);
  };

  save = async (toUpdate, callback = () => {}) => {
    try {
      this.setState(
        {
          data: toUpdate, //optimistic save
          updatedAt: new Date().toLocaleTimeString(),
          error: null,
          needsUpload: true,
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

  upload = async (toUpdate, callback = () => {}) => {
    try {
      await this.designerApi.save(this.id, toUpdate);
      this.setState(
        {
          data: toUpdate, //optimistic save
          updatedAt: new Date().toLocaleTimeString(),
          error: null,
          needsUpload: false,
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

  delete = async (callback = () => {}): Promise<any> => {
    try {
      const response = await this.designerApi.delete(this.id);
      this.setState(
        {
          data: null,
          updatedAt: null,
          error: null,
          needsUpload: false,
        },
        callback
      );
      return response;
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
      data = formatForm(newFormJson, data);
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
                  history={this.props.history}
                />
                <Visualisation
                  downloadedAt={this.state.downloadedAt}
                  updatedAt={this.state.updatedAt}
                  needsUpload={this.state.needsUpload}
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
