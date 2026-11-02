export async function fetchComments(article) {
  const response = await fetch(`/api/comments?article=${encodeURIComponent(article)}`)
  if (!response.ok) throw new Error(`Не удалось загрузить комментарии: ${response.status}`)
  return response.json()
}

export async function fetchTopMovies({ limit = 10 } = {}) {
  const response = await fetch(`/api/analytics/top-movies?limit=${limit}`)
  if (!response.ok) throw new Error(`Не удалось загрузить статистику: ${response.status}`)
  return response.json()
}

export async function postComment(article, text) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ article, author: "Вы", text }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const error = new Error(`Не удалось отправить комментарий: ${response.status}`)
    if (response.status === 400 && body?.errors?.length) {
      error.reason = body.errors.join(". ")
    }
    throw error
  }
  return response.json()
}
