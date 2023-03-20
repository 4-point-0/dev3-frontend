import { ConnectConfig } from "near-api-js";
import { KeyStore } from "near-api-js/lib/key_stores";
import { formatNearAmount } from "near-api-js/lib/utils/format";

export const THIRTY_TGAS = "30000000000000" as const;
export const NO_DEPOSIT = "0";

export const DEV3_CONTRACT_ID = process.env
  .NEXT_PUBLIC_DEV3_CONTRACT_ID as string;

export const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK as string;
export const IS_TESTNET = NETWORK_ID === "testnet";

export class FungibleTokenError extends Error {}

export class ReceiverError extends Error {}

export const nearWalletRegex =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

// /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/;

export const parseFtAmount = (amount: number, ftDecimals = 0) =>
  (amount * 10 ** ftDecimals).toString();

export const formatFtAmount = (amount: string, ftDecimals = 0) =>
  (parseInt(amount) / 10 ** ftDecimals).toString();

export function validateFungibleMetadata(metadata?: Record<string, any>) {
  if (!(metadata && metadata.hasOwnProperty("spec"))) {
    throw new FungibleTokenError("Can't determine contract specification.");
  }

  if (metadata.spec !== "ft-1.0.0") {
    throw new FungibleTokenError(
      `Contract specification should be ft-1.0.0, not ${metadata.spec}.`
    );
  }
}

export function getInfoFromArgs(args: any, meta?: any) {
  const parsedArgs = typeof args === "string" ? JSON.parse(args) : args;
  const parsedMeta = typeof meta === "string" ? JSON.parse(meta) : meta;

  if (parsedArgs.request) {
    return {
      amount: formatNearAmount(parsedArgs.request.amount),
      receiver_id: parsedArgs.request.receiver_account_id,
    };
  }

  return {
    amount: formatFtAmount(parsedArgs.amount, parsedMeta?.decimals),
    receiver_id: parsedArgs.receiver_id,
  };
}

export function getContractIdFromAlias(alias: string) {
  return `${alias}.${DEV3_CONTRACT_ID}`;
}

export function getNearBlocksContractUrl(contractId: string) {
  return `https://${
    IS_TESTNET ? "testnet." : ""
  }nearblocks.io/address/${contractId}`;
}
export function getNearBlockTxnUrl(txHash: string) {
  return `https://${IS_TESTNET ? "testnet." : ""}nearblocks.io/txns/${txHash}`;
}

export function getNearExplorerAccountUrl(accountId: string) {
  return `https://explorer.${
    IS_TESTNET ? "testnet." : ""
  }near.org/accounts/${accountId}`;
}

export function getConnectionConfig(keyStore: KeyStore): ConnectConfig {
  return {
    networkId: NETWORK_ID,
    keyStore,
    nodeUrl: `https://rpc.${NETWORK_ID}.near.org`,
    walletUrl: `https://wallet.${NETWORK_ID}.near.org`,
    helperUrl: `https://helper.${NETWORK_ID}.near.org`,
    headers: {},
  };
}
