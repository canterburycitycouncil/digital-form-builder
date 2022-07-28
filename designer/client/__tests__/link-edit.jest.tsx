import { within } from "@testing-library/dom";
import { fireEvent, render } from "@testing-library/react";
import LinkCreate from "@xgovformbuilder/designer/client/components/Links/link-create";
import { DataContext } from "@xgovformbuilder/designer/client/context";
import React from "react";

const data = {
  pages: [
    { path: "/1", title: "Page 1", next: [{ path: "/2" }] },
    { path: "/2", title: "Page 2" },
  ],
  conditions: [
    { name: "someCondition", displayName: "My condition" },
    { name: "anotherCondition", displayName: "Another condition" },
  ],
};

const dataValue = {
  data,
  save: jest.fn(),
};
export const customRender = (children, providerProps = dataValue) => {
  return render(
    <DataContext.Provider value={providerProps}>
      {children}
      <div id="portal-root" />
    </DataContext.Provider>
  );
};

test("Submitting with a condition updates the link", () => {
  const save = jest.fn();
  const { getByRole } = customRender(<LinkCreate />, {
    data,
    save,
  });
  fireEvent.click(getByRole("button"));
  const summary = within(getByRole("alert"));
  expect(summary.getByText("Enter from")).toBeInTheDocument();
  expect(summary.getByText("Enter to")).toBeInTheDocument();
});
