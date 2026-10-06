import { useState } from "react"
import { Arrow, Avatar } from "../icons.jsx"
import styles from "./CommentInput.module.css"

export default function CommentInput() {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState(false)
  const [comments, setComments] = useState([])

  function publish() {
    const value = text.trim()
    if (!value) {
      setError(true)
      return
    }
    setComments((list) => [...list, { id: Date.now(), author: "Вы", text: value }])
    setText("")
    setError(false)
  }

  function onSubmit(event) {
    event.preventDefault()
    publish()
  }

  function onKeyDown(event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      publish()
    }
  }

  const fieldClass = [styles.field, focused ? styles.focused : "", error ? styles.error : ""]
    .filter(Boolean)
    .join(" ")

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={fieldClass}>
        <Avatar />
        <input
          value={text}
          placeholder={error ? "Комментарий не может быть пустым" : "Напишите вдумчивый ответ..."}
          onChange={(event) => {
            setText(event.target.value)
            if (error && event.target.value.trim()) setError(false)
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          aria-label="Текст комментария"
        />
      </div>
      {error ? <p className={styles.errorText}>Ошибка · добавьте пару слов</p> : null}
      <button type="submit" className={styles.post}>
        <span>Опубликовать</span>
        <Arrow />
      </button>
      {comments.length === 0 ? (
        <p className={styles.empty}>Пока нет комментариев</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.item}>
              <p className={styles.author}>{comment.author}</p>
              <p className={styles.text}>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
