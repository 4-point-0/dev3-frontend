import {
  Badge,
  Button,
  Group,
  MediaQuery,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { Plus } from "tabler-icons-react";
import { AuditedIcon } from "./AuditedIcon";

interface IContractTemplate {
  _id: string;
  name: string;
  is_audited: boolean;
  tags: Array<string>;
  creator_name: string;
  description: string;
}

interface ITemplateListProps {
  contracts: Array<IContractTemplate>;
  onSelect: (id: string) => void;
}

const ResponsiveContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <MediaQuery largerThan="lg" styles={{ display: "none" }}>
        <Stack>{children}</Stack>
      </MediaQuery>
      <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
        <Group noWrap grow>
          {children}
        </Group>
      </MediaQuery>
    </>
  );
};

export const TemplateList: React.FC<ITemplateListProps> = ({
  contracts,
  onSelect,
}) => {
  const handleCreate = (id: string) => {
    return () => {
      onSelect(id);
    };
  };

  return (
    <Stack spacing="xs">
      {contracts.map(
        ({ name, _id, description, creator_name, tags, is_audited }) => (
          <Paper key={_id} withBorder p="md">
            <ResponsiveContainer>
              <Group sx={{ flex: 2 }} noWrap>
                <AuditedIcon isAudited={is_audited} />

                <Stack spacing={0}>
                  <Title order={4}>{name}</Title>
                  <Text>{creator_name}</Text>
                </Stack>
              </Group>

              <Stack sx={{ flex: 5 }}>
                <Text>{description}</Text>
                <Group spacing="xs">
                  {tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </Group>
              </Stack>

              <Group position="right">
                <Button
                  variant="light"
                  leftIcon={<Plus size={14} />}
                  onClick={handleCreate(_id)}
                >
                  Create
                </Button>
              </Group>
            </ResponsiveContainer>
          </Paper>
        )
      )}
    </Stack>
  );
};
