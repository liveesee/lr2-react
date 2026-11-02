import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Plotly from "plotly.js-basic-dist-min"
import createPlotlyComponent from "react-plotly.js/factory"
import { buildTopMoviesChart } from "@/lib/topMoviesChart"

const Plot = createPlotlyComponent(Plotly)
const COMPACT_QUERY = "(max-width: 640px)"

function useCompact() {
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(COMPACT_QUERY)
    const update = () => setCompact(media.matches)
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return compact
}

export default function TopMoviesChart({ items, description }) {
  const compact = useCompact()
  const { data, layout, config } = buildTopMoviesChart(items, { compact })

  return (
    <div role="img" aria-label={description}>
      <Plot data={data} layout={layout} config={config} useResizeHandler style={{ width: "100%" }} />
    </div>
  )
}

TopMoviesChart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      votes: PropTypes.number.isRequired,
      genres: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
  description: PropTypes.string.isRequired,
}
