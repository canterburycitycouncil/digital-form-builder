import { DataContext } from "@xgovformbuilder/designer/client/context";
import logger from "@xgovformbuilder/designer/client/plugins/logger";
import React, { useContext } from "react";

const SaveMenu = () => {
  const { data, upload } = useContext(DataContext);
  const saveForm = async () => {
    try {
      if (upload && data) {
        await upload(data);
      }
    } catch (err) {
      logger.error("FormDetails", err);
    }
  };
  return (
    <div className="save-menu">
      <div className="menu__row">
        <button onClick={saveForm}>Save</button>
      </div>
    </div>
  );
};

export default SaveMenu;
