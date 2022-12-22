import { Group, Text } from "@mantine/core";
import React from "react";

import { CopyActionButton } from "../../core/CopyActionButton";

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
      <CopyActionButton value={value} />
    </Group>
  );
};
