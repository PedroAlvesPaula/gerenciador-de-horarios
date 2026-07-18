import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const RouteHydrateFallback = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

export default RouteHydrateFallback;
