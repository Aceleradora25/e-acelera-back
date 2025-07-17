import {
  StackbyDataResponse,
  StackbyEndpoint,
  ThemeField,
  TopicField,
} from "../types/types";

export function countTopicItems(
  id: string,
  topics: StackbyDataResponse
): number {
  const topic = topics.data.find((topic) => topic.id === id);
  if (!topic) return 0;

  const field = topic.field as TopicField;
  const { exercisesInfo, videoInfo } = field;

  const exerciseIds =
    exercisesInfo && exercisesInfo !== "Untitle"
      ? exercisesInfo.split(",").filter(Boolean)
      : [];

  return exerciseIds.length + (videoInfo ? 1 : 0);
}

export function countThemeItems(
  id: string,
  themes: StackbyDataResponse,
  topics: StackbyDataResponse
): number {
  const theme = themes.data.find((theme) => {
    return theme.id === id;
  });
  if (!theme) return 0;

  const field = theme.field as ThemeField;
  if (!field.topicsInfo) return 0;

  const topicIds = field.topicsInfo.split(",").filter(Boolean);

  return topicIds.reduce(
    (acc, topicId) => acc + countTopicItems(topicId, topics),
    0
  );  
}

export const PROGRESS_CALCULATION_BY_ENTITY = {
  [StackbyEndpoint.TOPICS]: countTopicItems,
  [StackbyEndpoint.THEMES]: countThemeItems,
  [StackbyEndpoint.EXERCISES]: () => 0,
};

export type ProgressCalculator = typeof PROGRESS_CALCULATION_BY_ENTITY;
