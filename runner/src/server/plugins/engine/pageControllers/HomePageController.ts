import { PageController } from "runner/src/server/plugins/engine/pageControllers/PageController";
import { HapiRequest, HapiResponseToolkit } from "runner/src/server/types";

export class HomePageController extends PageController {
  get getRouteOptions() {
    return {
      ext: {
        onPostHandler: {
          method: (_request: HapiRequest, h: HapiResponseToolkit) => {
            return h.continue;
          },
        },
      },
    };
  }

  get postRouteOptions() {
    return {
      ext: {
        onPostHandler: {
          method: (_request: HapiRequest, h: HapiResponseToolkit) => {
            return h.continue;
          },
        },
      },
    };
  }
}
