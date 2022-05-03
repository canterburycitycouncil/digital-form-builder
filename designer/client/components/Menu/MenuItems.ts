import ConditionsEdit from "designer/client/components/Conditions/ConditionsEdit";
import FeeEdit from "designer/client/components/Fees/fee-edit";
import { FormDetails } from "designer/client/components/FormDetails";
import LinkCreate from "designer/client/components/Links/link-edit";
import ListsEdit from "designer/client/components/List/ListsEdit";
import { LogicExpressionsEdit } from "designer/client/components/LogicExpressions";
import { MenuItemHook } from "designer/client/components/Menu/useMenuItem";
import PageCreate from "designer/client/components/Page/page-create";
import SectionsEdit from "designer/client/components/Section/sections-edit";
import SummaryEdit from "designer/client/components/Summary/SummaryEdit";
import DeclarationEdit from "designer/client/declaration-edit";
import { i18n } from "designer/client/i18n";

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
