import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RenderWithContext } from "@xgovformbuilder/designer/client/__tests__/helpers/renderers";
import React from "react";

import { LogicExpressionEdit } from "../logic-expression-edit";

// SERIES OF TESTS TO TEST FUNCTIONALITY AND UI IN BUILDING CONDITIONAL EXPRESSION
// BEHAVIOURLY (AND FUNCTIONALLY UP UNTIL EXPRESSION IS BUILT THIS IS FINE
// BUT WANT TO ENSURE THE FUNCTIONS THAT CREATE THE EXPRESSION DO SO IN A STRUCTURALLY CORRECT WAY
// TODO: TEST ELSEIF CONDITIONAL BLOCKS
// TODO: MOVE MOCK DATA OUT TO ALLOW IT TO BE ALTERED TO TEST ANY FORM?
// I.E. SO THE CONDITIONS AND PAGES RELATE TO THE FORM TO TEST THE CONDIONALS WITH

const logicalExpressions = {
  expression: {},
  expressionType: "conditional",
  label: "Test conditional",
  variableName: "testconditional",
};

const conditionalLogicExpression = {
  expression: {},
  expressionType: "conditional",
  label: "Test conditional",
  variableName: "testconditional",
};
const conditionalExpressionOutput = {
  label: "Test conditional",
  variableName: "testconditional",
  expressionType: "conditional",
  expression: '{"conditionId":"gSkpkq","return":"{Address}"}',
};
const data = {
  conditions: [
    {
      name: "gSkpkq",
      displayName: "After the 15th June",
    },
    {
      name: "XBRuOL",
      displayName: "David needs the thing",
    },
    {
      name: "rNsOIc",
      displayName: "TEST FIELD STUFF",
    },
  ],
  pages: [
    {
      components: [
        {
          name: "TcoQsw",
          options: {
            isExternal: true,
            isInternal: true,
          },
          schema: {},
          title: "Test field one - all",
          type: "TextField",
        },
        {
          name: "oJHQPZ",
          options: {
            isInternal: true,
          },
          schema: {},
          subType: "field",
          title: "Test field two - internal only",
          type: "TextField",
        },
        {
          name: "HnLrAG",
          options: {
            isExternal: true,
            isInternal: true,
          },
          schema: {},
          title: "Davids Test Upload",
          type: "FileUploadField",
        },
        {
          name: "nnSnKf",
          options: {
            isExternal: true,
            isInternal: true,
            required: false,
          },
          schema: {},
          title: "Address",
          type: "UkAddressField",
        },
        {
          name: "IYbolB",
          options: {
            isExternal: true,
            isInternal: true,
            required: false,
          },
          schema: {},
          title: "Would you like this thing?",
          type: "YesNoField",
          values: {
            type: "listRef",
          },
        },
        {
          name: "OPKlXr",
          options: {
            isExternal: true,
            isInternal: true,
          },
          schema: {},
          title: "When?",
          type: "DateField",
        },
        {
          name: "FRjPNq",
          options: {
            isExternal: true,
            isInternal: true,
          },
          schema: {},
          title: "What time?",
          type: "TimeField",
          hint: "",
        },
      ],
    },
  ],
};

describe("Logic Expression Object Creation Testing", () => {
  describe("Logic Expression Conditional Object Creation Testing", () => {
    test("Ensure the conditional expression type can be selected in the expression type dropdown", async () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={conditionalLogicExpression}
            data={data}
          />
        </RenderWithContext>
      );
      const expressionSelect = screen.getByTestId("expression-select");
      const conditionalSelect = screen.getByTestId("conditional");
      userEvent.selectOptions(expressionSelect, [conditionalSelect]);
      expect(screen.getByRole("option", { name: "conditional" }).selected).toBe(
        true
      );
    });

    test("Ensure a first condition is selected", async () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={conditionalLogicExpression}
            data={data}
          />
        </RenderWithContext>
      );
      // SELECT CONDITIONAL
      userEvent.selectOptions(
        screen.getByTestId("expression-select"),
        "conditional"
      );
      // SELECT A CONDITION FROM 1ST CONDITIONS DROPDOWN
      const conditionSelect = screen.getByTestId("expression-condition");
      const conditionSelected = screen.getByText("David needs the thing");
      userEvent.selectOptions(conditionSelect, [conditionSelected]);
      expect(
        screen.getByRole("option", { name: "David needs the thing" }).selected
      ).toBe(true);
      // ADD SOME FALSES TO CHECK CORRECT SELECTION
      expect(
        screen.getByRole("option", { name: "TEST FIELD STUFF" }).selected
      ).toBe(false);
    });

    test("Set a return from return dropdown for the first condition", async () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={conditionalLogicExpression}
            data={data}
          />
        </RenderWithContext>
      );
      // SELECT CONDITIONAL
      userEvent.selectOptions(
        screen.getByTestId("expression-select"),
        "conditional"
      );
      // SELECT A CONDITION FROM 1ST CONDITIONS DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-condition"),
        "David needs the thing"
      );
      // SELECT A RETURN FROM THE RETURN DROPDOWN
      const conditionReturnSelect = screen.getByTestId(
        "expression-select-return"
      );
      const conditionReturnSelected = screen.getByTestId("Address");
      userEvent.selectOptions(conditionReturnSelect, [conditionReturnSelected]);
      expect(screen.getByRole("option", { name: "Address" }).selected).toBe(
        true
      );
      // ADD SOME FALSES TO CHECK CORRECT SELECTION
      expect(
        screen.getByRole("option", { name: "Davids Test Upload" }).selected
      ).toBe(false);
    });

    // NNED TO HAVE A THINK ABOUT THE WAY TO USE ASSERTION FOR THE INPUT STRING RETURN
    // IS IT INSTEAD OF THE DROPDOWN AND IF IT IS (I THINK IT IS) THEN THE TEST NEEDS TO REFLECT THIS

    test("Select the block elseif BUTTON and check next block is displayed", () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={conditionalLogicExpression}
            data={data}
          />
        </RenderWithContext>
      );
      // SELECT CONDITIONAL
      userEvent.selectOptions(
        screen.getByTestId("expression-select"),
        "conditional"
      );
      // SELECT A CONDITION FROM 1ST CONDITIONS DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-condition"),
        "David needs the thing"
      );
      // SELECT A RETURN FROM THE RETURN DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-select-return"),
        "Address"
      );
      // SELECT THE ELSEIF BUTTON TO DISPLAY NEXT CONDITIONAL BLOCK
      userEvent.click(screen.getByTestId("button-elseif"));

      expect(screen.getByTestId("conditional-block-additional")).toHaveClass(
        "expression-conditional-block-extra"
      );
    });

    // LOOK AT THE MULTIPLE TIMES WE CAN USE THE BLOCKS!!!!!!

    test("Enter a string into else return input", async () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={conditionalLogicExpression}
            data={data}
          />
        </RenderWithContext>
      );
      // SELECT CONDITIONAL
      userEvent.selectOptions(
        screen.getByTestId("expression-select"),
        "conditional"
      );
      // SELECT A CONDITION FROM 1ST CONDITIONS DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-condition"),
        "David needs the thing"
      );
      // SELECT A RETURN FROM THE RETURN DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-select-return"),
        "Address"
      );
      // ENTER A STRING INTO THE ELSE RETURN
      userEvent.type(
        screen.getByTestId("expression-else-return"),
        "TEST STRING"
      );

      expect(screen.getByTestId("expression-else-return")).toHaveValue(
        "TEST STRING"
      );
    });

    test("Click save to add expression", async () => {
      render(
        <RenderWithContext>
          <LogicExpressionEdit
            logicExpression={logicalExpressions}
            data={data}
          />
        </RenderWithContext>
      );

      // SELECT CONDITIONAL
      userEvent.selectOptions(
        screen.getByTestId("expression-select"),
        "conditional"
      );
      // SELECT A CONDITION FROM 1ST CONDITIONS DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-condition"),
        "David needs the thing"
      );
      // SELECT A RETURN FROM THE RETURN DROPDOWN
      userEvent.selectOptions(
        screen.getByTestId("expression-select-return"),
        "Address"
      );
      // ENTER A STRING INTO THE ELSE RETURN
      userEvent.type(
        screen.getByTestId("expression-else-return"),
        "TEST STRING"
      );
      // SELECT SAVE TO ENSURE CONDITIONAL EXPRESSION IS SAVED
      userEvent.click(screen.getByTestId("expression-save-button"));

      // PASSES BUT I'M NOT HAPPY THAT THIS DISPLAYS THE CORRECT OUTCOMES
      // HAS FOCUS MAYBE BUT DOES THIS PROVE THE INTERACTION IS SUCCESSFUL?
      expect(screen.getByTestId("expression-save-button")).toHaveFocus();
    });
  });
});
