import { ActionIcon, Loader } from "@mantine/core";
import {
  openSpotlight,
  SpotlightAction,
  SpotlightProvider,
} from "@mantine/spotlight";
import React, { useCallback, useMemo } from "react";
import { AddressBook, Search } from "tabler-icons-react";

import { useAddressControllerFindAll } from "../../../services/api/dev3Components";
import { useWalletSelector } from "../../../context/WalletSelectorContext";

interface IAddressSpotlightProps {
  onSelect: (wallet: string) => void;
}

export const AddressSpotlight: React.FC<IAddressSpotlightProps> = ({
  onSelect,
}) => {
  const { selector } = useWalletSelector();
  const [query, setQuery] = React.useState<string>();
  const { isLoading, data } = useAddressControllerFindAll(
    {
      queryParams: {
        ...(query && { alias: query }),
      },
    },
    {
      keepPreviousData: true,
    }
  );

  const handleOpen = () => openSpotlight();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleTrigger = useCallback(
    (wallet: string) => {
      return () => onSelect(wallet);
    },
    [onSelect]
  );

  const myAddressAction: SpotlightAction | undefined = useMemo(() => {
    const state = selector.store.getState();
    const accountId = state.accounts?.[0].accountId;

    if (!accountId) {
      return;
    }

    return {
      title: "Set my address",
      description: accountId,
      onTrigger: handleTrigger(accountId),
    };
  }, [selector, handleTrigger]);

  const actions: Array<SpotlightAction> =
    data?.results?.map((address) => ({
      title: address.alias,
      description: address.wallet,
      onTrigger: handleTrigger(address.wallet),
    })) ?? [];

  return (
    <SpotlightProvider
      actions={myAddressAction ? [myAddressAction, ...actions] : actions}
      searchIcon={<Search size={18} />}
      searchPlaceholder="Search addresses by alias"
      nothingFoundMessage="No addresses match query"
      onQueryChange={handleQueryChange}
    >
      <ActionIcon
        hidden={isLoading || data?.results?.length === 0}
        size="lg"
        onClick={handleOpen}
        variant="filled"
        radius={0}
      >
        <AddressBook size={22} />
      </ActionIcon>
    </SpotlightProvider>
  );
};
