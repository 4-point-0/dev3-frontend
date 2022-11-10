import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Check, Copy, ExternalLink, Plus, Share } from "tabler-icons-react";
import showShareModal from "../../components/ShareModal";
import { useProjectContext } from "../../context/ProjectContext";
import { usePaymentControllerFindAll } from "../../services/api/dev3Components";

const Payments = () => {
  const projectContext = useProjectContext();
  const { isLoading, data } = usePaymentControllerFindAll({});

  const showModal = (title: string, id: string) => {
    showShareModal({
      title,
      url: `${window.location.origin}${getUrl(id)}`,
    });
  };

  const getUrl = (id: string) =>
    `/${projectContext.project?.slug}/request-send/${id}/action`;

  const rows = data?.results?.map((element) => (
    <tr key={element.uid}>
      <td>{element.receiver}</td>
      <td>{element.amount}</td>
      <td>
        {element.receiver_fungible.length > 0
          ? element.receiver_fungible
          : "NEAR"}
      </td>
      <td>
        <Badge size="md">{element.status.toUpperCase()}</Badge>
      </td>
      <td>{new Date(element.updatedAt).toLocaleString()}</td>
      <td>
        <Group>
          <CopyButton value={getUrl(element.uid)} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="bottom"
              >
                <ActionIcon
                  radius="xl"
                  variant="light"
                  color={copied ? "teal" : "primary"}
                  onClick={copy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label="Open url" withArrow position="bottom">
            <ActionIcon
              radius="xl"
              variant="light"
              color="primary"
              component={NextLink}
              target="_blank"
              href={getUrl(element.uid)}
            >
              <ExternalLink size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Share" withArrow position="bottom">
            <ActionIcon
              radius="xl"
              variant="light"
              color="primary"
              onClick={() => showModal(`Request for payment`, element.uid)}
            >
              <Share size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  ));

  if (isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <Stack align="flex-start">
      <Text size="xl" weight={500}>
        Payment Requests
      </Text>
      <Button
        sx={{ alignSelf: "self-end" }}
        component={NextLink}
        href="/payments/create"
        variant="light"
        leftIcon={<Plus />}
      >
        Create payment request
      </Button>
      <Paper sx={{ width: "100%" }} shadow="sm" p="md" withBorder>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Reciever Address</th>
              <th>Amount</th>
              <th>Token</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default Payments;
