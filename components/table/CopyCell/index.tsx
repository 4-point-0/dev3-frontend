import { ActionIcon, CopyButton, Group, Text, Tooltip } from "@mantine/core";
import React from "react";
import { Check, Copy } from "tabler-icons-react";

interface ICopyCellProps {
  value: string;
}

export const CopyCell: React.FC<ICopyCellProps> = ({ value }) => {
  if (!value) {
    return <Text>-</Text>;
  }

  return (
    <Group>
      {value}
      <CopyButton value={value} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip
            label={copied ? "Copied" : "Copy"}
            withArrow
            position="bottom"
          >
            <ActionIcon
              radius="xl"
              variant="light"
              color={copied ? "teal" : "primary"}
              onClick={copy}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};
