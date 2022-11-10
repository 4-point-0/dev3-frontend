import { Box } from "@mantine/core";
import { useRouter } from "next/router";

const PaymentRequestDetail = () => {
  const router = useRouter();
  const { uid } = router.query;

  return (
    <Box>
      <h1>Payment Request Detail for {uid}</h1>
    </Box>
  );
};

export default PaymentRequestDetail;
