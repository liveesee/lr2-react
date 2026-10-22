import { createTheme } from "@mui/material/styles"

const serif = '"Cormorant Garamond", "Times New Roman", serif'

export const theme = createTheme({
  palette: {
    primary: { main: "#11120d", contrastText: "#fffbf4" },
    secondary: { main: "#8c4a3a", contrastText: "#fffbf4" },
    error: { main: "#9b3b2f" },
    background: { default: "#fffbf4", paper: "#fffbf4" },
    text: { primary: "#11120d", secondary: "#565449" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: serif, fontWeight: 600 },
    h2: { fontFamily: serif, fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 500 },
  },
})
