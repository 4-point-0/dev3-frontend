import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import { useSelectedProject } from "../../../context/SelectedProjectContext";
import { fetchDeployedContractControllerCreate } from "../../../services/api/dev3Components";
import { notifications } from "../../../utils/notifications";
import { ContractForm, IContractFormValues } from "../ContractForm";

import { TemplateList } from "../TemplateList";
import { AuditedIcon } from "../TemplateList/AuditedIcon";

export interface IContractTemplate {
  _id: string;
  name: string;
  is_audited: boolean;
  tags: Array<string>;
  creator_name: string;
  description: string;
}

export const CreateContract = () => {
  const { projectId } = useSelectedProject();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [contractTemplate, setContractTemplate] =
    useState<IContractTemplate | null>(null);

  const handleSelect = (template: IContractTemplate) => {
    setContractTemplate(template);
  };

  const handleReset = () => {
    setContractTemplate(null);
  };

  const handleSumbit = async (values: IContractFormValues) => {
    console.log(values);
    if (!(projectId && contractTemplate)) {
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
          contract_template_id: contractTemplate._id,
          args: {},
        },
      });

      notifications.success({
        title: "Created contract deployment request",
      });

      router.push("/contracts?tab=pending");
    } catch {
      notifications.error({
        title: `Failed to create contract deployment request`,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Stack>
      {!contractTemplate && (
        <>
          <TemplateList onSelect={handleSelect} />
        </>
      )}
      {contractTemplate && (
        <>
          <Group position="left">
            <Button
              variant="default"
              leftIcon={<ArrowLeft size={14} />}
              onClick={handleReset}
            >
              Back
            </Button>
          </Group>

          <Grid>
            <Grid.Col md={7}>
              <Card shadow="sm" p="lg" withBorder>
                <Stack>
                  <Group>
                    <AuditedIcon isAudited={contractTemplate.is_audited} />

                    <Stack spacing={0}>
                      <Text fz="xs" tt="uppercase">
                        {contractTemplate.creator_name}
                      </Text>
                      <Title order={4}>{contractTemplate.name}</Title>
                    </Stack>
                  </Group>

                  <Text>{contractTemplate.description}</Text>

                  <Group spacing="xs">
                    {contractTemplate.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col md={5}>
              <ContractForm disabled={isCreating} handleSubmit={handleSumbit} />
            </Grid.Col>
          </Grid>
        </>
      )}
    </Stack>
  );
};
