import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useCallback, useReducer, useState } from "react";
import { IChangeEvent, withTheme } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Edit, Eye } from "tabler-icons-react";
import Form from "@rjsf/fluent-ui";
import {
  Badge,
  Code,
  Group,
  Paper,
  Text,
  ThemeIcon,
  Title,
  Stack,
  Skeleton,
} from "@mantine/core";

import { getMethodsFromSchema } from "../../../utils/raen";
import { CopyCell } from "../../table/CopyCell";
import { useWalletSelector } from "../../../context/WalletSelectorContext";
import { fetchTransactionRequestControllerCreate } from "../../../services/api/dev3Components";
import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { THIRTY_TGAS } from "../../../utils/near";

interface IContractMethodsProps {
  contractId: string;
  schema: any;
}

interface IResult {
  error?: any;
  data?: any;
  isLoading: boolean;
}

function getInitialResults(methods: Array<string>): Record<string, IResult> {
  return methods.reduce((results, method) => {
    results[method] = { isLoading: false };
    return results;
  }, {} as Record<string, IResult>);
}

export const ContractMethods: React.FC<IContractMethodsProps> = ({
  contractId,
  schema,
}) => {
  const methods = getMethodsFromSchema(schema);
  const { projectId } = useSelectedProject();
  const { viewMethod } = useWalletSelector();
  const [results, setResults] = useState<Record<string, any>>(() => {
    return getInitialResults(methods.map(({ method }) => method));
  });

  const setResult = useCallback(
    (method: string, value: any) => {
      setResults((previousResults) => ({
        ...previousResults,
        [method]: value,
      }));
    },
    [setResults]
  );

  const columns: Array<DataTableColumn<any>> = [
    {
      accessor: "key",
      render: ({ key, method }) => {
        return (
          <CopyCell value={method}>
            <Group>
              <Title order={5}>{key}</Title>
              <Text c="dimmed">({method})</Text>
            </Group>
          </CopyCell>
        );
      },
    },
    {
      accessor: "type",
      render: ({ type }) => {
        const color = type === "view" ? "blue" : "red";

        return (
          <Group position="right">
            <Badge
              pr="md"
              color={color}
              leftSection={
                <ThemeIcon color={color} variant="light">
                  {type === "view" ? <Eye size={14} /> : <Edit size={14} />}
                </ThemeIcon>
              }
            >
              {type}
            </Badge>
          </Group>
        );
      },
    },
  ];

  const handleSubmit = (method: string, type: "view" | "change") => {
    return async (data: IChangeEvent) => {
      let result;

      setResult(method, {
        isLoading: true,
      });

      try {
        if (type === "view") {
          result = await viewMethod(contractId, method, data.formData.args);
        }

        if (type === "change") {
          const { args, options } = data.formData;

          result = await fetchTransactionRequestControllerCreate({
            body: {
              contractId,
              type: "Transaction",
              method,
              args,
              gas: options.gas || THIRTY_TGAS,
              deposit: options.attachedDeposit || "0",
              project_id: projectId as string,
              is_near_token: false,
            },
          });
        }

        setResult(method, {
          data: result,
          isLoading: false,
        });
      } catch (error) {
        setResult(method, {
          error,
          isLoading: false,
        });
      }
    };
  };

  return (
    <>
      <DataTable
        highlightOnHover
        sx={{ thead: { display: "none" } }}
        records={methods}
        columns={columns}
        idAccessor="key"
        rowExpansion={{
          allowMultiple: true,
          content: ({ record }) => {
            const { data, error, isLoading } = results[record.method];

            const showFor = !isLoading && data == undefined;

            return (
              <Paper p="md">
                <Stack>
                  <Form
                    schema={record.schema}
                    validator={validator}
                    onSubmit={handleSubmit(record.method, record.type)}
                  />

                  {data !== undefined && (
                    <Skeleton visible={isLoading}>
                      <Title order={5}>Result: </Title>
                      <Code block>{JSON.stringify(data, null, 2)}</Code>
                    </Skeleton>
                  )}
                  {error && (
                    <>
                      <Title order={5}>Error: </Title>
                      <Code block color="red">
                        {JSON.stringify(error, null, 2)}
                      </Code>
                    </>
                  )}
                </Stack>
              </Paper>
            );
          },
        }}
      />
    </>
  );
};
