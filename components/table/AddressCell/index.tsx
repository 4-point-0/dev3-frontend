import { ActionIcon, Group, Tooltip } from "@mantine/core";
import React from "react";
import { ExternalLink } from "tabler-icons-react";

import { getContractIdFromAlias, getNearBlocksUrl } from "../../../utils/near";
import { CopyCell } from "../CopyCell";

interface IAddressCellProps {
  alias: string;
}

export const AddressCell: React.FC<IAddressCellProps> = ({ alias }) => {
  const contractId = getContractIdFromAlias(alias);

  return (
    <Group spacing="xs">
      <CopyCell value={contractId}></CopyCell>
      <Tooltip position="bottom" label="Open" withArrow>
        <ActionIcon
          component="a"
          href={getNearBlocksUrl(contractId)}
          target="_blank"
          rel="noopener noreferrer"
          radius="xl"
          variant="light"
          color="blue"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
