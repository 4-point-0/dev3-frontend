import { utils } from "near-api-js";

export const nearWalletRegex =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

// /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/;

export const parseFtAmount = (amount: number, ftDecimals = 0) =>
  (amount * 10 ** ftDecimals).toString();

export const THIRTY_TGAS = "30000000000000" as const;
export const NO_DEPOSIT = "0";

// TODO: use env
export const NEAR_CONTRACT_ID = "dev-1668975558141-76613200431681";
