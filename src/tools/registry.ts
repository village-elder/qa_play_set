import { lazy } from 'react'
import type { ToolMeta } from '../types/tool'

const CharterBuilder = lazy(() => import('./charter-builder/CharterBuilder'))
const PairwiseGenerator = lazy(() => import('./pairwise/PairwiseGenerator'))

export const tools: ToolMeta[] = [
  {
    slug: 'charter-builder',
    title: 'Charter Builder',
    shortDescription:
      'Структуруй сесію дослідницького тестування: місія, тайм-бокс, підказки-евристики та нотатки під час сесії.',
    category: 'exploratory',
    status: 'available',
    Component: CharterBuilder,
  },
  {
    slug: 'boundary-value',
    title: 'Boundary Value & Equivalence Partitioning',
    shortDescription:
      'Розрахунок граничних значень та класів еквівалентності за діапазоном або переліком допустимих значень.',
    category: 'design',
    status: 'planned',
  },
  {
    slug: 'pairwise',
    title: 'Pairwise Generator',
    shortDescription:
      'Мінімальний набір комбінацій параметрів, що покриває всі попарні поєднання значень.',
    category: 'design',
    status: 'available',
    Component: PairwiseGenerator,
  },
  {
    slug: 'decision-table',
    title: 'Decision Table Generator',
    shortDescription:
      'Повна таблиця рішень за умовами та діями — для пов’язаної бізнес-логіки, де скорочення неприпустиме.',
    category: 'design',
    status: 'planned',
  },
  {
    slug: 'state-transition',
    title: 'State Transition Tool',
    shortDescription:
      'Граф станів і переходів із генерацією тест-сценаріїв покриття переходів.',
    category: 'design',
    status: 'planned',
  },
  {
    slug: 'test-data',
    title: 'Test Data Generator',
    shortDescription:
      'Валідні та невалідні тестові дані за JSON Schema для API-тестів.',
    category: 'data',
    status: 'planned',
  },
]

export function getToolBySlug(slug: string | undefined): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug)
}
