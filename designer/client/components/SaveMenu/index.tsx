import React, { useContext } from "react";
import { DataContext } from "../../context";
import logger from "../../plugins/logger";

const SaveMenu = () => {
  const { data, upload } = useContext(DataContext);
  const saveForm = async () => {
    try {
      const saved = await upload(data);
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
