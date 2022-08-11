import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#f92494",
    },
    secondary: {
      main: "#70fbf9",
    },
    text: {
      primary: "#0000000",
      secondary: "#5A5954",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {},
      },
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export default theme;
