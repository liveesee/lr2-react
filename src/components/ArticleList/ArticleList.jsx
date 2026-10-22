import { useSelector } from "react-redux"
import { articles } from "../../data/articles.js"
import { selectActiveTag } from "../../store/filterSlice.js"
import ArticleCard from "../ArticleCard/ArticleCard.jsx"
import styles from "./ArticleList.module.css"

export default function ArticleList() {
  const activeTag = useSelector(selectActiveTag)
  const visible = activeTag
    ? articles.filter((article) => article.tag === activeTag)
    : articles

  if (visible.length === 0) {
    return <p className={styles.empty}>Статей с этим тегом нет.</p>
  }

  return (
    <div className={styles.list}>
      {visible.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  )
}
