import {
  Button,
  Group,
  Paper,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { NextPage } from "next";
import { useState } from "react";
import { Check, X } from "tabler-icons-react";
import { fetchProjectControllerCreate } from "../../services/api/dev3Components";

const NewProject: NextPage = () => {
  const theme = useMantineTheme();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      logoUrl: "",
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { name, slug, logoUrl } = form.values;

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

      const project = await fetchProjectControllerCreate({
        body: {
          name,
          slug,
          logoUrl,
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

      console.log(project);
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
    <Paper p="lg" sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          withAsterisk
          label="Project Name"
          placeholder="Enter project name"
          {...form.getInputProps("name")}
        />

        <TextInput
          mt="sm"
          withAsterisk
          label="Project Slug"
          placeholder="Enter project slug"
          {...form.getInputProps("slug")}
        />

        <TextInput
          mt="sm"
          withAsterisk
          label="Project Logo URL"
          placeholder="Enter project logo URL"
          {...form.getInputProps("logoUrl")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Paper>
  );
};

export default NewProject;
