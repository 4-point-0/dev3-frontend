import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";
export default defineConfig({
  dev3: {
    from: {
      source: "url",
      url: "http://localhost:3001/swagger-json",
    },
    outputDir: "services/api",
    to: async (context) => {
      const filenamePrefix = "dev3";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
