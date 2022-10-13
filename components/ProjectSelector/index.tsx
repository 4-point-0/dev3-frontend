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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Plus, Selector } from "tabler-icons-react";
import { useProjectContext } from "../../context/ProjectContext";
import { useUserControllerProjectsOwned } from "../../services/api/dev3Components";
import { Project } from "../../services/api/dev3Schemas";

const ProjectSelector = () => {
  const { isLoading, error, data } = useUserControllerProjectsOwned({});
  const { project, setProject } = useProjectContext();
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    project
  );
  const router = useRouter();

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedProject(project ?? data[0]);
      setProject(project ?? data[0]);
      router.push("/contracts");
    } else {
      router.push("/new-project");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, data, setProject]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.payload}</Text>;
  }

  if (!data || data.length === 0) {
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
                selectedProject?.logoUrl ?? "https://via.placeholder.com/150"
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
        {data?.map((project) => {
          return (
            <Menu.Item
              sx={{ width: "100%" }}
              icon={
                <Avatar
                  size="lg"
                  radius="sm"
                  alt={project.name}
                  src={project.logoUrl}
                />
              }
              rightSection={project.slug === selectedProject?.slug ? "✓" : ""}
              key={project.name}
              onClick={() => {
                setSelectedProject(project);
                setProject(project);
                router.push("/contracts");
              }}
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
