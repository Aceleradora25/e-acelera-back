import { StackbyEndpoint, } from "../types/types.js";
import { countThemeItems, countTopicItems, PROGRESS_CALCULATION_BY_ENTITY, } from "./progressCalculationByEntity.js";
describe("progressCalculationByEntity util", () => {
    function makeTopicField(overrides = {}) {
        return {
            cardDescription: "",
            checklistId: null,
            completedItems: null,
            createdAt: "",
            description: "",
            dueDateTimestamp: null,
            exercises: "",
            exercisesDescription: "",
            exercisesInfo: "",
            favourite: 0,
            isConfigure: 0,
            references: "",
            remainderId: null,
            rowId: "1",
            sequence: 1,
            theme: "",
            title: "",
            totalItems: null,
            updatedAt: "",
            video: "",
            videoDescription: "",
            videoInfo: "",
            videoLink: "",
            videoReference: "",
            ...overrides,
        };
    }
    function makeThemeField(overrides = {}) {
        return {
            alt: "",
            cardDescription: "",
            category: "",
            checklistId: null,
            completedItems: null,
            createdAt: "",
            description: "",
            dueDateTimestamp: null,
            favourite: 0,
            image: null,
            isConfigure: 0,
            remainderId: null,
            rowId: "1",
            sequence: 1,
            title: "",
            topics: "",
            topicsDescription: "",
            topicsInfo: "",
            totalItems: null,
            updatedAt: "",
            ...overrides,
        };
    }
    const mockTopics = {
        data: [
            {
                field: makeTopicField({
                    exercisesInfo: "ex1,ex2,ex3",
                    videoInfo: "video1",
                }),
                id: "topic1",
            },
            {
                field: makeTopicField({ exercisesInfo: "", videoInfo: "" }),
                id: "topic2",
            },
            {
                field: makeTopicField({ exercisesInfo: "Untitle", videoInfo: "" }),
                id: "topic3",
            },
        ],
    };
    const mockThemes = {
        data: [
            {
                field: makeThemeField({ topicsInfo: "topic1,topic2" }),
                id: "theme1",
            },
            {
                field: makeThemeField({ topicsInfo: "" }),
                id: "theme2",
            },
            {
                field: makeThemeField({}),
                id: "theme3",
            },
        ],
    };
    it("countTopicItems retorna 0 se o tópico não existe", () => {
        expect(countTopicItems("notfound", mockTopics)).toBe(0);
    });
    it("countTopicItems retorna 0 se não há exercícios nem vídeo", () => {
        expect(countTopicItems("topic2", mockTopics)).toBe(0);
    });
    it("countTopicItems retorna apenas exercícios se não há vídeo", () => {
        const topics = {
            data: [
                {
                    field: makeTopicField({ exercisesInfo: "ex1,ex2", videoInfo: "" }),
                    id: "topic4",
                },
            ],
        };
        expect(countTopicItems("topic4", topics)).toBe(2);
    });
    it("countTopicItems retorna exercícios + vídeo", () => {
        expect(countTopicItems("topic1", mockTopics)).toBe(4);
    });
    it('countTopicItems retorna 0 se exercisesInfo for "Untitle"', () => {
        expect(countTopicItems("topic3", mockTopics)).toBe(0);
    });
    it("countThemeItems retorna 0 se o tema não existe", () => {
        expect(countThemeItems("notfound", mockThemes, mockTopics)).toBe(0);
    });
    it("countThemeItems retorna 0 se não há topicsInfo", () => {
        expect(countThemeItems("theme3", mockThemes, mockTopics)).toBe(0);
    });
    it("countThemeItems retorna 0 se topicsInfo está vazio", () => {
        expect(countThemeItems("theme2", mockThemes, mockTopics)).toBe(0);
    });
    it("countThemeItems soma corretamente os itens dos tópicos", () => {
        expect(countThemeItems("theme1", mockThemes, mockTopics)).toBe(4); // topic1: 4, topic2: 0
    });
    it("PROGRESS_CALCULATION_BY_ENTITY retorna as funções corretas", () => {
        expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.TOPICS]).toBe(countTopicItems);
        expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.THEMES]).toBe(countThemeItems);
        expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.EXERCISES]()).toBe(0);
    });
});
