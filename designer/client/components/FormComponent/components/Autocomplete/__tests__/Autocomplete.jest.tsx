import { render } from "@testing-library/react";
import { RenderWithContext } from "designer/client/__tests__/helpers/renderers";
import { Autocomplete } from "designer/client/components/FormComponent/components/Autocomplete/Autocomplete";
import React from "react";

describe("AutocompleteField", () => {
  let stateProps;
  let page;

  beforeEach(() => {
    stateProps = {
      component: {
        type: "AutocompleteField",
        name: "TestCssClass",
        options: {},
      },
    };

    page = render(
      <RenderWithContext stateProps={stateProps}>
        <Autocomplete />
      </RenderWithContext>
    );
  });

  test("should display display correct title", () => {
    const text = "Autocomplete";
    expect(page.getByText(text)).toBeInTheDocument();
  });

  test("should display display correct helptext", () => {
    const text =
      "Add the autocomplete attribute to this field. For example, 'on' or 'given-name'.";
    expect(page.getByText(text)).toBeInTheDocument();
  });
});
