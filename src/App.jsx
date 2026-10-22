import ArticleList from "./components/ArticleList/ArticleList.jsx"
import TagFilter from "./components/TagFilter/TagFilter.jsx"
import { Logo } from "./components/icons.jsx"

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
      <TagFilter />
      <main>
        <ArticleList />
      </main>
    </div>
  )
}