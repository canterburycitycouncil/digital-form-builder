import { useContext } from "react";

import { FeatureFlagContext, FlagState } from "../context/FeatureFlagContext";

export const useFeatures = () => {
  const features: FlagState = useContext(FeatureFlagContext);
  return features;
};
