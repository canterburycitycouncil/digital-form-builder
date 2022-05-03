import { render } from "@testing-library/react";
import { RenderWithContext } from "designer/client/__tests__/helpers/renderers";
import { FileUploadFieldEdit } from "designer/client/file-upload-field-edit";
import React from "react";

describe("File upload", () => {
  describe("File upload Field", () => {
    let stateProps;
    let page;

    beforeEach(() => {
      stateProps = {
        component: {
          type: "FileUploadField",
          name: "TestFileUpload",
          options: {},
        },
      };

      page = render(
        <RenderWithContext stateProps={stateProps}>
          <FileUploadFieldEdit />
        </RenderWithContext>
      );
    });

    test("should display display correct title", () => {
      const text = "Allow multiple file upload";
      expect(page.getByText(text)).toBeInTheDocument();
    });

    test("should display display correct help text", () => {
      const text = "Tick this box to enable users to upload multiple files";
      expect(page.getByText(text)).toBeInTheDocument();
    });
  });
});
