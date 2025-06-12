"use client";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  a { color: inherit; text-decoration: none; }

  /* Nicer scrollbars on WebKit */
  ::-webkit-scrollbar { width: .6rem; height: .6rem; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: .5rem;
  }
`;
