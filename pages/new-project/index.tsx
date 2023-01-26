import {
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";
import { PageContainer } from "../../components/layout/PageContainer";
import { ProjectImage } from "../../components/settings/ProjectImage";

import {
  fetchApiKeyControllerCreate,
  fetchFileControllerUploadFile,
  fetchProjectControllerCreate,
  useProjectControllerFindAll,
} from "../../services/api/dev3Components";
import { getDefaultExpires } from "../../utils/api-key";

const NewProject: NextPage = () => {
  const theme = useMantineTheme();

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<FileWithPath | null>(null);

  const { refetch: refetchProjects } = useProjectControllerFindAll({});

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: "",
      slug: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      slug: (value) => (value.length > 0 ? null : "Slug is required"),
    },
  });

  const handleImageUpload = (file: FileWithPath) => {
    setLogoFile(file);
  };

  const handleSubmit = async ({
    name,
    slug,
  }: {
    name: string;
    slug: string;
  }) => {
    try {
      setLoading(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Creating a new project",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      let logoId;

      if (logoFile) {
        const uploadedFile = await fetchFileControllerUploadFile({
          body: {
            file: logoFile,
          },
        });

        logoId = (uploadedFile as any)._id;
      }

      const project = await fetchProjectControllerCreate({
        body: {
          name,
          slug,
          logo_id: logoId,
        } as any,
      });

      await fetchApiKeyControllerCreate({
        body: {
          project_id: (project as any)._id,
          expires: getDefaultExpires(),
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "Project created!",
        message:
          "Your project has been created. You can now start adding contracts to it.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      await refetchProjects();
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error creating project",
        message:
          "There was an error creating your project. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Create new project">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          disabled={loading}
          withAsterisk
          label="Project Name"
          placeholder="Enter project name"
          {...form.getInputProps("name")}
        />

        <TextInput
          disabled={loading}
          mt="sm"
          withAsterisk
          label="Project Slug"
          placeholder="Enter project slug"
          {...form.getInputProps("slug")}
        />

        <Stack mt="md" spacing={4}>
          <Text fz="sm">Logo Image</Text>
          <ProjectImage onUpload={handleImageUpload} />
        </Stack>

        <Group position="right" mt="md">
          <Button disabled={loading} type="submit">
            Create project
          </Button>
        </Group>
      </form>
    </PageContainer>
  );
};

export default NewProject;
