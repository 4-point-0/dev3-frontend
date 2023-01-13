import { Button, Group, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { Reload } from "tabler-icons-react";

import { TemplateList } from "../TemplateList";

export const CreateContract = () => {
  const [contractTemplateId, setContractTemplateId] = useState<string | null>(
    null
  );

  const handleSelect = (id: string) => {
    setContractTemplateId(id);
  };

  const handleReset = () => {
    setContractTemplateId(null);
  };

  return (
    <Stack>
      {!contractTemplateId && (
        <>
          <TemplateList onSelect={handleSelect} />
        </>
      )}
      {contractTemplateId && (
        <>
          <Group position="right">
            <Button
              variant="default"
              leftIcon={<Reload size={14} />}
              onClick={handleReset}
            >
              Reset template
            </Button>
          </Group>
          <Text>{contractTemplateId}</Text>
        </>
      )}
    </Stack>
  );
};
