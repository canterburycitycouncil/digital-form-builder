import SummaryEdit from "../Summary/SummaryEdit";
import { LogicExpressionsEdit } from "../LogicExpressions";
import ListsEdit from "../List/ListsEdit";
import FeeEdit from "../Fees/fee-edit";
import DeclarationEdit from "../../declaration-edit";
import { FormDetails } from "../FormDetails";
import PageCreate from "../Page/page-create";
import LinkCreate from "../Links/link-create";
import SectionsEdit from "../Section/sections-edit";
import ConditionsEdit from "../Conditions/ConditionsEdit";
import { i18n } from "../../i18n";
import { MenuItemHook } from "./useMenuItem";

interface MenuItemObject {
  [key: string]: {
    component: MenuItemHook;
    flyout: {
      title: string;
      width?: string;
      component: {
        type: any;
        props: {
          [key: string]: any;
        };
      };
    };
  };
}

export default function getMenuItems(
  useMenuItem: Function,
  data: any
): MenuItemObject {
  return {
    "form-details": {
      component: useMenuItem(),
      flyout: {
        title: "Form details",
        component: {
          type: FormDetails,
          props: {},
        },
      },
    },
    page: {
      component: useMenuItem(),
      flyout: {
        title: "Add Page",
        component: {
          type: PageCreate,
          props: {
            data: data,
          },
        },
      },
    },
    links: {
      component: useMenuItem(),
      flyout: {
        title: i18n("menu.links"),
        component: {
          type: LinkCreate,
          props: {
            data: data,
          },
        },
      },
    },
    sections: {
      component: useMenuItem(),
      flyout: {
        title: "Edit sections",
        component: {
          type: SectionsEdit,
          props: {
            data: data,
          },
        },
      },
    },
    conditions: {
      component: useMenuItem(),
      flyout: {
        title: i18n("conditions.addOrEdit"),
        width: "large",
        component: {
          type: ConditionsEdit,
          props: {},
        },
      },
    },
    lists: {
      component: useMenuItem(),
      flyout: {
        title: "Edit lists",
        component: {
          type: ListsEdit,
          props: {
            showEditLists: false,
          },
        },
      },
    },
    fees: {
      component: useMenuItem(),
      flyout: {
        title: "Edit fees",
        width: "xlarge",
        component: {
          type: FeeEdit,
          props: {},
        },
      },
    },
    "summary-behaviour": {
      component: useMenuItem(),
      flyout: {
        title: "Edit summary behaviour",
        width: "xlarge",
        component: {
          type: DeclarationEdit,
          props: {
            data: data,
          },
        },
      },
    },
    summary: {
      component: useMenuItem(),
      flyout: {
        title: "Summary",
        width: "large",
        component: {
          type: SummaryEdit,
          props: {
            data: data,
          },
        },
      },
    },
    "logic-expression": {
      component: useMenuItem(),
      flyout: {
        title: "Edit logic expressions",
        width: "xlarge",
        component: {
          type: LogicExpressionsEdit,
          props: {},
        },
      },
    },
  };
}
