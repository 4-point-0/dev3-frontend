import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";
import { ProjectImage } from "../../components/ProjectImage";

import { useSelectedProject } from "../../context/SelectedProjectContext";
import {
  fetchFileControllerUpdateFile,
  fetchFileControllerUploadFile,
  fetchProjectControllerUpdate,
  useProjectControllerFindAll,
} from "../../services/api/dev3Components";
import { getLogoUrl } from "../../utils/logo";

const Settings: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<FileWithPath>();
  const { project } = useSelectedProject();
  const { refetch } = useProjectControllerFindAll({});

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: project?.name ?? "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
    },
  });

  const handleImageUpload = async (file: FileWithPath) => {
    setLogoFile(file);
  };

  const handleSubmit = async ({ name }: { name: string }) => {
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

      const id = (project as any)._id;
      let logoId = (project?.logo as any)?._id;

      if (logoFile && logoId) {
        await fetchFileControllerUpdateFile({
          body: {
            file: logoFile,
          },
          pathParams: {
            id: logoId,
          },
        });
      } else if (logoFile) {
        const uploadedFile = await fetchFileControllerUploadFile({
          body: {
            file: logoFile,
          },
        });

        logoId = (uploadedFile as any)._id;
      }

      await fetchProjectControllerUpdate({
        pathParams: {
          id,
        },
        body: {
          name,
          logo_id: logoId,
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
    <Container py="md">
      <Paper p="xl" withBorder shadow="md">
        <Stack spacing="md">
          <Title order={2}>Settings</Title>

          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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

          <ProjectImage
            imgUrl={project?.logo && getLogoUrl(project.logo)}
            onUpload={handleImageUpload}
          />
        </Stack>
      </Paper>
    </Container>
  );
};

export default Settings;
