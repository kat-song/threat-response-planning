import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

const themes = {
    light: {
        colors: {
            primaryLightest: '#ebeff5', // Hazy Blue
            primaryLighter: '#aebfd4', // Steel Blue
            primary: '#355e93', // Primary Blue
            primaryDark: '#254267', // Ocean Blue
            primaryDarker: '#15263b', // Space Blue
            primaryDarkest: '#141414', // Slate Black for deepest accents
            text: {
                baseDarkest: '#333333', // Gray
                baseAccent: '#717171', // Anchor Gray
                baseLightest: '#ffffff',
            },
            bg: {
                baseLightest: '#ffffff', // White
                baseLighter: '#ebebeb', // Harbor Gray
                baseLight: '#dfe3ea', // between Harbor and Hazy
                base: '#aebfd4', // Steel Blue
                baseDark: '#728fb4', // Cadet Blue
                baseDarker: '#254267', // Ocean Blue
                baseDarkest: '#15263b', // Space Blue
            },
        },
    },
    dark: {
        colors: {
            primaryLightest: '#254267', // Ocean Blue
            primaryLighter: '#15263b', // Space Blue
            primary: '#355e93', // Primary Blue
            primaryDark: '#aebfd4', // Steel Blue for contrast
            primaryDarker: '#ebeff5', // Hazy Blue highlights
            primaryDarkest: '#ffffff',
            text: {
                baseDarkest: '#ebeff5', // Hazy Blue text on dark
                baseAccent: '#aebfd4', // Steel Blue
                baseLightest: '#0b0f1a',
            },
            bg: {
                baseLightest: '#0f1624', // deeper slate for page background
                baseLighter: '#141b2a', // panel bg
                baseLight: '#1c2f47', // inputs/cards
                base: '#254267', // Ocean Blue
                baseDark: '#333333', // outlines
                baseDarker: '#717171', // muted text
                baseDarkest: '#adadad', // light accents
            },
        },
    },
};

const ThemeContext = createContext({
    themeName: 'light',
    toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.colors.bg.baseLightest};
    color: ${(props) => props.theme.colors.text.baseDarkest};
    transition: background 200ms ease, color 200ms ease;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.colors.text.baseDarkest};
  }

  .subtle {
    color: ${(props) => props.theme.colors.text.baseAccent} !important;
  }

  /* Cards */
  .usa-card,
  .usa-card__container {
    background: ${(props) => props.theme.colors.bg.baseLight} !important;
    color: ${(props) => props.theme.colors.text.baseDarkest} !important;
    border: 1px solid ${(props) => props.theme.colors.bg.baseDark} !important;
  }

  .usa-card__header,
  .usa-card__body {
    background: inherit !important;
    color: inherit !important;
  }

  /* Forms */
  .usa-label {
    color: ${(props) => props.theme.colors.text.baseDarkest} !important;
  }

  .usa-input,
  .usa-select {
    background: ${(props) => props.theme.colors.bg.baseLightest} !important;
    color: ${(props) => props.theme.colors.text.baseDarkest} !important;
    border-color: ${(props) => props.theme.colors.bg.baseDark} !important;
  }

  .usa-input:focus,
  .usa-select:focus {
    border-color: ${(props) => props.theme.colors.primary} !important;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primaryLightest} !important;
  }

  /* Buttons */
  .usa-button {
    background: ${(props) => props.theme.colors.primary} !important;
    color: #fff !important;
    border-color: ${(props) => props.theme.colors.primaryDark} !important;
  }

  .usa-button:hover {
    background: ${(props) => props.theme.colors.primaryDark} !important;
  }

  /* Dashboard root background */
  .dashboard-root {
    background: ${(props) => props.theme.colors.bg.baseLighter};
  }
`;

const Theme = ({ children }) => {
    const [themeName, setThemeName] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        return window.localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        if (typeof document === 'undefined' || typeof window === 'undefined') return;
        document.documentElement.setAttribute('data-theme', themeName);
        window.localStorage.setItem('theme', themeName);
    }, [themeName]);

    const toggleTheme = () => {
        setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const value = useMemo(() => ({ themeName, toggleTheme }), [themeName]);
    const activeTheme = useMemo(() => themes[themeName] || themes.light, [themeName]);

    return (
        <ThemeContext.Provider value={value}>
            <ThemeProvider theme={activeTheme}>
                <GlobalStyle />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default Theme;
