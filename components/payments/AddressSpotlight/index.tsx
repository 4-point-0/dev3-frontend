import { ActionIcon, Loader } from "@mantine/core";
import { openSpotlight, SpotlightProvider } from "@mantine/spotlight";
import React from "react";
import { AddressBook, Search } from "tabler-icons-react";

import { useAddressControllerFindAll } from "../../../services/api/dev3Components";
import { Address } from "../../../services/api/dev3Schemas";

interface IAddressSpotlightProps {
  onSelect: (wallet: Address) => void;
}

export const AddressSpotlight: React.FC<IAddressSpotlightProps> = ({
  onSelect,
}) => {
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

  return (
    <SpotlightProvider
      actions={
        data?.results?.map((address) => ({
          title: address.alias,
          description: address.wallet,
          onTrigger: () => onSelect(address),
        })) ?? []
      }
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
