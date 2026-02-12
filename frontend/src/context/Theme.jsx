import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
    // GSA colors from https://buy.gsa.gov/style_guide/iframe.html?id=branding-color-palette--docs&viewMode=docs
    colors: {
        primaryLightest: '#eff6fb',
        primaryLighter: '#d9e8f6',
        primary: '#2378c3',
        primaryDark: '#2c608a',
        primaryDarker: '#1a4480',
        primaryDarkest: '#162e51',
        text: {
            baseDarkest: '#000000',
            baseAccent: '#959595',
            baseLightest: '#FFFFFF',
        },
        bg: {
            baseLightest: '#FFFFFF',
            baseLighter: '#f5f6f7',
            baseLight: '#dfe1e2',
            base: '#a9aeb1',
            baseDark: '#71767a',
            baseDarker: '#3d4551',
            baseDarkest: '#1c1d1f',
        },
    },
};

// Remove the type annotation from the props
const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;