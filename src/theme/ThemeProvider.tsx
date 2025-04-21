import React, { createContext, useMemo, useState, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define the context type
interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

// Create a context to provide the toggle function and mode
const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => { },
    mode: 'light'
});

export const useColorMode = () => useContext(ColorModeContext);

interface CustomThemeProviderProps {
    children: ReactNode;
}

// Extended palette color options
declare module '@mui/material/styles' {
    interface PaletteColor {
        lighter?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
        darker?: string;
    }

    interface SimplePaletteColorOptions {
        lighter?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
        darker?: string;
    }

    interface TypeBackground {
        default: string;
        paper: string;
    }

    interface TypeText {
        primary: string;
        secondary: string;
    }

    interface Color {
        A50?: string;
    }

    interface Theme {
        customShadows: {
            button: string;
            text: string;
            z1: string;
            primary: string;
            secondary: string;
            error: string;
            warning: string;
            info: string;
            success: string;
            primaryButton: string;
            grey: string;
        };
    }

    interface ThemeOptions {
        customShadows?: {
            button: string;
            text: string;
            z1: string;
            primary: string;
            secondary: string;
            error: string;
            warning: string;
            info: string;
            success: string;
            primaryButton: string;
            grey: string;
        };
    }
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    // Toggle function to switch themes and expose current mode
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode]
    );

    // Custom shadows
    const customShadows = useMemo(() => {
        const transparent = mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.2)';
        const color = mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.5)';

        return {
            button: '0 2px 0px rgba(0, 0, 0, 0.05)',
            text: '0 -1px 0 rgba(0, 0, 0, 0.12)',
            z1: `0px 1px 4px ${transparent}`,
            primary: `0 0 0 2px rgba(0, 102, 153, 0.2)`,
            secondary: `0 0 0 2px rgba(51, 153, 102, 0.2)`,
            error: `0 0 0 2px rgba(255, 72, 66, 0.2)`,
            warning: `0 0 0 2px rgba(255, 152, 0, 0.2)`,
            info: `0 0 0 2px rgba(0, 186, 233, 0.2)`,
            success: `0 0 0 2px rgba(54, 179, 126, 0.2)`,
            primaryButton: `0 8px 16px rgba(0, 102, 153, 0.24)`,
            grey: `0 0 0 2px ${color}`,
        };
    }, [mode]);

    // Create the theme based on the mode
    const theme = useMemo(
        () =>
            createTheme({
                breakpoints: {
                    values: {
                        xs: 0,
                        sm: 768,
                        md: 1024,
                        lg: 1266,
                        xl: 1440
                    }
                },
                direction: 'ltr',
                mixins: {
                    toolbar: {
                        minHeight: 60,
                        paddingTop: 8,
                        paddingBottom: 8
                    }
                },
                palette: {
                    mode,
                    primary: {
                        lighter: '#CCE5F2',
                        100: '#99CAE5',
                        200: '#66B0D9',
                        light: '#338ABA',
                        400: '#1A75A8',
                        main: '#069', // Main primary color
                        dark: '#004D80',
                        700: '#004066',
                        darker: '#00334D',
                        900: '#002533',
                        contrastText: '#fff'
                    },
                    secondary: {
                        lighter: '#D6ECD9',
                        100: '#AED9B4',
                        200: '#85C68E',
                        light: '#5DB369',
                        400: '#47AB57',
                        main: '#396', // Main secondary color
                        dark: '#2C7A45',
                        700: '#24663A',
                        darker: '#1D532E',
                        900: '#163F23',
                        contrastText: '#fff'
                    },
                    error: {
                        lighter: '#FFCCC7',
                        light: '#FF8A82',
                        main: '#FF483D',
                        dark: '#E60000',
                        darker: '#990000',
                        contrastText: '#fff'
                    },
                    warning: {
                        lighter: '#FFF4D0',
                        light: '#FFE4A1',
                        main: '#E69A00',
                        dark: '#B36D00',
                        darker: '#996600',
                        contrastText: '#fff'
                    },
                    info: {
                        lighter: '#CCF4FF',
                        light: '#99E9FF',
                        main: '#00BAEA',
                        dark: '#0088CC',
                        darker: '#005C99',
                        contrastText: '#fff'
                    },
                    success: {
                        lighter: '#D8F2E5',
                        light: '#B1E5CB',
                        main: '#36B37E',
                        dark: '#00875A',
                        darker: '#005B3C',
                        contrastText: '#fff'
                    },
                    grey: {
                        50: '#fafafa',
                        100: '#f5f5f5',
                        200: '#eeeeee',
                        300: '#e0e0e0',
                        400: '#bdbdbd',
                        500: '#9e9e9e',
                        600: '#757575',
                        700: '#616161',
                        800: '#424242',
                        900: '#212121',
                        A100: '#f5f5f5',
                        A200: '#eeeeee',
                        A400: '#bdbdbd',
                        A700: '#616161',
                        A50: '#fafafa'
                    },
                    background: mode === 'light'
                        ? { default: '#f4f6f8', paper: '#ffffff' }
                        : { default: '#121212', paper: '#1e1e1e' },
                    text: mode === 'light'
                        ? { primary: '#333333', secondary: '#555555' }
                        : { primary: '#ffffff', secondary: '#bbbbbb' },
                    divider: mode === 'light' ? '#e0e0e0' : '#444',
                },
                typography: {
                    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
                    h1: {
                        fontWeight: 700,
                        fontSize: '2.5rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em'
                    },
                    h2: {
                        fontWeight: 700,
                        fontSize: '2rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em'
                    },
                    h3: {
                        fontWeight: 600,
                        fontSize: '1.5rem',
                        lineHeight: 1.2
                    },
                    h4: {
                        fontWeight: 600,
                        fontSize: '1.25rem',
                        lineHeight: 1.2
                    },
                    h5: {
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                        letterSpacing: '0.5px'
                    },
                    h6: {
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.4,
                        letterSpacing: '0.25px'
                    },
                    subtitle1: {
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        letterSpacing: '0.15px'
                    },
                    subtitle2: {
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        letterSpacing: '0.1px'
                    },
                    body1: {
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        letterSpacing: '0.15px'
                    },
                    body2: {
                        fontSize: '0.75rem',
                        lineHeight: 1.6,
                        letterSpacing: '0.15px'
                    },
                    button: {
                        textTransform: 'none',
                        fontWeight: 500,
                        letterSpacing: '0.3px'
                    },
                    caption: {
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        lineHeight: 1.4,
                        letterSpacing: '0.4px'
                    },
                    overline: {
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        lineHeight: 1.5,
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }
                },
                shape: { borderRadius: 8 },
                customShadows, // Add custom shadows to theme
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            '*': {
                                WebkitTapHighlightColor: 'transparent',
                            },
                            body: {
                                fontFamily: '"Montserrat", sans-serif',
                                scrollbarWidth: 'thin',
                                '&::-webkit-scrollbar': {
                                    width: 6,
                                    height: 6,
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: mode === 'light' ? '#f1f1f1' : '#2e2e2e',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: mode === 'light' ? '#c1c1c1' : '#555',
                                    borderRadius: 3,
                                },
                            },
                            // Disable spellcheck in input fields to prevent red underlines
                            'input, textarea': {
                                spellcheck: 'false',
                                WebkitSpellCheck: 'false',
                            },
                            // Override browser autofill styling
                            'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus': {
                                WebkitBoxShadow: mode === 'light'
                                    ? '0 0 0 1000px white inset !important'
                                    : '0 0 0 1000px #2c2c2c inset !important',
                                WebkitTextFillColor: mode === 'light' ? '#333' : '#fff',
                                caretColor: mode === 'light' ? '#333' : '#fff',
                                borderRadius: 'inherit',
                                transition: 'background-color 5000s ease-in-out 0s',
                            }
                        }
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                padding: '8px 16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none',
                                }
                            },
                            contained: {
                                boxShadow: customShadows.button,
                                '&:hover': {
                                    boxShadow: customShadows.button,
                                }
                            }
                        },
                    },
                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                                color: mode === 'light' ? '#333333' : '#ffffff',
                                borderRight: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #333',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: 'none',
                                borderRadius: 8,
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            },
                            elevation1: {
                                boxShadow: mode === 'light'
                                    ? '0px 2px 8px rgba(0, 0, 0, 0.05)'
                                    : '0px 2px 8px rgba(0, 0, 0, 0.2)'
                            }
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                                backgroundImage: 'none',
                                border: mode === 'light' ? '1px solid #F8FAFC' : '1px solid #333',
                                borderRadius: 12,
                                boxShadow: mode === 'light'
                                    ? '0px 2px 4px rgba(0, 0, 0, 0.03)'
                                    : '0px 2px 4px rgba(0, 0, 0, 0.15)'
                            },
                        },
                    },
                    MuiCardHeader: {
                        styleOverrides: {
                            root: {
                                padding: '16px 16px 0',
                            },
                        },
                    },
                    MuiCardContent: {
                        styleOverrides: {
                            root: {
                                padding: '16px',
                                '&:last-child': {
                                    paddingBottom: '16px',
                                },
                            },
                        },
                    },
                    MuiTableContainer: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 8,
                                    backgroundColor: mode === 'light' ? '#ffffff' : '#2c2c2c',
                                    '& fieldset': {
                                        borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#069',
                                    },
                                    // Prevent dark backgrounds on autofilled inputs
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: mode === 'light'
                                            ? '0 0 0 100px #ffffff inset !important'
                                            : '0 0 0 100px #2c2c2c inset !important',
                                        WebkitTextFillColor: mode === 'light' ? '#333' : '#fff',
                                        caretColor: mode === 'light' ? '#333' : '#fff',
                                    },
                                    // Disable spell check on inputs
                                    '& input': {
                                        spellCheck: 'false',
                                    }
                                },
                            },
                        },
                    },
                    MuiOutlinedInput: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                backgroundColor: mode === 'light' ? '#ffffff' : '#2c2c2c',
                            },
                        },
                    },
                    MuiSelect: {
                        styleOverrides: {
                            outlined: {
                                borderRadius: 8,
                                backgroundColor: mode === 'light' ? '#ffffff' : '#2c2c2c',
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1a1a1a',
                                color: mode === 'light' ? '#333333' : '#ffffff',
                                boxShadow: 'none',
                                borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`
                            },
                        },
                    },
                    MuiListItemButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                '&:hover': {
                                    backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: mode === 'light' ? 'rgba(0, 102, 153, 0.1)' : 'rgba(0, 102, 153, 0.2)',
                                    '&:hover': {
                                        backgroundColor: mode === 'light' ? 'rgba(0, 102, 153, 0.15)' : 'rgba(0, 102, 153, 0.3)',
                                    },
                                },
                            },
                        },
                    },
                    MuiListItemIcon: {
                        styleOverrides: {
                            root: {
                                minWidth: 40,
                            },
                        },
                    },
                    MuiTabs: {
                        styleOverrides: {
                            root: {
                                backgroundColor: mode === 'light' ? '#ffffff' : '#1a1a1a',
                            },
                        },
                    },
                    MuiTab: {
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                                fontWeight: 500,
                                minHeight: 48,
                            },
                        },
                    },
                    MuiAvatar: {
                        styleOverrides: {
                            root: {
                                color: '#ffffff',
                                fontWeight: 600,
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                            },
                        },
                    },
                    MuiTooltip: {
                        styleOverrides: {
                            tooltip: {
                                backgroundColor: mode === 'light' ? '#333' : '#f5f5f5',
                                color: mode === 'light' ? '#fff' : '#333',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            },
                        },
                    },
                },
            }),
        [mode, customShadows]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
}; 