import { render } from "@testing-library/react";
import PageCreate from "@xgovformbuilder/designer/client/page-create";
import React from "react";

describe("page create fields text", () => {
  test("displays field titles and help texts", () => {
    const props = {
      path: "/some-path",
      data: {
        sections: [],
        pages: [],
      },
    };

    const { getByText } = render(<PageCreate {...props} />);
    expect(getByText("Page type")).toBeInTheDocument();
    expect(
      getByText(
        "Select a Start Page to start a form, a Question Page to request information, and a Summary Page at the end of a section or form. For example, use a Summary to let users check their answers to questions before they submit the form."
      )
    ).toBeInTheDocument();
    expect(getByText("Link from (optional)")).toBeInTheDocument();
    expect(
      getByText("Add a link to this page from a different page in the form.")
    ).toBeInTheDocument();
    expect(getByText("Page title")).toBeInTheDocument();
    expect(getByText("Path")).toBeInTheDocument();
    expect(
      getByText(
        "Appears in the browser path. The value you enter in the page title field automatically populates the path name. To override it, enter your own path name, relevant to the page, and use lowercase text and hyphens between words. For example, '/personal-details'."
      )
    ).toBeInTheDocument();
    expect(getByText("Section (optional)")).toBeInTheDocument();
    expect(
      getByText(
        "Use sections to split a form. For example, to add a section per applicant. The section title appears above the page title. However, if these titles are the same, the form will only show the page title."
      )
    ).toBeInTheDocument();
  });
});
