import { DataItem, StackbyEndpoint, ThemeField, TopicField } from "../types/types";

export const PROGRESS_CALCULATION_BY_ENTITY: Record<StackbyEndpoint, (id: string, data: DataItem[]) => number> = {
  [StackbyEndpoint.THEMES]: (id, data) => {
    const theme = data.find(dataItem => dataItem.id === id);
    if (!theme) return 0;
    const topicsInfo = (theme.field as ThemeField).topicsInfo;
    const topicsCount = topicsInfo ? topicsInfo.split(",").length : 0;
    return topicsCount;
  },
  [StackbyEndpoint.TOPICS]: (id, data) => {
    let exercisesCount
    const topic = data.find(dataItem => dataItem.id === id);
    
    if (!topic) return 0;
    const exercisesInfo = (topic.field as TopicField).exercisesInfo;

    if(exercisesInfo !== "Untitle") {
      exercisesCount = exercisesInfo ? exercisesInfo.split(",").length : 0;
    } else {
      exercisesCount = 0
    }

    const videoCount = (topic.field as TopicField).videoInfo ? 1 : 0;
    return exercisesCount + videoCount;
  },
  [StackbyEndpoint.EXERCISES]: (_id, _data) => 0,
}