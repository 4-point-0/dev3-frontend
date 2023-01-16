import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { ThreeDCubeSphere } from "tabler-icons-react";

import { ProjectTransactionContainer } from "../../../components/action/ProjectTransactionContainer";
import { useUserContext } from "../../../context/UserContext";
import { useDeployedContractControllerFindByUuidPublic } from "../../../services/api/dev3Components";

const Deployment = () => {
  const router = useRouter();
  const userContext = useUserContext();

  const [isDeploying] = useState<boolean>(false);

  const { data, isLoading } = useDeployedContractControllerFindByUuidPublic({
    pathParams: {
      uuid: router.query.uuid as string,
    },
  });

  const handleDeployButtonClick = () => {};

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <ProjectTransactionContainer
      logoUrl={data?.project_logo_url}
      projectName={data?.project_name}
      description="is requesting you to deploy"
    >
      <Stack mt="md">
        <Card withBorder>
          <Group noWrap>
            <ThemeIcon size="xl" variant="light">
              <ThreeDCubeSphere />
            </ThemeIcon>
            <Box>
              <Title order={4}>{data?.contract_template_name}</Title>
              <Text>{data?.contract_template_description}</Text>
            </Box>
          </Group>
        </Card>

        <Button
          disabled={userContext.user === null || isDeploying}
          fullWidth
          variant="light"
          onClick={handleDeployButtonClick}
        >
          {userContext.user === null
            ? "You need to connect a wallet"
            : "Deploy"}
        </Button>
      </Stack>
    </ProjectTransactionContainer>
  );
};

export default Deployment;
