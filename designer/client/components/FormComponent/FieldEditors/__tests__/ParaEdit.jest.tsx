import { render, screen } from "@testing-library/react";
import React from "react";

import { DataContext } from "../../../../context";
import { ComponentContext } from "../../componentReducer/componentReducer";
import { ParaEdit } from "../para-edit";

describe("para edit", () => {
  function TestComponentWithContext({ children }) {
    let data = {
      pages: [
        {
          title: "First page",
          path: "/first-page",
          components: [
            {
              name: "IDDQl4",
              title: "abc",
              schema: {},
              options: {},
              type: "Para",
            },
          ],
        },
      ],
      conditions: [],
    };
    const dataValue = { data, save: jest.fn() };
    const compContextValue = {
      state: { selectedComponent: {} },
      dispatch: jest.fn(),
    };
    return (
      <DataContext.Provider value={dataValue}>
        <ComponentContext.Provider value={compContextValue}>
          {children}
        </ComponentContext.Provider>
      </DataContext.Provider>
    );
  }

  let textParaEdit;

  beforeEach(() => {
    textParaEdit = render(
      <TestComponentWithContext>
        <ParaEdit context={ComponentContext} />
      </TestComponentWithContext>
    );
  });

  test("Should render with correct content label screen text", () => {
    const text = "Content";
    expect(textParaEdit.getByText(text)).toBeInTheDocument();
  });

  test("Should render content help text", () => {
    const text =
      "Enter the text you want to show. You can apply basic HTML, such as text formatting and hyperlinks.";
    expect(textParaEdit.getByText(text)).toBeInTheDocument();
  });

  test("Should render with correct Conditions label screen text", () => {
    const text = "Conditions (optional)";
    expect(textParaEdit.getByText(text)).toBeInTheDocument();
  });

  test("Should render with correct Conditions help text screen text", () => {
    const text =
      "Select a condition that determines whether to show the contents of this component. You can create and edit conditions from the Conditions screen.";
    expect(textParaEdit.getByText(text)).toBeInTheDocument();
  });
});
