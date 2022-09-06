import { FormDefinition } from "@xgovformbuilder/model";

import { addLink } from "../addLink";

const data: FormDefinition = {
  conditions: [],
  lists: [],
  name: "",
  pages: [
    {
      title: "scrambled",
      path: "/scrambled",
      next: [{ path: "/poached" }],
    },
    { title: "poached", path: "/poached" },
    { title: "sunny", path: "/sunny" },
  ],
};

test("addLink throws if to, from or both are not found", () => {
  // ALTER PARAMS TO TEST OUT SCENARIOS
  expect(() => addLink(data, "404", "4004")).toThrow(
    /no page found with the path 404/
  );
  expect(() => addLink(data, "404", "/scrambled")).toThrow(
    /no page found with the path 404/
  );
  expect(() => addLink(data, "/scrambled", "404")).toThrow(
    /no page found with the path 404/
  );
});

test("addLink throws if to and from are equal", async () => {
  expect(() => addLink(data, "404", "404")).toThrow(
    /Cannot link a page to itself/
  );
});

test("addLink successfully adds a new link", () => {
  expect(addLink(data, "/poached", "/sunny")).toEqual({
    conditions: [],
    lists: [],
    name: "",
    pages: [
      {
        title: "scrambled",
        path: "/scrambled",
        next: [{ path: "/poached" }],
      },
      { title: "poached", path: "/poached", next: [{ path: "/sunny" }] },
      { title: "sunny", path: "/sunny" },
    ],
  });
});

test("addLink does nothing happens if the link already exists", () => {
  expect(addLink(data, "/scrambled", "/poached")).toEqual({
    conditions: [],
    lists: [],
    name: "",
    pages: [
      {
        title: "scrambled",
        path: "/scrambled",
        next: [{ path: "/poached" }],
      },
      { title: "poached", path: "/poached" },
      { title: "sunny", path: "/sunny" },
    ],
  });
});
