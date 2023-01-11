import { formatNearAmount } from "near-api-js/lib/utils/format";

export const THIRTY_TGAS = "30000000000000" as const;
export const NO_DEPOSIT = "0";

export const NEAR_CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;

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
  if (args.request) {
    return {
      amount: formatNearAmount(args.request.amount),
      receiver_id: args.request.receiver_account_id,
    };
  }

  return {
    amount: formatFtAmount(args.amount, meta?.decimals),
    receiver_id: args.receiver_id,
  };
}
