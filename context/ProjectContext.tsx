import React, { useContext, useState } from "react";
import { Project } from "../services/api/dev3Schemas";

interface ProjectContextValue {
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  needRefresh: boolean;
  setNeedRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectContext = React.createContext<ProjectContextValue | null>(null);

export const ProjectContextProvider = ({ children }: any) => {
  const [project, setProject] = useState<Project | null>(null);
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        needRefresh,
        setNeedRefresh,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProjectContext must be used within a ProjectContextProvider"
    );
  }

  return context;
}
