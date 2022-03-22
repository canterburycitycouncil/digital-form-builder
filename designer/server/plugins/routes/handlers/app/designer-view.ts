import config from "../../../../config";

export const designerViewHandler = {
  view: "designer",
  context: {
    phase: config.phase,
    previewUrl: config.previewUrl,
    footerText: config.footerText,
  },
};
