export const useExpandedStory = () => useState<UserStory | null>("expandedStory", () => null);
export const useExpandedStoryFeatures = () => useState<Feature[]>("expandedStoryFeatures", () => []);
export const useExpandedFeature = () => useState<Feature | null>("expandedFeature", () => null);
export const useExpandedFeatureTasks = () => useState<Task[]>("expandedFeatureTasks", () => []);
