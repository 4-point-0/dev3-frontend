import {
  Avatar,
  Button,
  Divider,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";
import { useMemo } from "react";
import { Plus, Selector } from "tabler-icons-react";

import {
  isSameProject,
  useSelectedProject,
} from "../../context/SelectedProjectContext";
import { useProjectControllerFindAll } from "../../services/api/dev3Components";
import { Project } from "../../services/api/dev3Schemas";
import { getLogoUrl } from "../../utils/logo";

const ProjectSelector = () => {
  const { project, selectProject } = useSelectedProject();
  const { isLoading, error, data } = useProjectControllerFindAll({});

  const selectedProject = useMemo(() => {
    if (!(data?.results && project)) {
      return null;
    }

    return data.results.find(isSameProject(project));
  }, [data, project]);

  const handleSelect = (project: Project) => {
    return () => {
      selectProject(project);
    };
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.payload}</Text>;
  }

  if (!data || data.results?.length === 0) {
    return (
      <Link href="/new-project" passHref>
        <Button fullWidth leftIcon={<Plus size={14} />}>
          Create new project
        </Button>
      </Link>
    );
  }

  return (
    <Menu transition="fade" position="bottom" width="90%">
      <Menu.Target>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.sm,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <Avatar
              size="lg"
              radius="sm"
              alt="Project logo"
              src={
                selectedProject?.logo
                  ? getLogoUrl(selectedProject.logo)
                  : "https://via.placeholder.com/150"
              }
            />

            <Group position="apart" sx={{ flex: 1 }}>
              <Text size="sm" color="dimmed">
                {selectedProject?.name ?? ""}
              </Text>
              <Selector size={18} />
            </Group>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/new-project" passHref>
          <Menu.Item sx={{ height: 60 }} icon={<Plus size={18} />}>
            Create new project
          </Menu.Item>
        </Link>
        <Divider mb={8} />
        {data?.results?.map((project) => {
          return (
            <Menu.Item
              sx={{ width: "100%" }}
              icon={
                <Avatar
                  size="lg"
                  radius="sm"
                  alt={project.name}
                  src={getLogoUrl(project?.logo)}
                />
              }
              rightSection={project.slug === selectedProject?.slug ? "✓" : ""}
              key={project.name}
              onClick={handleSelect(project)}
            >
              {project.name}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProjectSelector;
