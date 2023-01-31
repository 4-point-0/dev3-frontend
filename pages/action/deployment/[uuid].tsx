import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { BN } from "bn.js";
import {
  formatNearAmount,
  parseNearAmount,
} from "near-api-js/lib/utils/format";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ThreeDCubeSphere } from "tabler-icons-react";

import { ProjectTransactionContainer } from "../../../components/action/ProjectTransactionContainer";
import { useUserContext } from "../../../context/UserContext";
import { useWalletSelector } from "../../../context/WalletSelectorContext";
import { useDeployedContractControllerFindByUuidPublic } from "../../../services/api/dev3Components";
import { THIRTY_TGAS } from "../../../utils/near";

const DEV3_CONTRACT = "dev3_contracts.testnet";

// TODO: patch the request with information
// transactionHashes=5nqBUXHzcMEx1MoPbUGiEXuQEeTVYXjjuKAE9SeNjmhd

const Deployment = () => {
  const router = useRouter();
  const userContext = useUserContext();
  const { viewMethod, callMethod } = useWalletSelector();

  const [isDeploying] = useState<boolean>(false);

  const { data, isLoading } = useDeployedContractControllerFindByUuidPublic({
    pathParams: {
      uuid: router.query.uuid as string,
    },
  });

  const contractId = useMemo(() => {
    return data?.args["contract_id"] as string;
  }, [data?.args]);

  const { data: deploymentPrice, isLoading: isLoadingDeploymentPrice } =
    useQuery({
      queryKey: ["get_contract_deployment_price", contractId],
      queryFn: () => {
        return viewMethod(DEV3_CONTRACT, "get_contract_deployment_price", {
          contract_id: contractId,
        });
      },
      enabled: !isLoading && Boolean(contractId),
    });

  const deposit = useMemo(() => {
    if (!deploymentPrice) {
      return;
    }

    const fixed = parseNearAmount("0.1");
    return new BN(fixed as string).add(new BN(deploymentPrice)).toString();
  }, [deploymentPrice]);

  const handleDeployButtonClick = async () => {
    await callMethod(
      DEV3_CONTRACT,
      "create_factory_subaccount_and_deploy",
      data?.args,
      deposit,
      THIRTY_TGAS
    );
  };

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

        <Skeleton visible={isLoadingDeploymentPrice}>
          {deposit && (
            <Text c="dimmed">Deposit price: {formatNearAmount(deposit)} Ⓝ</Text>
          )}
        </Skeleton>

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
