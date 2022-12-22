import { Button, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import React, { useMemo, useState } from "react";
import { Check, X } from "tabler-icons-react";

import { useSelectedProject } from "../../../context/SelectedProjectContext";
import {
  fetchApiKeyControllerCreate,
  useApiKeyControllerFindOne,
} from "../../../services/api/dev3Components";
import { getDefaultExpires } from "../../../utils/api-key";
import { CopyActionButton } from "../../core/CopyActionButton";

export const ProjectDetails: React.FC = () => {
  const { projectId } = useSelectedProject();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, refetch, isLoading } = useApiKeyControllerFindOne<{
    api_key: string;
  }>(
    {
      pathParams: {
        projectId: projectId as string,
      },
    },
    {
      enabled: Boolean(projectId),
      retry: false,
    }
  );

  const apiKey = useMemo(() => {
    return data?.api_key;
  }, [data]);

  const handleApiKeyGenerate = async () => {
    try {
      setIsGenerating(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Generating a new API key",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      await fetchApiKeyControllerCreate({
        body: {
          project_id: projectId as string,
          expires: getDefaultExpires(),
        },
      });

      await refetch();

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "API key generated!",
        message: "Your project API key has been generated.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });
    } catch {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error generating API key",
        message:
          "There was an error generating the API key. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <Stack spacing="xs" fz="sm">
      <Stack spacing={0}>
        <Text tt="uppercase" fw={700}>
          API key:
        </Text>
        {apiKey ? (
          <Group noWrap>
            <Tooltip label={apiKey}>
              <Text sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                {apiKey}
              </Text>
            </Tooltip>
            <CopyActionButton value={apiKey} />
          </Group>
        ) : (
          <Skeleton visible={isLoading}>
            <Button
              variant="default"
              size="xs"
              onClick={handleApiKeyGenerate}
              disabled={isGenerating}
              w="100%"
            >
              Generate API key
            </Button>
          </Skeleton>
        )}
      </Stack>
      <Stack spacing={0}>
        <Text tt="uppercase" fw={700}>
          Project Id:
        </Text>
        <Group noWrap>
          <Text sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
            {projectId}
          </Text>
          <CopyActionButton value={projectId} />
        </Group>
      </Stack>
    </Stack>
  );
};
