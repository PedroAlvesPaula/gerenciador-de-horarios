import { type ReactNode } from "react";
import {
  useForm,
  type FieldValues,
  type DefaultValues,
  type Mode,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

interface FormWrapperProps<
  TInput extends FieldValues,
  TOutput extends FieldValues = TInput,
> {
  schema: ZodType<TOutput, TInput>;
  onSubmit: SubmitHandler<TOutput>;
  defaultValues: DefaultValues<TInput>;
  children: (methods: UseFormReturn<TInput, unknown, TOutput>) => ReactNode;
  className?: string;
  mode?: Mode;
}

export const FormWrapper = <
  TInput extends FieldValues,
  TOutput extends FieldValues = TInput,
>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  mode = "onBlur",
}: FormWrapperProps<TInput, TOutput>) => {
  const methods = useForm<TInput, unknown, TOutput>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
    reValidateMode: "onChange",
  });

  return (
    <form
      className={className}
      noValidate
      aria-busy={methods.formState.isSubmitting}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      {children(methods)}
    </form>
  );
};
