import React, { useContext } from "react";
import { Flyout } from "../Flyout";
import { FormDetails } from "../FormDetails";
import PageCreate from "../../page-create";
import LinkCreate from "../../link-create";
import SectionsEdit from "../../section/sections-edit";
import ConditionsEdit from "../../conditions/ConditionsEdit";
import { i18n } from "../../i18n";
import { ListsEditorContextProvider } from "../../reducers/list/listsEditorReducer";
import { ListContextProvider } from "../../reducers/listReducer";
import FeeEdit from "../../fee-edit";
import DeclarationEdit from "../../declaration-edit";
import { DataContext } from "../../context";
import ListsEdit from "../../list/ListsEdit";
import { useMenuItem } from "./useMenuItem";
import { SubMenu } from "./SubMenu";
import { LogicExpressionsEdit } from "../LogicExpressions";
import { useHistory, useLocation } from "react-router-dom";
import MenuButton from "./MenuButton";
import SummaryEdit from "../Summary/SummaryEdit";

type Props = {
  updateDownloadedAt?: (string) => void;
  id: string;
  updatePersona?: any;
  history?: any;
};

export default function Menu({ updateDownloadedAt, id }: Props) {
  const { data } = useContext(DataContext);
  const history = useHistory();
  const location = useLocation();

  const formDetails = useMenuItem();
  const page = useMenuItem();
  const link = useMenuItem();
  const sections = useMenuItem();
  const conditions = useMenuItem();
  const lists = useMenuItem();
  const fees = useMenuItem();
  const summaryBehaviour = useMenuItem();
  const summary = useMenuItem();
  const logicExpression = useMenuItem();

  const goToOutputs = () => {
    let currentUrl = location.pathname;
    history.push(currentUrl + "/outputs");
  };

  return (
    <nav className="menu">
      <div className="menu__row">
        <MenuButton
          dataTestId="menu-form-details"
          handleClick={formDetails.show}
          translationKey="menu.formDetails"
        />
        <MenuButton
          dataTestId="menu-page"
          handleClick={page.show}
          translationKey="menu.addPage"
        />
        <MenuButton
          dataTestId="menu-links"
          handleClick={link.show}
          translationKey="menu.links"
        />
        <MenuButton
          dataTestId="logic-expression"
          handleClick={logicExpression.show}
          translationKey="menu.logicExpression"
        />
        <MenuButton
          dataTestId="menu-sections"
          handleClick={sections.show}
          translationKey="menu.sections"
        />
        <MenuButton
          dataTestId="menu-conditions"
          handleClick={conditions.show}
          translationKey="menu.conditions"
        />
        <MenuButton
          dataTestId="menu-lists"
          handleClick={lists.show}
          translationKey="menu.lists"
        />
        <MenuButton
          dataTestId="menu-outputs"
          handleClick={goToOutputs}
          translationKey="menu.outputs"
        />
        <MenuButton
          dataTestId="menu-fees"
          handleClick={fees.show}
          translationKey="menu.fees"
        />
        <MenuButton
          dataTestId="menu-summary-behaviour"
          handleClick={summaryBehaviour.show}
          translationKey="menu.summaryBehaviour"
        />
        <MenuButton
          dataTestId="menu-summary"
          handleClick={summary.show}
          translationKey="menu.summary"
        />
      </div>
      {formDetails.isVisible && (
        <Flyout title="Form Details" onHide={formDetails.hide}>
          <FormDetails onCreate={() => formDetails.hide} />
        </Flyout>
      )}

      {page.isVisible && (
        <Flyout title="Add Page" onHide={page.hide}>
          <PageCreate data={data} onCreate={() => page.hide} />
        </Flyout>
      )}

      {link.isVisible && (
        <Flyout title={i18n("menu.links")} onHide={link.hide}>
          <LinkCreate data={data} onCreate={() => link.hide} />
        </Flyout>
      )}

      {sections.isVisible && (
        <Flyout title="Edit Sections" onHide={sections.hide}>
          <SectionsEdit data={data} onCreate={() => sections.hide} />
        </Flyout>
      )}

      {conditions.isVisible && (
        <Flyout
          title={i18n("conditions.addOrEdit")}
          onHide={conditions.hide}
          width="large"
        >
          <ConditionsEdit onCreate={() => conditions.hide} />
        </Flyout>
      )}

      {lists.isVisible && (
        <Flyout title="Edit Lists" onHide={lists.hide} width={""}>
          <ListsEditorContextProvider>
            <ListContextProvider>
              <ListsEdit showEditLists={false} />
            </ListContextProvider>
          </ListsEditorContextProvider>
        </Flyout>
      )}

      {fees.isVisible && (
        <Flyout title="Edit Fees" onHide={fees.hide} width="xlarge">
          <FeeEdit onEdit={() => fees.hide} />
        </Flyout>
      )}

      {logicExpression.isVisible && (
        <Flyout
          title="Edit logic expression"
          onHide={logicExpression.hide}
          width="xlarge"
        >
          <LogicExpressionsEdit />
        </Flyout>
      )}

      {summaryBehaviour.isVisible && (
        <Flyout
          title="Edit Summary behaviour"
          onHide={summaryBehaviour.hide}
          width="xlarge"
        >
          <DeclarationEdit data={data} onCreate={() => summaryBehaviour.hide} />
        </Flyout>
      )}

      {summary.isVisible && (
        <Flyout title="Summary" width="large" onHide={summary.hide}>
          <SummaryEdit data={data} />
        </Flyout>
      )}

      <SubMenu
        id={id}
        updateDownloadedAt={updateDownloadedAt}
        history={history}
      />
    </nav>
  );
}
