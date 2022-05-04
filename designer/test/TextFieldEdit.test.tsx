import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import { mount } from "enzyme";
import React from "react";

import { TextFieldEdit } from "../client/components/FieldEditors/text-field-edit";
import { MultilineTextFieldEdit } from "../client/multiline-text-field-edit";
import * as Component from "../client/reducers/component/componentReducer";
const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { test, suite } = lab;

suite("TextField renders correctly when", () => {
  const wrapper = mount(
    <Component.ComponentContextProvider>
      <TextFieldEdit />
    </Component.ComponentContextProvider>
  );

  test("schema max length changes", () => {
    const field = () => wrapper.find("#field-schema-length").first();
    const length = 1337;
    field().simulate("change", { target: { value: length } });
    expect(field().props().value).to.equal(length);
  });

  test("schema min length changes", () => {
    const field = () => wrapper.find("#field-schema-min").first();
    const length = 42;
    field().simulate("change", { target: { value: length } });
    expect(field().props().value).to.equal(length);
  });

  test("schema max length changes", () => {
    const field = () => wrapper.find("#field-schema-max").first();
    const length = 42;
    field().simulate("change", { target: { value: length } });
    expect(field().props().value).to.equal(length);
  });

  test("schema regex changes", () => {
    const field = () => wrapper.find("#field-schema-regex");
    const regex = "/ab+c/";
    field().simulate("change", { target: { value: regex } });
    expect(field().props().value).to.equal(regex);
  });
});

suite("MutlilineTextFieldEdit renders correctly when", () => {
  const wrapper = mount(
    <Component.ComponentContextProvider>
      <MultilineTextFieldEdit />
    </Component.ComponentContextProvider>
  );
  test("schema rows changes", () => {
    const field = () => wrapper.find("#field-options-rows");
    const newRows = 42;
    field().simulate("change", { target: { value: newRows } });
    expect(field().props().value).to.equal(newRows);
  });
});
