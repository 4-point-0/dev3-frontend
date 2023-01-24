import { withTheme } from "@rjsf/core";
import { Theme } from "@rjsf/fluent-ui";
import { createTheme, ThemeProvider } from "@fluentui/react";
import React, { PropsWithChildren } from "react";

import BaseInputTemplate from "./BaseInputTemplate";
import SubmitButton from "./SubmitButton";

export const Form = withTheme({
  ...Theme,
  templates: {
    ...Theme.templates,
    BaseInputTemplate,
    ButtonTemplates: {
      ...Theme.templates?.ButtonTemplates,
      SubmitButton,
    },
  },
});

const formTheme = createTheme({
  defaultFontStyle: {
    fontFamily:
      "apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    fontWeight: "regular",
  },
  fonts: {
    small: {
      fontSize: "12px",
    },
    medium: {
      fontSize: "14px",
    },
    large: {
      fontSize: "16px",
      fontWeight: "semibold",
    },
    xLarge: {
      fontSize: "20px",
      fontWeight: "semibold",
    },
  },
});

export const FormThemeProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <ThemeProvider theme={formTheme}>{children}</ThemeProvider>;
};
