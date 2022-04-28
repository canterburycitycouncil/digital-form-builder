import { whichMigrations } from "@xgovformbuilder/migration";
import { DataContext } from "designer/client/context";
import logger from "designer/client/plugins/logger";
import React, { useContext, useRef } from "react";

export function migrate(form) {
  const { version = 0 } = form;
  const migrationList = whichMigrations(version);
  try {
    let migratedJson = { ...form };
    migrationList.forEach((migration) => {
      migratedJson = migration(migratedJson);
    });
    return migratedJson;
  } catch (e) {
    logger.error("SubMenu", "failed to migrate json");
  }
}

type Props = {
  id?: string;
  updateDownloadedAt?: (string) => void;
  history?: any;
};

export function SubMenu({ id, updateDownloadedAt, history }: Props) {
  const { data, save, deleteForm } = useContext(DataContext);
  const fileInput = useRef<HTMLInputElement>(null);

  const onClickUpload = () => {
    fileInput.current!.click();
  };

  const onClickDownload = (e) => {
    e.preventDefault();
    const encodedData =
      "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    updateDownloadedAt?.(new Date().toLocaleTimeString());
    const link = document.createElement("a");
    link.download = `${id}.json`;
    link.href = `data:${encodedData}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onFileUpload = (e) => {
    const file = e.target.files.item(0);
    const reader = new window.FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      if (evt?.target?.result) {
        const content = JSON.parse(evt.target.result as string);
        const migrated = migrate(content);
        save(migrated);
      }
    };
  };

  const onClickDelete = () => {
    const answer = confirm(
      "Are you sure you want to delete this form?\nThis action cannot be undone"
    );
    if (answer) {
      deleteForm().then(() => {
        history.push("/");
      });
    }
  };

  return (
    <div className="menu__row">
      <a href="/app" className="govuk-link submenu__link">
        Create new form
      </a>
      <button
        className="govuk-body govuk-link submenu__link"
        onClick={onClickUpload}
      >
        Import saved form
      </button>
      <button
        className="govuk-body govuk-link submenu__link"
        onClick={onClickDownload}
      >
        Download form
      </button>
      <input ref={fileInput} type="file" hidden onChange={onFileUpload} />
      <button
        className="govuk-body govuk-link submenu__link"
        onClick={onClickDelete}
      >
        Delete form
      </button>
    </div>
  );
}
