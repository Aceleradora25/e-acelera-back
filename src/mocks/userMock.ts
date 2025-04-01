import { ItemStatus, ElementType } from "@prisma/client"

export const mockedUser = { 
  email: "usuariaaceleradora@gmail.com",
  provider: "google",
  loginDate: new Date(),
  Progress: {
    create: [
      {
        itemId: "rw17169056027059821dc",
        itemStatus: ItemStatus.InProgress, 
        elementType: ElementType.Exercise, 
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw1716905602727ecf72e",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Exercise,
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw17256421537956df97b",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Exercise,
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw1725642159329a2d9f4",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Exercise,
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw172564217048038aaf4",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Exercise,
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw1725642166308a69249",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Exercise,
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
      {
        itemId: "rw1725630408780f28e7a",
        itemStatus: ItemStatus.Completed,
        elementType: ElementType.Video, 
        topicId: "rw1721236357157ccf465",
        modifiedAt: new Date()
      },
    ],
  },
}
