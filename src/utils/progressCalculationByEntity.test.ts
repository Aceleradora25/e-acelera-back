import {
  countTopicItems,
  countThemeItems,
  PROGRESS_CALCULATION_BY_ENTITY,
} from './progressCalculationByEntity';
import {
  StackbyEndpoint,
  TopicField,
  ThemeField,
  StackbyDataResponse,
} from '../types/types';

describe('progressCalculationByEntity util', () => {
  function makeTopicField(overrides: Partial<TopicField> = {}): TopicField {
    return {
      rowId: '1',
      sequence: 1,
      isConfigure: 0,
      favourite: 0,
      totalItems: null,
      completedItems: null,
      dueDateTimestamp: null,
      checklistId: null,
      remainderId: null,
      updatedAt: '',
      createdAt: '',
      title: '',
      description: '',
      cardDescription: '',
      video: '',
      references: '',
      theme: '',
      exercises: '',
      exercisesDescription: '',
      exercisesInfo: '',
      videoDescription: '',
      videoLink: '',
      videoReference: '',
      videoInfo: '',
      ...overrides,
    };
  }

  function makeThemeField(overrides: Partial<ThemeField> = {}): ThemeField {
    return {
      rowId: '1',
      sequence: 1,
      isConfigure: 0,
      favourite: 0,
      totalItems: null,
      completedItems: null,
      dueDateTimestamp: null,
      checklistId: null,
      remainderId: null,
      updatedAt: '',
      createdAt: '',
      title: '',
      description: '',
      topicsInfo: '',
      cardDescription: '',
      image: null,
      topics: '',
      category: '',
      topicsDescription: '',
      alt: '',
      ...overrides,
    };
  }

  const mockTopics: StackbyDataResponse = {
    data: [
      {
        id: 'topic1',
        field: makeTopicField({
          exercisesInfo: 'ex1,ex2,ex3',
          videoInfo: 'video1',
        }),
      },
      {
        id: 'topic2',
        field: makeTopicField({ exercisesInfo: '', videoInfo: '' }),
      },
      {
        id: 'topic3',
        field: makeTopicField({ exercisesInfo: 'Untitle', videoInfo: '' }),
      },
    ],
  };

  const mockThemes: StackbyDataResponse = {
    data: [
      {
        id: 'theme1',
        field: makeThemeField({ topicsInfo: 'topic1,topic2' }),
      },
      {
        id: 'theme2',
        field: makeThemeField({ topicsInfo: '' }),
      },
      {
        id: 'theme3',
        field: makeThemeField({}),
      },
    ],
  };

  it('countTopicItems retorna 0 se o tópico não existe', () => {
    expect(countTopicItems('notfound', mockTopics)).toBe(0);
  });

  it('countTopicItems retorna 0 se não há exercícios nem vídeo', () => {
    expect(countTopicItems('topic2', mockTopics)).toBe(0);
  });

  it('countTopicItems retorna apenas exercícios se não há vídeo', () => {
    const topics: StackbyDataResponse = {
      data: [
        {
          id: 'topic4',
          field: makeTopicField({ exercisesInfo: 'ex1,ex2', videoInfo: '' }),
        },
      ],
    };
    expect(countTopicItems('topic4', topics)).toBe(2);
  });

  it('countTopicItems retorna exercícios + vídeo', () => {
    expect(countTopicItems('topic1', mockTopics)).toBe(4);
  });

  it('countTopicItems retorna 0 se exercisesInfo for "Untitle"', () => {
    expect(countTopicItems('topic3', mockTopics)).toBe(0);
  });

  it('countThemeItems retorna 0 se o tema não existe', () => {
    expect(countThemeItems('notfound', mockThemes, mockTopics)).toBe(0);
  });

  it('countThemeItems retorna 0 se não há topicsInfo', () => {
    expect(countThemeItems('theme3', mockThemes, mockTopics)).toBe(0);
  });

  it('countThemeItems retorna 0 se topicsInfo está vazio', () => {
    expect(countThemeItems('theme2', mockThemes, mockTopics)).toBe(0);
  });

  it('countThemeItems soma corretamente os itens dos tópicos', () => {
    expect(countThemeItems('theme1', mockThemes, mockTopics)).toBe(4); // topic1: 4, topic2: 0
  });

  it('PROGRESS_CALCULATION_BY_ENTITY retorna as funções corretas', () => {
    expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.TOPICS]).toBe(
      countTopicItems
    );
    expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.THEMES]).toBe(
      countThemeItems
    );
    expect(PROGRESS_CALCULATION_BY_ENTITY[StackbyEndpoint.EXERCISES]()).toBe(0);
  });
}); 