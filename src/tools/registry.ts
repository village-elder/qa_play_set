import { lazy } from 'react'
import type { ToolMeta } from '../types/tool'

const CharterBuilder = lazy(() => import('./charter-builder/CharterBuilder'))
const PairwiseGenerator = lazy(() => import('./pairwise/PairwiseGenerator'))
const InteractionMatrix = lazy(() => import('./interaction-matrix/InteractionMatrix'))

const toolDefinitions: ToolMeta[] = [
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
    slug: 'interaction-matrix',
    title: 'Feature Interaction Matrix',
    shortDescription:
      'Трикутна матриця перетинів фічей: познач, які пари вже перевірені, а які між собою не стосуються.',
    category: 'design',
    status: 'available',
    Component: InteractionMatrix,
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

// Available tools first (in a stable order), planned ones after.
export const tools: ToolMeta[] = [...toolDefinitions].sort((a, b) => {
  if (a.status === b.status) return 0
  return a.status === 'available' ? -1 : 1
})

export function getToolBySlug(slug: string | undefined): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug)
}
