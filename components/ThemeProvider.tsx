import '../app/styles/globals.css';
import { ThemeProvider } from 'next-themes';

interface MyThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any;
}

const MyThemeProvider: React.FC<MyThemeProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <ThemeProvider
      {...props}
      defaultTheme='dark'
      enableSystem={true}
      enableColorScheme={true}
    >
      {children}
    </ThemeProvider>
  );
};

export default MyThemeProvider;
