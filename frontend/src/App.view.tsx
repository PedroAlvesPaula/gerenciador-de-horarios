import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/themeConfig/theme";
import { router } from "./routes/routes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/error/ErrorFallback";

export const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
