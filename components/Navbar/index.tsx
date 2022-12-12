import { Divider, Navbar } from "@mantine/core";

import { useSelectedProject } from "../../context/SelectedProjectContext";
import { useUserContext } from "../../context/UserContext";
import ProjectSelector from "../ProjectSelector";
import { AppLinks, AppLinksBottom } from "./Links.component";

export interface AdminNavbarProps {
  opened: boolean;
}

const AppNavbar = ({ opened }: AdminNavbarProps) => {
  const userData = useUserContext();
  const { project } = useSelectedProject();

  return (
    <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      <Navbar.Section>
        <ProjectSelector />
      </Navbar.Section>
      <Divider />
      <Navbar.Section p="sm">
        <AppLinks disabled={project === null} />
      </Navbar.Section>
      <Divider />
      <Navbar.Section grow p="sm">
        <AppLinksBottom disabled={project === null} />
      </Navbar.Section>
    </Navbar>
  );
};

export default AppNavbar;
