export const THIRTY_TGAS = "30000000000000" as const;
export const NO_DEPOSIT = "0";

// TODO: use env
export const NEAR_CONTRACT_ID = "dev-1668975558141-76613200431681";

export class FungibleTokenError extends Error {}

export class ReceiverError extends Error {}

export const nearWalletRegex =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

// /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/;

export const parseFtAmount = (amount: number, ftDecimals = 0) =>
  (amount * 10 ** ftDecimals).toString();

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
