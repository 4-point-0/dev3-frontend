import { ActionIcon, Badge, Button, Group, Tooltip } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import React, { useState } from "react";
import { Trash } from "tabler-icons-react";

import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { usePaginationProps } from "../../../hooks/usePaginationProps";
import { useDeployedContractControllerFindAll } from "../../../services/api/dev3Components";
import { DeployedContract } from "../../../services/api/dev3Schemas";
import { CopyCell } from "../../table/CopyCell";

const PAGE_LIMIT = 20;

export const DeployedContracts = () => {
  const [page, setPage] = useState(1);
  const { projectId } = useSelectedProject();

  const { data, isLoading } = useDeployedContractControllerFindAll({
    queryParams: {
      project_id: projectId ?? undefined,
      status: "Deployed",
    },
  });

  const paginationProps = usePaginationProps({
    page,
    onPageChange: setPage,
    limit: PAGE_LIMIT,
    total: data?.total,
  });

  const columns: Array<DataTableColumn<DeployedContract>> = [
    {
      accessor: "alias",
    },
    {
      accessor: "tags",
      render: ({ tags }) => {
        return (
          <Group>
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Group>
        );
      },
    },
    {
      accessor: "address",
      render: ({ address }) => {
        return <CopyCell value={address ?? ""} />;
      },
    },

    {
      accessor: "actions",
      render: () => {
        return (
          <Group>
            <Tooltip label="Delete" position="bottom" withArrow>
              <ActionIcon color="red" radius="xl" variant="light">
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      },
    },
  ];

  return (
    <DataTable
      minHeight={164}
      idAccessor="_id"
      columns={columns}
      noRecordsText="No deployed contracts"
      records={data?.results}
      fetching={isLoading}
      {...paginationProps}
    />
  );
};
