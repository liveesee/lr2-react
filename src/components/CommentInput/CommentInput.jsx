import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import InputAdornment from "@mui/material/InputAdornment"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { Arrow, Avatar } from "../icons.jsx"

export default function CommentInput() {
  const [text, setText] = useState("")
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

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <TextField
        fullWidth
        size="small"
        value={text}
        error={error}
        helperText={error ? "Ошибка · добавьте пару слов" : null}
        placeholder={error ? "Комментарий не может быть пустым" : "Напишите вдумчивый ответ..."}
        onChange={(event) => {
          setText(event.target.value)
          if (error && event.target.value.trim()) setError(false)
        }}
        onKeyDown={onKeyDown}
        slotProps={{
          htmlInput: { "aria-label": "Текст комментария" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Avatar />
              </InputAdornment>
            ),
          },
        }}
      />
      <Button type="submit" variant="contained" endIcon={<Arrow />} sx={{ mt: 1.5 }}>
        Опубликовать
      </Button>
      {comments.length === 0 ? (
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
          Пока нет комментариев
        </Typography>
      ) : (
        <List sx={{ mt: 1 }}>
          {comments.map((comment) => (
            <ListItem key={comment.id} disableGutters divider>
              <ListItemText primary={comment.author} secondary={comment.text} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
