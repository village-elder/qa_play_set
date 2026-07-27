import { Link } from 'react-router-dom'
import { tools } from '../tools/registry'
import { CATEGORY_LABELS } from '../types/tool'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home">
      <section className="intro">
        <h1>Інструменти для тест-дизайну</h1>
        <p>
          Невеликі калькулятори та генератори, що автоматизують рутинну
          частину технік тест-дизайну — pairwise, граничні значення, таблиці
          рішень, чартери для дослідницького тестування — і залишають
          аналітику вам.
        </p>
      </section>

      <section className="tool-grid">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  )
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const content = (
    <>
      <div className="tool-card-top">
        <span className="tool-category">{CATEGORY_LABELS[tool.category]}</span>
        {tool.status === 'planned' && (
          <span className="tool-badge">незабаром</span>
        )}
      </div>
      <h2>{tool.title}</h2>
      <p>{tool.shortDescription}</p>
    </>
  )

  if (tool.status === 'planned') {
    return <div className="tool-card tool-card-disabled">{content}</div>
  }

  return (
    <Link to={`/tools/${tool.slug}`} className="tool-card">
      {content}
    </Link>
  )
}
