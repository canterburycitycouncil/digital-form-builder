import * as formConfigurationsApi from "@xgovformbuilder/designer/client/load-form-configurations";
import { server } from "@xgovformbuilder/designer/test/testServer";
import { rest } from "msw";

describe("Load form configurations", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("Should load configurations when returned", () => {
    const configurations = [{ myProperty: "myValue" }];
    server.resetHandlers(
      rest.get("/api/configurations", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(configurations));
      })
    );
    return formConfigurationsApi.loadConfigurations().then((data) => {
      expect(data).toStrictEqual(configurations);
    });
  });

  test("Should return no configurations when an error occurs", () => {
    server.resetHandlers(
      rest.get("/api/configurations", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json("Some error happened"));
      })
    );
    return formConfigurationsApi.loadConfigurations().then((data) => {
      expect(data).toStrictEqual([]);
    });
  });
});
