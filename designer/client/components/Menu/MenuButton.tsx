import React from "react";
import { i18n } from "../../i18n";

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
