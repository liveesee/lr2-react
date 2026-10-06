import { useState } from "react"
import PropTypes from "prop-types"
import { Heart } from "../icons.jsx"
import styles from "./LikeButton.module.css"

export default function LikeButton({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Нравится"
      onClick={() => setCount((value) => value + 1)}
    >
      <Heart />
      <span className={styles.count}>{count}</span>
    </button>
  )
}

LikeButton.propTypes = {
  initialCount: PropTypes.number,
}
