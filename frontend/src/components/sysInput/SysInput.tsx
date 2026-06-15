import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";

// Exigimos que todo SysInput tenha obrigatoriamente um 'name' em formato de string
type SysInputProps = TextFieldProps & {
  name: string;
};

const SysInput = ({ name, ...props }: SysInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <TextField
      {...register(name)}
      error={!!error}
      helperText={error?.message as string}
      {...props}
    />
  );
};

export default SysInput;
