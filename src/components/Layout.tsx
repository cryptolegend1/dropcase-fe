import React, { CSSProperties, ReactElement, useEffect } from "react";

import dynamic from "next/dynamic";
import theme from "theme";
import { Box, ThemeProvider, CssBaseline, Container } from "@mui/material";

const Header = dynamic(() => import("components/Header/index"));

interface Props {
  heading?: string;
  children: any;
  style?: CSSProperties;
}

const Layout = ({ children, style }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Header />
        <Box>{children}</Box>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
