import {
  Badge,
  Button,
  Checkbox,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useState } from "react";
import { Plus, Search } from "tabler-icons-react";
import { usePaginationProps } from "../../../hooks/usePaginationProps";

import { useContractControllerFindAll } from "../../../services/api/dev3Components";
import { AuditedIcon } from "./AuditedIcon";

interface IContractTemplate {
  _id: string;
  name: string;
  is_audited: boolean;
  tags: Array<string>;
  creator_name: string;
  description: string;
}

interface ITemplateListProps {
  onSelect: (id: string) => void;
}

const PAGE_LIMIT = 20;

export const TemplateList: React.FC<ITemplateListProps> = ({ onSelect }) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [auditedOnly, setAuditedOnly] = useState(false);

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

  const handleSelect = (id: string) => {
    return () => {
      onSelect(id);
    };
  };

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
    {
      accessor: "actions",
      title: "",
      render: ({ _id }) => {
        return (
          <Group position="right">
            <Button
              variant="light"
              leftIcon={<Plus size={14} />}
              onClick={handleSelect(_id)}
            >
              Select
            </Button>
          </Group>
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
        />
        <Checkbox
          label="Audited only"
          checked={auditedOnly}
          onChange={handleAuditedOnlyChange}
        />
      </Group>

      <DataTable
        minHeight={200}
        sx={{ thead: { display: "none" } }}
        columns={columns}
        records={data?.results}
        fetching={isLoading}
        emptyState="No templates found"
        {...paginationProps}
      />
    </>
  );
};
