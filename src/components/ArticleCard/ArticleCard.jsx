import { useState } from "react"
import PropTypes from "prop-types"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import LikeButton from "../LikeButton/LikeButton.jsx"
import CommentInput from "../CommentInput/CommentInput.jsx"
import { Avatar, CommentIcon, ShareIcon } from "../icons.jsx"

export default function ArticleCard({ title, author, previewText, imageUrl, minutes }) {
  const [commentsOpen, setCommentsOpen] = useState(false)

  return (
    <Card component="article" elevation={3} sx={{ borderRadius: 2, width: "100%" }}>
      <CardMedia component="img" image={imageUrl} alt="" sx={{ height: 200 }} />
      <CardContent>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 1.5 }}>
          <Avatar />
          <div>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {minutes} мин
            </Typography>
          </div>
        </Stack>
        <Typography
          variant="h2"
          sx={{
            fontSize: 28,
            lineHeight: "34px",
            mb: 1.5,
            minHeight: 68,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: 44,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {previewText}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <LikeButton />
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="inherit"
            disableElevation
            startIcon={<CommentIcon />}
            aria-expanded={commentsOpen}
            onClick={() => setCommentsOpen((open) => !open)}
          >
            Комментарий
          </Button>
          <IconButton aria-label="Поделиться">
            <ShareIcon />
          </IconButton>
        </Stack>
      </CardActions>
      <Collapse in={commentsOpen}>
        <CardContent sx={{ pt: 0 }}>
          <CommentInput />
        </CardContent>
      </Collapse>
    </Card>
  )
}

ArticleCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  previewText: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  minutes: PropTypes.number.isRequired,
}
