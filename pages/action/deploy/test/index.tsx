import {
  Box,
  Button,
  Card,
  Center,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { Transaction } from "@near-wallet-selector/core";
import { providers, utils } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThreeDCubeSphere } from "tabler-icons-react";
import { CopyActionButton } from "../../../../components/core/CopyActionButton";
import { useWalletSelector } from "../../../../context/WalletSelectorContext";

const ContractDeployment = () => {
  const { selector, accountId } = useWalletSelector();

  const [contractDeploymentId, setContractDeploymentId] = useState<
    string | null
  >(null);

  const [alias, setAlias] = useState("");

  const [contracts, setContracts] = useState<string[]>([]);

  const router = useRouter();
  const { transactionHashes } = router.query;

  useEffect(() => {
    console.log("transactionHashes", transactionHashes);

    const getTransactionStatus = async (hash: string, accountId: string) => {
      if (!accountId) return;

      const { network } = selector.options;
      const provider = new providers.JsonRpcProvider({
        url: network.nodeUrl,
      });
      const tx = await provider.txStatusReceipts(hash, accountId);

      const deployedContractAccountId = (tx as any).receipts
        .filter((el: any) => el.receiver_id.includes(".dev3_contracts.testnet"))
        .map((el: any) => el.receiver_id)[0];

      if (!deployedContractAccountId) return;

      openModal({
        title: "Contract deployed",

        children: (
          <>
            <Stack mt="md">
              <Card withBorder>
                <Group noWrap>
                  <ThemeIcon size="xl" variant="light">
                    <ThreeDCubeSphere />
                  </ThemeIcon>
                  <Box>
                    <Text size="lg">Contract account id:</Text>
                    <Text size="md">{deployedContractAccountId}</Text>
                  </Box>
                  <CopyActionButton value={deployedContractAccountId} />
                </Group>
              </Card>

              <Button
                variant="light"
                component="a"
                target="_blank"
                href={`https://testnet.nearblocks.io/address/${deployedContractAccountId}#contract`}
              >
                Open contract
              </Button>
            </Stack>
          </>
        ),
      });
    };

    if (transactionHashes && accountId) {
      getTransactionStatus(transactionHashes as string, accountId);
    }
  }, [transactionHashes]);

  useEffect(() => {
    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const getContracts = async () => {
      const result = await provider.query<CodeResult>({
        request_type: "call_function",
        account_id: "dev3_contracts.testnet",
        method_name: "get_contracts",
        args_base64: "",
        finality: "optimistic",
      });

      const contracts = JSON.parse(Buffer.from(result.result).toString());
      setContracts(contracts);
    };

    getContracts();
  }, []);

  const deployContract = async () => {
    if (!accountId) return;

    const wallet = await selector.wallet();

    const codeDeployTransaction: Transaction = {
      signerId: accountId,
      receiverId: "dev3_contracts.testnet",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "create_factory_subaccount_and_deploy",
            args: { contract_id: contractDeploymentId, name: alias },
            gas: "100000000000000",
            deposit: utils.format.parseNearAmount("5") || "0", // TODO: figure out an optimal amount
          },
        },
      ],
    };

    const result = await wallet.signAndSendTransaction(codeDeployTransaction); // Handling this on callback with transactionHashes in url
  };

  return (
    <Center>
      <Card withBorder sx={{ minWidth: "400px", width: "40%" }}>
        <Stack>
          <Title>Deploy a contract</Title>

          <TextInput
            withAsterisk
            label="Enter alias for your contract"
            type="text"
            value={alias}
            onChange={(event) => setAlias(event.currentTarget.value)}
          />

          <Select
            label="Select contract to deploy"
            value={contractDeploymentId}
            onChange={setContractDeploymentId}
            data={contracts.map((el) => {
              return { label: el, value: el };
            })}
          />

          <Text size="md">
            You will be charged 5 NEAR for deploying a contract
          </Text>

          <Button
            mt="md"
            variant="light"
            disabled={!alias || !contractDeploymentId}
            onClick={deployContract}
          >
            Deploy
          </Button>
        </Stack>
      </Card>
    </Center>
  );
};

export default ContractDeployment;
