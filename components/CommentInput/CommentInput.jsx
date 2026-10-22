import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { fetchComments, postComment } from "@/lib/api"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { Arrow, Avatar } from "../icons.jsx"
import styles from "./CommentInput.module.css"

export default function CommentInput({ article }) {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState(false)
  const [comments, setComments] = useState([])
  const [requestError, setRequestError] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true
    fetchComments(article)
      .then((list) => {
        if (active) setComments(list)
      })
      .catch(() => {
        if (active) setRequestError("Не удалось загрузить комментарии")
      })
    return () => {
      active = false
    }
  }, [article])

  async function publish() {
    const value = text.trim()
    if (!value) {
      setError(true)
      return
    }
    setSending(true)
    setRequestError("")
    try {
      const comment = await postComment(article, value)
      setComments((list) => [...list, comment])
      setText("")
      setError(false)
    } catch {
      setRequestError("Не удалось отправить комментарий")
    } finally {
      setSending(false)
    }
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
      <button type="submit" className={styles.post} disabled={sending}>
        <span>Отправить</span>
        <Arrow />
      </button>
      {requestError ? (
        <p className={styles.errorText} role="alert">
          {requestError}
        </p>
      ) : null}
      {comments.length === 0 ? (
        <p className={styles.empty}>Пока нет комментариев</p>
      ) : (
        <ul className={styles.list} aria-label="Комментарии">
          {comments.map((comment) => (
            <li key={comment._id} className={styles.item}>
              <p className={styles.author}>
                {comment.author}
                <span className={styles.date}> · {formatTimeAgo(comment.createdAt)}</span>
              </p>
              <p className={styles.text}>{comment.text}</p>
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}

CommentInput.propTypes = {
  article: PropTypes.string.isRequired,
}
