import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/themeConfig/theme";
import { router } from "./routes/routes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/error/ErrorFallback";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

export const App = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <Toaster position="top-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
