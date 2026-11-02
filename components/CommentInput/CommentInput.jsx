import { useEffect, useId, useRef, useState } from "react"
import PropTypes from "prop-types"
import { fetchComments, postComment } from "@/lib/api"
import { formatTimeAgo } from "@/lib/formatTimeAgo"
import { Arrow, Avatar } from "../icons.jsx"
import styles from "./CommentInput.module.css"

export default function CommentInput({ article }) {
  const [text, setText] = useState("")
  const [error, setError] = useState(false)
  const [comments, setComments] = useState([])
  const [requestError, setRequestError] = useState("")
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState("")
  const inputRef = useRef(null)
  const id = useId()
  const inputId = `${id}-input`
  const errorId = `${id}-error`

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
      inputRef.current?.focus()
      return
    }
    setSending(true)
    setRequestError("")
    setStatus("")
    try {
      const comment = await postComment(article, value)
      setComments((list) => [...list, comment])
      setText("")
      setError(false)
      setStatus("Комментарий опубликован")
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

  const fieldClass = [styles.field, error ? styles.error : ""].filter(Boolean).join(" ")

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label htmlFor={inputId} className={styles.label}>
        Текст комментария
      </label>
      <div className={fieldClass}>
        <Avatar />
        <input
          id={inputId}
          ref={inputRef}
          value={text}
          placeholder="Напишите вдумчивый ответ..."
          onChange={(event) => {
            setText(event.target.value)
            if (error && event.target.value.trim()) setError(false)
          }}
          onKeyDown={onKeyDown}
          aria-invalid={error}
          aria-describedby={error ? errorId : undefined}
          aria-keyshortcuts="Control+Enter Meta+Enter"
        />
      </div>
      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          Ошибка · добавьте пару слов
        </p>
      ) : null}
      <button type="submit" className={styles.post} disabled={sending}>
        <span>Отправить</span>
        <Arrow />
      </button>
      {requestError ? (
        <p className={styles.errorText} role="alert">
          {requestError}
        </p>
      ) : null}
      <p className="visually-hidden" role="status">
        {status}
      </p>
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
