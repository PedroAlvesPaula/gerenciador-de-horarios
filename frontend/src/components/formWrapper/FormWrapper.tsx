import { type ReactNode } from "react";
import {
  useForm,
  FormProvider,
  type FieldValues,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

interface FormWrapperProps<T extends FieldValues> {
  schema: ZodType<any, any, any>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  children: ReactNode;
  className?: string;
}

export const FormWrapper = <T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: FormWrapperProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};
