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

export interface Progress {
  itemId: string,
  elementType: ElementType,
  userId: number,
  itemStatus: ItemStatus,
  topicId: string,
  themeId: string
}

export interface GetTopicProgress {
  totalItens: number
  userId: number
  topicId: string
}

export interface SingleProgressResponse extends Progress {
  modifiedAt: Date
}

export enum StackByEndpoint {
  EXERCISES = "Exercises",
  TOPICS = "Topics",
  THEMES = "Themes"
}
