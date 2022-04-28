import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import { Data, FormDefinition } from "@xgovformbuilder/data-model";
import { shallow } from "enzyme";
import React from "react";
import sinon from "sinon";

import ConditionEdit from "../client/condition-edit";
import { assertTextInput } from "./helpers/element-assertions";

const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { suite, test } = lab;

suite("Condition edit", () => {
  const data: Partial<FormDefinition> = {
    conditions: [
      { name: "abdefg", displayName: "My condition", value: "badgers" },
    ],
  };

  test("Renders a form with display name and condition editor inputs", () => {
    const wrapper = shallow(
      <ConditionEdit
        condition={{
          name: "abdefg",
          displayName: "My condition",
          value: "badgers",
        }}
        data={data}
      />
    );
    const form = wrapper.find("form");
    const displayNameInput = form.find("input");
    assertTextInput({
      wrapper: displayNameInput,
      id: "condition-name",
      expectedValue: "My condition",
    });

    const editor = form.find("Editor");
    expect(editor.prop("name")).to.equal("value");
    expect(editor.prop("value")).to.equal("badgers");
    expect(Object.keys(editor.props()).includes("required")).to.equal(true);
    expect(editor.prop("valueCallback")).to.equal(
      wrapper.instance().onValueChange
    );
  });

  test("Cancelling the form calls the onCancel callback", async (flags) => {
    const event = { target: {}, preventDefault: sinon.spy() };
    const onCancel = (e) => {
      expect(e).to.equal(event);
    };
    const wrappedOnCancel = flags.mustCall(onCancel, 1);
    const wrapper = shallow(
      <ConditionEdit
        condition={{
          name: "abdefg",
          displayName: "My condition",
          value: "badgers",
        }}
        data={data}
        onCancel={wrappedOnCancel}
      />
    );
    const form = wrapper.find("form");
    const backLink = form.find("a.govuk-back-link");
    await backLink.simulate("click", event);
  });
});
