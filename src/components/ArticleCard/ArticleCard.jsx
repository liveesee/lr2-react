import { useState } from "react"
import PropTypes from "prop-types"
import LikeButton from "../LikeButton/LikeButton.jsx"
import CommentInput from "../CommentInput/CommentInput.jsx"
import { Avatar, CommentIcon, ShareIcon } from "../icons.jsx"
import styles from "./ArticleCard.module.css"

export default function ArticleCard({ title, author, previewText, imageUrl, minutes, tag }) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  return (
    <article className={styles.card}>
      <img className={styles.cover} src={imageUrl} alt="" />
      <div className={styles.body}>
        <div className={styles.meta}>
          <Avatar />
          <div>
            <p className={styles.author}>{author}</p>
            <p className={styles.minutes}>{minutes} мин</p>
          </div>
        </div>
        <p className={styles.rubric}>{tag}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.excerpt}>{previewText}</p>
        <div className={styles.actions}>
          <LikeButton />
          <div className={styles.trailing}>
            <button
              type="button"
              className={styles.comment}
              aria-expanded={commentsOpen}
              onClick={() => setCommentsOpen((open) => !open)}
            >
              <CommentIcon />
              <span>Комментарий</span>
            </button>
            <button type="button" className={styles.share} aria-label="Поделиться">
              <ShareIcon />
            </button>
          </div>
        </div>
        <div className={styles.thread} hidden={!commentsOpen}>
          <CommentInput />
        </div>
      </div>
    </article>
  )
}

ArticleCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  previewText: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  minutes: PropTypes.number.isRequired,
  tag: PropTypes.string.isRequired,
}
