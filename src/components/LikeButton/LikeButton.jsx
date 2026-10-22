import { useState } from "react"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import { Heart } from "../icons.jsx"

export default function LikeButton({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount)

  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<Heart />}
      aria-label="Нравится"
      onClick={() => setCount((value) => value + 1)}
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      {count}
    </Button>
  )
}

LikeButton.propTypes = {
  initialCount: PropTypes.number,
}
