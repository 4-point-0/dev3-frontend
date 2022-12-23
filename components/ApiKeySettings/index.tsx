import { Badge, Box, Button, Group, Stack, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import React from "react";

import { useSelectedProject } from "../../context/SelectedProjectContext";
import {
  fetchApiKeyControllerCreate,
  fetchApiKeyControllerRegenerate,
  fetchApiKeyControllerRevoke,
  useApiKeyControllerFindOne,
} from "../../services/api/dev3Components";
import { ApiKey } from "../../services/api/dev3Schemas";
import { getDefaultExpires } from "../../utils/api-key";
import { CopyActionButton } from "../core/CopyActionButton";

interface IApiKeyDTO extends ApiKey {
  id: string;
  is_revoked: boolean;
}

export const ApiKeySettings = () => {
  const { projectId } = useSelectedProject();
  const { isLoading, data, refetch } = useApiKeyControllerFindOne<IApiKeyDTO>(
    {
      pathParams: { projectId: projectId as string },
    },
    { enabled: Boolean(projectId), retry: false }
  );

  console.log(data);

  const handleGenerate = async () => {
    if (data?.id) {
      openConfirmModal({
        title: "Generate a new API key?",
        children: (
          <Text size="sm">
            Generating a new API key will make a current one invalid.
          </Text>
        ),
        labels: {
          cancel: "Cancel",
          confirm: "Generate",
        },
        onConfirm: async () => {
          await fetchApiKeyControllerRegenerate({
            body: {
              expires: getDefaultExpires(),
            },
            pathParams: {
              apiKey: data.id,
            },
          });
        },
      });
    } else {
      await fetchApiKeyControllerCreate({
        body: {
          expires: getDefaultExpires(),
          project_id: projectId as string,
        },
      });

      await refetch();
    }
  };

  const handleRevoke = () => {
    openConfirmModal({
      title: "Revoke the API key?",
      children: (
        <Text size="sm">Revoking the API key will make it invalid.</Text>
      ),
      labels: {
        cancel: "Cancel",
        confirm: "Revoke",
      },
      confirmProps: {
        color: "red",
        variant: "light",
      },
      onConfirm: async () => {
        await fetchApiKeyControllerRevoke({
          pathParams: {
            apiKey: data?.api_key as string,
          },
          body: {
            is_revoked: true,
          },
        });

        await refetch();
      },
    });
  };

  return (
    <Stack align="flex-start">
      {data?.api_key && (
        <>
          <Group noWrap>
            <Text sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
              <Text component="strong" fw={700}>
                API key:
              </Text>
              &nbsp;
              {data?.api_key}
            </Text>
            <CopyActionButton value={data?.api_key} />
          </Group>

          <Group noWrap>
            <Text sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
              <Text component="strong" fw={700}>
                Expires at:
              </Text>
              &nbsp;
              {data?.expires}
            </Text>
          </Group>

          {data?.is_revoked && (
            <Badge color="red" variant="outline">
              Revoked
            </Badge>
          )}
        </>
      )}

      <Group w="100%" position="right">
        <Button onClick={handleGenerate}>Generate</Button>
        <Button onClick={handleRevoke} color="red" variant="light">
          Revoke
        </Button>
      </Group>
    </Stack>
  );
};
