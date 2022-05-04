import { i18n } from "@xgovformbuilder/designer/client/i18n";
import React from "react";

interface MenuButtonProps {
  dataTestId: string;
  handleClick: (e) => void;
  translationKey: string;
}

const MenuButton = ({
  dataTestId,
  handleClick,
  translationKey,
}: MenuButtonProps) => {
  return (
    <button data-testid={dataTestId} onClick={handleClick}>
      {i18n(translationKey)}
    </button>
  );
};

export default MenuButton;
