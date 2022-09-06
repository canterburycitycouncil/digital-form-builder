import ConditionsEdit from "@xgovformbuilder/designer/client/components/Conditions/ConditionsEdit";
import FeeEdit from "@xgovformbuilder/designer/client/components/Fees/fee-edit";
import { FormDetails } from "@xgovformbuilder/designer/client/components/FormDetails";
import LinkCreate from "@xgovformbuilder/designer/client/components/Links/link-create";
import ListsEdit from "@xgovformbuilder/designer/client/components/List/ListsEdit";
import { LogicExpressionsEdit } from "@xgovformbuilder/designer/client/components/LogicExpressions";
import { MenuItemHook } from "@xgovformbuilder/designer/client/components/Menu/useMenuItem";
import PageCreate from "@xgovformbuilder/designer/client/components/Page/page-create";
import SectionsEdit from "@xgovformbuilder/designer/client/components/Section/sections-edit";
import SummaryEdit from "@xgovformbuilder/designer/client/components/Summary/SummaryEdit";
import DeclarationEdit from "@xgovformbuilder/designer/client/declaration-edit";
import { i18n } from "@xgovformbuilder/designer/client/i18n";
import { identity } from "lodash";

interface MenuItemObject {
  [key: string]: {
    component: MenuItemHook;
    data: any;
    id: string;
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
  useMenuItem: () => MenuItemHook,
  data: any,
  id: string
): MenuItemObject {
  return {
    "form-details": {
      component: useMenuItem(),
      flyout: {
        title: "Form details",
        component: {
          type: FormDetails,
          props: {
            id: id,
          },
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
