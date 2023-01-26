import { useRouter } from "next/router";
import React, { PropsWithChildren, useContext } from "react";
import { useProjectControllerFindBySlug } from "../services/api/dev3Components";

import { Project, ProjectDto } from "../services/api/dev3Schemas";

interface UseSelectedProject {
  project?: ProjectDto;
  projectId?: string;
}

const ProjectContext = React.createContext<UseSelectedProject | null>(null);

interface ISelectedProjectProviderProps extends PropsWithChildren {
  project?: ProjectDto;
}

export const SelectedProjectProvider: React.FC<
  ISelectedProjectProviderProps
> = ({ children, project }) => {
  const router = useRouter();

  return (
    <ProjectContext.Provider
      value={{
        project,
        projectId: project?.id,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useSelectedProject() {
  const router = useRouter();

  const { data: project } = useProjectControllerFindBySlug(
    {
      pathParams: {
        slug: router.query.slug as string,
      },
    },
    {
      enabled: Boolean(router.query.slug),
      onError: (error) => {
        // console.log(error);
      },
    }
  );

  return {
    project,
    projectId: project?.id,
  };
}
