import { useDispatch, useSelector } from "react-redux"
import { articles } from "../../data/articles.js"
import { selectActiveTag, setActiveTag } from "../../store/filterSlice.js"
import styles from "./TagFilter.module.css"

const tags = [...new Set(articles.map((article) => article.tag))]

export default function TagFilter() {
  const dispatch = useDispatch()
  const activeTag = useSelector(selectActiveTag)

  return (
    <div className={styles.bar} role="group" aria-label="Фильтр по рубрикам">
      <button
        type="button"
        className={activeTag === null ? styles.active : styles.tag}
        aria-pressed={activeTag === null}
        onClick={() => dispatch(setActiveTag(null))}
      >
        Все
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={activeTag === tag ? styles.active : styles.tag}
          aria-pressed={activeTag === tag}
          onClick={() => dispatch(setActiveTag(tag))}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
