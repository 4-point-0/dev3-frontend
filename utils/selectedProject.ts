import { GetServerSideProps } from "next";

import { fetchProjectControllerFindBySlug } from "../services/api/dev3Components";

type Data = {
  projectId?: string;
};

export const getSelectedProjectProps: GetServerSideProps<Data> = async (
  context
) => {
  const slug = context.query.slug as string;

  try {
    const project = await fetchProjectControllerFindBySlug({
      pathParams: {
        slug,
      },
    });

    return {
      props: {
        projectId: project.id,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "404",
        permanent: false,
      },
    };
  }
};
