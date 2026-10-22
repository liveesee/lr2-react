import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import PropTypes from "prop-types"
import LikeButton from "../LikeButton/LikeButton.jsx"
import CommentInput from "../CommentInput/CommentInput.jsx"
import { Avatar, CommentIcon, ShareIcon } from "../icons.jsx"
import styles from "./ArticleCard.module.css"

export default function ArticleCard({ slug, title, author, previewText, imageUrl, minutes }) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  return (
    <article className={styles.card}>
      <Image className={styles.cover} src={imageUrl} alt="" width={800} height={400} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <Avatar />
          <div>
            <p className={styles.author}>{author}</p>
            <p className={styles.minutes}>{minutes} мин</p>
          </div>
        </div>
        <h2 className={styles.title}>
          <Link href={`/posts/${slug}`} className={styles.link}>
            {title}
          </Link>
        </h2>
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
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  previewText: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  minutes: PropTypes.number.isRequired,
}
