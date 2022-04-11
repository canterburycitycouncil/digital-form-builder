import { Page } from "@xgovformbuilder/data-model";
import { camelCase, upperFirst } from "lodash";
import path from "path";
import { DobPageController } from "runner/src/server/plugins/engine/pageControllers/DobPageController";
import { HomePageController } from "runner/src/server/plugins/engine/pageControllers/HomePageController";
import { PageController } from "runner/src/server/plugins/engine/pageControllers/PageController";
import { PageControllerBase } from "runner/src/server/plugins/engine/pageControllers/PageControllerBase";
import { StartDatePageController } from "runner/src/server/plugins/engine/pageControllers/StartDatePageController";
import { StartPageController } from "runner/src/server/plugins/engine/pageControllers/StartPageController";
import { SummaryPageController } from "runner/src/server/plugins/engine/pageControllers/SummaryPageController";

const PageControllers = {
  DobPageController,
  HomePageController,
  PageController,
  StartDatePageController,
  StartPageController,
  SummaryPageController,
  PageControllerBase,
};

export const controllerNameFromPath = (filePath: string) => {
  const fileName = path.basename(filePath).split(".")[0];
  return `${upperFirst(camelCase(fileName))}PageController`;
};

/**
 * Gets the class for the controller defined in a {@link Page}
 */
export const getPageController = (nameOrPath: Page["controller"]) => {
  const isPath = !!path.extname(nameOrPath);
  const controllerName = isPath
    ? controllerNameFromPath(nameOrPath)
    : nameOrPath;

  return PageControllers[controllerName];
};
