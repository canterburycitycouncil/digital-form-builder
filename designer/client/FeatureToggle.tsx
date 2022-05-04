import { useFeatures } from "@xgovformbuilder/designer/client/hooks/featureToggling";

const FeatureToggle = ({ feature, children }) => {
  const features = useFeatures();
  return features[feature] ? children : null;
};

export default FeatureToggle;
