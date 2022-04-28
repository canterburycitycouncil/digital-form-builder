export function simplePageMock() {
  return {
    pages: [
      {
        title: "First page",
        path: "/first-page",
        components: [],
        controller: "designer/client/__tests__/pages/summary.js",
        section: "home",
      },
    ],
    lists: [],
  };
}
