import {
  Badge,
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Search } from "tabler-icons-react";

import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { usePaginationProps } from "../../../hooks/usePaginationProps";
import {
  fetchDeployedContractControllerCreate,
  useContractControllerFindAll,
} from "../../../services/api/dev3Components";
import { notifications } from "../../../utils/notifications";
import { ContractForm, IContractFormValues } from "../ContractForm";
import { AuditedIcon } from "../TemplateList/AuditedIcon";

export interface IContractTemplate {
  _id: string;
  name: string;
  is_audited: boolean;
  tags: Array<string>;
  creator_name: string;
  description: string;
}

const PAGE_LIMIT = 20;

export const CreateContract: React.FC = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [auditedOnly, setAuditedOnly] = useState(false);
  const { projectId } = useSelectedProject();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const [debouncedQuery] = useDebouncedValue(query, 300);

  const { data, isLoading } = useContractControllerFindAll({
    queryParams: {
      ...(auditedOnly && { isAudited: true }),
      ...(debouncedQuery && { name: debouncedQuery }),
      limit: PAGE_LIMIT,
    },
  });

  const paginationProps = usePaginationProps({
    page,
    onPageChange: setPage,
    limit: PAGE_LIMIT,
    total: data?.total,
  });

  const handleQueryChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    setPage(1);
    setQuery(event.currentTarget.value);
  };

  const handleAuditedOnlyChange = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    setPage(1);
    setAuditedOnly(event.currentTarget.checked);
  };

  const handleSubmit = (templateId: string) => {
    return async (values: IContractFormValues) => {
      console.log(values);
      if (!(projectId && templateId)) {
        return;
      }

      setIsCreating(true);

      try {
        notifications.create({
          title: "Creating contract deployment request",
        });

        await fetchDeployedContractControllerCreate({
          body: {
            alias: values.alias,
            project_id: projectId,
            contract_template_id: templateId,
            args: {},
          },
        });

        notifications.success({
          title: "Created contract deployment request",
        });

        router.push(`/${router.query.slug}/contracts?tab=deploy`);
      } catch {
        notifications.error({
          title: `Failed to create contract deployment request`,
        });
      } finally {
        setIsCreating(false);
      }
    };
  };

  const columns: Array<DataTableColumn<IContractTemplate>> = [
    {
      accessor: "name",
      render: ({ name, is_audited, creator_name }) => {
        return (
          <Group noWrap>
            <AuditedIcon isAudited={is_audited} />

            <Stack spacing={0}>
              <Text fz="xs" tt="uppercase">
                {creator_name}
              </Text>
              <Title order={4}>{name}</Title>
            </Stack>
          </Group>
        );
      },
    },
    {
      accessor: "description",
      title: "",
      render: ({ description, tags }) => {
        return (
          <Stack>
            <Text>{description}</Text>
            <Group spacing="xs">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </Group>
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <Group>
        <TextInput
          sx={{ flex: 1 }}
          placeholder="Search templates..."
          icon={<Search size={16} />}
          value={query}
          onChange={handleQueryChange}
          disabled={isCreating}
        />
        <Checkbox
          label="Audited only"
          checked={auditedOnly}
          onChange={handleAuditedOnlyChange}
          disabled={isCreating}
        />
      </Group>

      <DataTable
        highlightOnHover
        minHeight={200}
        sx={{ thead: { display: "none" } }}
        columns={columns}
        records={data?.results}
        fetching={isLoading}
        idAccessor="_id"
        emptyState="No templates found"
        {...paginationProps}
        rowExpansion={{
          content: ({ record }) => {
            return (
              <Paper p="lg">
                <Stack></Stack>
                <ContractForm
                  disabled={isCreating}
                  handleSubmit={handleSubmit((record as IContractTemplate)._id)}
                />
              </Paper>
            );
          },
        }}
      />
    </>
  );
};
