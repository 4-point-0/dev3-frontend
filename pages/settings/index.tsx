import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";

import { useSelectedProject } from "../../context/SelectedProjectContext";
import {
  fetchProjectControllerUpdate,
  useProjectControllerFindAll,
} from "../../services/api/dev3Components";

const Settings: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const { project } = useSelectedProject();
  const { refetch } = useProjectControllerFindAll({});

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: project?.name ?? "",
      logoUrl: project?.logoUrl ?? "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      logoUrl: (value) => (value.length > 0 ? null : "Logo URL is required"),
    },
  });

  const handleSubmit = async ({
    name,
    logoUrl,
  }: {
    name: string;
    logoUrl: string;
  }) => {
    try {
      setLoading(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Updating project",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      const response = await fetchProjectControllerUpdate({
        pathParams: {
          id: (project as any)._id,
        },
        body: {
          name,
          logoUrl,
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "Project updated!",
        message: "Your project has been updated.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      refetch();
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error updating project",
        message:
          "There was an error updating your project. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Text size="xl" weight={500}>
        Settings
      </Text>
      <Paper p="lg" sx={{ maxWidth: 600 }} mx="auto">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Center>
            <Image
              src={form.values.logoUrl}
              withPlaceholder
              height={200}
              width={200}
              radius="md"
              alt={`${project?.name} Logo`}
            />
          </Center>

          <TextInput
            disabled={loading}
            mt="md"
            withAsterisk
            label="Project Logo URL"
            placeholder="Enter project logo URL"
            {...form.getInputProps("logoUrl")}
          />

          <TextInput
            mt="md"
            disabled={loading}
            withAsterisk
            label="Project Name"
            placeholder="Enter project name"
            {...form.getInputProps("name")}
          />

          <Group position="right" mt="md">
            <Button disabled={loading} type="submit">
              Update project
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings;
