import config from "../../../../config";

export const designerViewHandler = {
  template: "designer",
  context: {
    phase: config.phase,
    previewUrl: config.previewUrl,
    footerText: config.footerText,
  },
};
