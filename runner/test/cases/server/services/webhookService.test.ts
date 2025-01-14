import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";
import * as httpService from "runner/src/server/services/httpService";
import { WebhookService } from "runner/src/server/services/webhookService";
import sinon from "sinon";

const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { afterEach, suite, test } = lab;

suite("Server WebhookService Service", () => {
  afterEach(() => {
    sinon.restore();
  });

  test("Webhook returns correct reference when payload is string", async () => {
    sinon.stub(httpService, "post").returns(
      // @ts-ignore
      Promise.resolve({
        res: {},
        payload: JSON.stringify({ reference: "1234" }),
      })
    );
    const loggerSpy = {
      error: sinon.spy(),
      info: sinon.spy(),
      debug: sinon.spy(),
    };
    const serverMock = { logger: loggerSpy };
    const webHookeService = new WebhookService(serverMock);
    const result = await webHookeService.postRequest("/url", {});
    expect(result).to.equal("1234");
  });

  test("Webhook returns correct reference when payload is object", async () => {
    sinon.stub(httpService, "post").returns(
      // @ts-ignore
      Promise.resolve({
        res: {},
        payload: { reference: "ABCD" },
      })
    );
    const loggerSpy = sinon.spy();
    const serverMock = { logger: loggerSpy };
    const webHookeService = new WebhookService(serverMock);
    const result = await webHookeService.postRequest("/url", {});
    expect(result).to.equal("ABCD");
  });
});
