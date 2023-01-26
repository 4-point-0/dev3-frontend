import { showNotification, updateNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import "react-phone-number-input/style.css";
import { Check, X } from "tabler-icons-react";

import {
  AccountForm,
  IAddressFormValues,
} from "../../../components/address-book/AddressForm";
import { PageContainer } from "../../../components/layout/PageContainer";
import { fetchAddressControllerCreate } from "../../../services/api/dev3Components";

const CreateAddress = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async ({
    alias,
    wallet,
    email,
    phone,
  }: IAddressFormValues) => {
    try {
      setLoading(true);

      showNotification({
        id: "loading-notification",
        loading: true,
        title: "Adding a new address",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });

      await fetchAddressControllerCreate({
        body: {
          alias,
          wallet,
          email: email === "" ? undefined : email,
          phone: phone === "" ? undefined : phone,
        },
      });

      updateNotification({
        id: "loading-notification",
        color: "teal",
        title: "New address created!",
        message: "New address has been created. You can now use it.",
        icon: <Check size={16} />,
        autoClose: 3000,
      });

      router.push(`/${router.query.slug}/address-book`);
    } catch (error) {
      updateNotification({
        id: "loading-notification",
        color: "red",
        title: "Error while adding address",
        message:
          "There was an error adding new address. Please try again later.",
        icon: <X size={16} />,
        autoClose: 3000,
      });

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add new address">
      <AccountForm disabled={loading} handleSubmit={handleSubmit} />
    </PageContainer>
  );
};

export default CreateAddress;
