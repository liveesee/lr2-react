import ArticleCard from "./components/ArticleCard/ArticleCard.jsx"
import { Logo } from "./components/icons.jsx"
import { articles } from "./data/articles.js"

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <Logo />
          <span className="word">FOLIA</span>
        </div>
        <p className="tagline">Редакционный блог</p>
      </header>
      <main className="list">
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </main>
    </div>
  )
}
