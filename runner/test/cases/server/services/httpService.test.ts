import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import sinon from "sinon";
import wreck from "wreck";

import { post } from "../../../../src/server/services/httpService";

const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { afterEach, suite, test } = lab;

suite("Http Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("post request payload format is correct", async () => {
    sinon.stub(wreck, "post").returns(
      Promise.resolve({
        res: {},
        payload: { reference: "1234" },
      })
    );
    const result = await post("/test", {});
    // @ts-ignore
    expect(result).to.equal({ res: {}, payload: { reference: "1234" } });
  });
});
