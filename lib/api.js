export async function fetchComments(article) {
  const response = await fetch(`/api/comments?article=${encodeURIComponent(article)}`)
  if (!response.ok) throw new Error(`Не удалось загрузить комментарии: ${response.status}`)
  return response.json()
}

export async function postComment(article, text) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article, author: "Вы", text }),
  })
  if (!response.ok) throw new Error(`Не удалось отправить комментарий: ${response.status}`)
  return response.json()
}
