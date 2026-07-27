import type { ComponentType } from 'react'

export type ToolCategory = 'design' | 'exploratory' | 'data'

export interface ToolMeta {
  slug: string
  title: string
  shortDescription: string
  category: ToolCategory
  status: 'available' | 'planned'
  Component?: ComponentType
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  design: 'Тест-дизайн',
  exploratory: 'Дослідницьке тестування',
  data: 'Тестові дані',
}
