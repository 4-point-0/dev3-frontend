import { useRouter } from "next/router";
import React, { PropsWithChildren, useContext, useState } from "react";

import { Project } from "../services/api/dev3Schemas";

interface UseSelectedProject {
  project?: Project;
  projectId?: string;
  setProject: (project: Project) => void;
}

const ProjectContext = React.createContext<UseSelectedProject | null>(null);

export const SelectedProjectProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [project, setProject] = useState<Project>();

  return (
    <ProjectContext.Provider
      value={{
        project,
        projectId: (project as any)?._id,
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useSelectedProject() {
  const router = useRouter();
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useSelectedProject must be used within a SelectedProjectProvider"
    );
  }

  if (!(context.project || router.route === "/")) {
    router.push("/");
  }

  return context;
}
