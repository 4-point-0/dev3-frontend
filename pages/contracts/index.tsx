import { Button, Group, Tabs } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { NextPage } from "next";
import { useState } from "react";
import { Plus, ThreeDCubeSphere, ClockHour4 } from "tabler-icons-react";

import { DeployedContracts } from "../../components/contracts/DeployedContracts";
import { PendingTransactions } from "../../components/contracts/PendingTransactions";
import { PageContainer } from "../../components/layout/PageContainer";

const Contracts: NextPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("contracts");

  return (
    <PageContainer title="Contracts" containerProps={{ fluid: true }}>
      <Button
        sx={{ alignSelf: "self-end" }}
        component={NextLink}
        href="/contracts/create"
        variant="light"
        leftIcon={<Plus />}
      >
        Deploy from template
      </Button>

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List defaultValue="contracts">
          <Tabs.Tab value="contracts" icon={<ThreeDCubeSphere size={14} />}>
            Contracts
          </Tabs.Tab>
          <Tabs.Tab value="transactions" icon={<ClockHour4 size={14} />}>
            Pending Transactions
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="contracts">
          <DeployedContracts />
        </Tabs.Panel>
        <Tabs.Panel value="transactions">
          <PendingTransactions />
        </Tabs.Panel>
      </Tabs>
    </PageContainer>
  );
};

export default Contracts;
