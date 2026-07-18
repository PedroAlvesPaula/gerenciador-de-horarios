import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { type UseFormRegisterReturn } from "react-hook-form";

export type SysInputProps = Omit<
  TextFieldProps,
  "error" | "helperText" | "name" | "onBlur" | "onChange"
> & {
  registration: UseFormRegisterReturn;
  errorMessage?: string;
  helperText?: TextFieldProps["helperText"];
};

const SysInput = ({
  registration,
  errorMessage,
  helperText,
  ...props
}: SysInputProps) => {
  const hasError = Boolean(errorMessage);

  return (
    <TextField
      name={registration.name}
      onBlur={registration.onBlur}
      onChange={registration.onChange}
      inputRef={registration.ref}
      error={hasError}
      helperText={errorMessage ?? helperText}
      {...props}
    />
  );
};

export default SysInput;
