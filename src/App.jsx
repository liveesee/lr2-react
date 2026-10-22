import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import ArticleCard from "./components/ArticleCard/ArticleCard.jsx"
import { Logo } from "./components/icons.jsx"
import { articles } from "./data/articles.js"

export default function App() {
  return (
    <Container maxWidth="xl" sx={{ pt: 6, pb: 10 }}>
      <Stack component="header" spacing={1} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Logo />
          <Typography variant="h1" sx={{ fontSize: 40, lineHeight: 1 }}>
            FOLIA
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Редакционный блог
        </Typography>
      </Stack>
      <Grid component="main" container spacing={3} sx={{ alignItems: "flex-start" }}>
        {articles.map((article) => (
          <Grid key={article.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <ArticleCard {...article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
