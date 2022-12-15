import { useRouter } from "next/router";
import React, { useCallback, useContext, useState } from "react";

import { useProjectControllerFindAll } from "../services/api/dev3Components";
import { Project } from "../services/api/dev3Schemas";

interface UseSelectedProject {
  project: Project | null;
  selectProject: (project: Project) => void;
}

const ProjectContext = React.createContext<UseSelectedProject | null>(null);

export function isSameProject(a: Project | null) {
  return (b: Project | null) => {
    return (a as any)?._id === (b as any)?._id;
  };
}

export const SelectedProjectProvider = ({ children }: any) => {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useProjectControllerFindAll(
    {},
    {
      onSuccess: ({ results: projects }) => {
        if (!projects) {
          return;
        }

        if (projects.length === 0) {
          router.push("/new-project");
        }

        if (!project) {
          selectProject(projects[0]);
        }
      },
    }
  );

  const selectProject = useCallback(
    (selectedProject: Project) => {
      setProject((previousProject) => {
        if (
          previousProject &&
          !isSameProject(selectedProject)(previousProject)
        ) {
          router.push("/contracts");
        }

        return selectedProject;
      });
    },
    [setProject]
  );

  return (
    <ProjectContext.Provider
      value={{
        project,
        selectProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useSelectedProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useSelectedProject must be used within a SelectedProjectProvider"
    );
  }

  return context;
}
