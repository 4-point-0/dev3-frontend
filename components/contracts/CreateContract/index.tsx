import { Stack } from "@mantine/core";
import React from "react";

import { useContractControllerFindAll } from "../../../services/api/dev3Components";
import { TemplateList } from "../TemplateList";

export const CreateContract = () => {
  const { data } = useContractControllerFindAll({});

  console.log({ data });

  const handleSelect = (id: string) => {
    console.log(id);
  };

  return (
    <Stack>
      {data?.results && (
        <TemplateList contracts={data.results} onSelect={handleSelect} />
      )}
    </Stack>
  );
};
