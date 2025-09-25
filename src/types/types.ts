import { ElementType, ItemStatus } from "@prisma/client"

export interface UserToken {
  name: string
  email: string
  sub: string
  id: string
  provider: string
  accessToken: string
  iat: number
  exp: number
  jti: string
}

export interface SaveStatusProgress {
  itemId: string,
  elementType: ElementType,
  userId: number,
  itemStatus: ItemStatus,
  topicId: string,
  themeId: string
}

export enum StackbyEndpoint {
  EXERCISES = "Exercises",
  TOPICS = "Topics",
  THEMES = "Themes"
}

export enum ThemeType {
  LEVELING = "nivelamento",
  SELFSTUDY = "autoestudo"
}

export enum IdType {
  TOPIC_ID = "topicId",
  THEME_ID = "themeId"
};

export interface GetProgress {
  userId: number
  id: string
  idType: IdType
}
export interface SingleProgressResponse extends SaveStatusProgress {
  modifiedAt: Date
}

export interface StackbyDataResponse {
    data: DataItem[];
}
export interface DataItem {
    id: string;
    field: CommonField | ThemeField | TopicField | VideoField | ExercisesField;
}
export interface CommonField {
    rowId: string;
    sequence: number;
    isConfigure: number;
    favourite: number;
    totalItems: number | null;
    completedItems: number | null;
    dueDateTimestamp: number | null;
    checklistId: string | null;
    remainderId: string | null;
    updatedAt: string;
    createdAt: string;
    title: string;
    description: string;
    category?:string
}

export interface ThemeField extends CommonField {
    topicsInfo: string;
    cardDescription: string;
    image: Image[] | null;
    topics: string;
    category: string;
    topicsDescription: string;
    alt: string;
}

export interface TopicField extends CommonField {
    cardDescription: string;
    video: string;
    references: string;
    theme: string;
    exercises: string;
    exercisesDescription: string;
    exercisesInfo: string;
    videoDescription: string;
    videoLink: string;
    videoReference: string;
    videoInfo: string
};

export interface VideoField extends CommonField {
    link: string;
    topics: string;
}

export interface ExercisesField extends CommonField {
    image: Image[] | null;
    topics: string;
}
export interface Image {
    filename: string;
    type: string;
    url: string;
}
