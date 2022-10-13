import { Footer, Group, Text } from "@mantine/core";

const AppFooter = () => {
  return (
    <Footer height={60} p="md">
      <Group position="apart">
        <Text>Dev3 - Blockchain Low-Code App Devlopment and Automation</Text>

        <Text size="sm" color="dimmed">
          1.0.0
        </Text>
      </Group>
    </Footer>
  );
};

export default AppFooter;
