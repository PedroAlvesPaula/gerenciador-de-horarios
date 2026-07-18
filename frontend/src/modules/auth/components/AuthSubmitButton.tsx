import CircularProgress from "@mui/material/CircularProgress";
import Styles from "../Auth.styles";

interface AuthSubmitButtonProps {
  isLoading: boolean;
  label: string;
}

const AuthSubmitButton = ({
  isLoading,
  label,
}: AuthSubmitButtonProps) => (
  <Styles.SubmitButton
    type="submit"
    variant="contained"
    color="primary"
    fullWidth
    disabled={isLoading}
  >
    {isLoading ? <CircularProgress size={24} color="inherit" /> : label}
  </Styles.SubmitButton>
);

export default AuthSubmitButton;
