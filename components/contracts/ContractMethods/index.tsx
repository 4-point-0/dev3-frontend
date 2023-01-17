import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useCallback, useReducer, useState } from "react";
import Form, { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Edit, Eye } from "tabler-icons-react";
import { Badge, Group, Paper, Text, ThemeIcon, Title } from "@mantine/core";

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

export const ContractMethods: React.FC<IContractMethodsProps> = ({
  contractId,
  schema,
}) => {
  const methods = getMethodsFromSchema(schema);
  const { projectId } = useSelectedProject();
  const { viewMethod } = useWalletSelector();
  const [results, setResults] = useState<Record<string, any>>({});

  const setResult = useCallback(
    (key: string, value: any) => {
      setResults((previousResults) => ({
        ...previousResults,
        [key]: value,
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

      setResult(method, result);
    };
  };

  return (
    <>
      <pre>{JSON.stringify(results, null, 2)}</pre>
      <DataTable
        highlightOnHover
        sx={{ thead: { display: "none" } }}
        records={methods}
        columns={columns}
        idAccessor="key"
        rowExpansion={{
          allowMultiple: true,
          content: ({ record }) => {
            return (
              <Paper p="md">
                <Form
                  schema={record.schema}
                  validator={validator}
                  onSubmit={handleSubmit(record.method, record.type)}
                />
              </Paper>
            );
          },
        }}
      />
    </>
  );
};
