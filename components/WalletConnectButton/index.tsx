import { Button } from "@mantine/core";
import { useWalletSelector } from "../../context/WalletSelectorContext";

const WalletConnectButton = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();

  const handleSignIn = () => {
    modal.show();
  };

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  if (!accountId) {
    return <Button onClick={handleSignIn}>Connect Wallet</Button>;
  }

  return <Button onClick={handleSignOut}>Sign out</Button>;
};

export default WalletConnectButton;
