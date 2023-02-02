import React from "react";
import {
  DescriptionFieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { Alert, Divider, Text } from "@mantine/core";

export default function DescriptionField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>({ description, id }: DescriptionFieldProps<T, S, F>) {
  if (description) {
    return (
      <>
        <Alert mb="md">{description}</Alert>
      </>
    );
  }

  return null;
}
