import { Divider, Navbar } from "@mantine/core";
import { useProjectContext } from "../../context/ProjectContext";
import { useUserContext } from "../../context/UserContext";
import ProjectSelector from "../ProjectSelector";
import { AppLinks, AppLinksBottom } from "./Links.component";

export interface AdminNavbarProps {
  opened: boolean;
}

const AppNavbar = ({ opened }: AdminNavbarProps) => {
  const userData = useUserContext();
  const { project } = useProjectContext();

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Navbar.Section>
        <ProjectSelector />
      </Navbar.Section>
      <Navbar.Section mt="md">
        <AppLinks disabled={project === null} />
      </Navbar.Section>
      <Divider mt={16} />
      <Navbar.Section grow mt="md">
        <AppLinksBottom disabled={project === null} />
      </Navbar.Section>
    </Navbar>
  );
};

export default AppNavbar;
