const BAR_COLOR = "#565449"
const INK = "#11120d"
const PAPER = "#fffbf4"
const GRID = "#e4ddcf"

export function movieLabel({ title, year }) {
  return `${title} (${year})`
}

export function wrapLabel(text, width) {
  const lines = []
  for (const word of text.split(" ")) {
    const last = lines.at(-1)
    if (last && `${last} ${word}`.length <= width) lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines.join("<br>")
}

export function buildTopMoviesChart(items, { compact = false } = {}) {
  const labels = items.map((item) => (compact ? wrapLabel(movieLabel(item), 16) : movieLabel(item)))
  const data = [
    {
      type: "bar",
      orientation: "h",
      x: items.map((item) => item.rating),
      y: labels,
      customdata: items.map((item) => [item.title, item.year, item.votes, item.genres.join(", ")]),
      marker: { color: BAR_COLOR },
      text: items.map((item) => item.rating.toFixed(2)),
      textposition: "inside",
      insidetextanchor: "end",
      textfont: { color: PAPER },
      hovertemplate:
        "<b>%{customdata[0]}</b> (%{customdata[1]})<br>" +
        "Средняя оценка: %{x:.2f} из 10<br>" +
        "Оценок: %{customdata[2]}<br>" +
        "Жанры: %{customdata[3]}<extra></extra>",
    },
  ]

  const layout = {
    title: {
      text: compact
        ? "Топ-10 фильмов<br>по средней оценке пользователей"
        : "Топ-10 фильмов по средней оценке пользователей",
      x: 0,
      xanchor: "left",
      font: { size: compact ? 15 : 18 },
    },
    font: { family: '"DM Sans", "Segoe UI", sans-serif', color: INK, size: compact ? 11 : 13 },
    paper_bgcolor: PAPER,
    plot_bgcolor: PAPER,
    height: (compact ? 140 : 120) + items.length * (compact ? 52 : 44),
    margin: { l: compact ? 4 : 10, r: compact ? 8 : 24, t: compact ? 72 : 56, b: 56 },
    bargap: 0.3,
    showlegend: false,
    xaxis: {
      title: { text: compact ? "Средняя оценка, 1–10" : "Средняя оценка (шкала 1–10)" },
      range: [0, 10],
      dtick: compact ? 2 : 1,
      gridcolor: GRID,
      zeroline: false,
      fixedrange: true,
    },
    yaxis: {
      title: { text: compact ? "" : "Фильм (год выпуска)" },
      autorange: "reversed",
      automargin: true,
      ticks: "",
      fixedrange: true,
    },
    hoverlabel: { bgcolor: INK, bordercolor: INK, font: { color: PAPER, size: 13 } },
  }

  const config = { displayModeBar: false, responsive: true, locale: "ru" }

  return { data, layout, config }
}
