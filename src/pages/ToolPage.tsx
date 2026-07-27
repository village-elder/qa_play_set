import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getToolBySlug } from '../tools/registry'
import './ToolPage.css'

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>()
  const tool = getToolBySlug(slug)

  if (!tool || !tool.Component || tool.status !== 'available') {
    return (
      <div className="tool-page-missing">
        <h1>Інструмент не знайдено</h1>
        <p>Такого інструменту ще немає, або він у розробці.</p>
        <Link to="/">← До списку інструментів</Link>
      </div>
    )
  }

  const { Component } = tool

  return (
    <div className="tool-page">
      <Link to="/" className="back-link">
        ← До списку інструментів
      </Link>
      <header className="tool-page-header">
        <h1>{tool.title}</h1>
        <p>{tool.shortDescription}</p>
      </header>
      <Suspense fallback={<p>Завантаження…</p>}>
        <Component />
      </Suspense>
    </div>
  )
}
