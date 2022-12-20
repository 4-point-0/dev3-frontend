/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type PaginatedDto = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  results: any[];
};

export type CreateProjectDto = {
  name: string;
  slug: string;
  logo_id: string;
};

export type User = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  isCensored: boolean;
  isActive: boolean;
  uid: string;
  accountType: string;
  roles: string[];
  username: string;
  nearWalletAccountId: string;
};

export type File = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  name: string;
  mime_type: string;
  url: string;
  key: string;
  owner: User;
};

export type Project = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  name: string;
  slug: string;
  logo: File;
  owner: User;
};

export type ProjectDto = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
};

export type UpdateProjectDto = {
  name?: string;
  slug?: string;
  logo_id?: string;
};

export type NearLoginRequestDto = {
  username: string;
  signedJsonString: string;
};

export type NearLoginResponseDto = {
  token: string;
};

export type CreateApiKeyDto = {
  project_id: string;
  /**
   * @format date-time
   */
  expires: string;
};

export type ApiKeyDto = {};

export type RegenerateApiKeyDto = {
  /**
   * @format date-time
   */
  expires: string;
};

export type RevokeApiKeyDto = {
  is_revoked: boolean;
};

export type ApiKey = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  api_key: string;
  /**
   * @format date-time
   */
  expires: string;
  owner: User;
};

export type CreateAddressDto = {
  wallet: string;
  alias: string;
  email?: string | null;
  phone?: string | null;
};

export type Address = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  wallet: string;
  alias: string;
  phone: string;
  email: string;
  owner: User;
};

export type UpdateAddressDto = {
  email?: string;
  phone?: string;
};

export type CreateTransactionRequestDto = {
  type: "Transaction" | "Payment";
  contractId?: string;
  method: string;
  args?: Record<string, any>;
  gas?: string;
  deposit?: string;
  is_near_token: boolean;
  project_id: string;
};

export type TransactionRequest = {
  /**
   * @format date-time
   */
  updatedAt: string;
  /**
   * @format date-time
   */
  createdAt: string;
  uuid: string;
  type: "Transaction" | "Payment";
  status: "Pending" | "Success" | "Failure";
  contractId?: string;
  method: string;
  args: string;
  gas?: string;
  deposit?: string;
  txHash?: string;
  txDetails?: string;
  caller_address?: string;
  is_near_token?: boolean;
  owner: User;
  project: Project;
};

export type ProjectTransactionRequestDto = {
  name: string;
  logo_url?: string;
};

export type PublicTransactionRequestDto = {
  uuid: string;
  type: "Transaction" | "Payment";
  /**
   * @format date-time
   */
  created_at: string;
  status: "Pending" | "Success" | "Failure";
  contractId?: string;
  method: string;
  args?: Record<string, any>;
  gas?: string;
  deposit?: string;
  caller_address?: string;
  txHash: string;
  txDetails: string;
  is_near_token: boolean;
  project: ProjectTransactionRequestDto;
};

export type UpdateTransactionRequestDto = {
  txHash: string;
  caller_address: string;
  txDetails?: Record<string, any>;
  type?: "Transaction" | "Payment";
};

export type TransactionRequestDto = {
  uuid: string;
  type: "Transaction" | "Payment";
  /**
   * @format date-time
   */
  created_at: string;
  status: "Pending" | "Success" | "Failure";
  contractId?: string;
  method: string;
  args?: Record<string, any>;
  gas?: string;
  deposit?: string;
  caller_address?: string;
  txHash: string;
  txDetails: string;
  is_near_token: boolean;
  project_id: string;
};

export type FileUploadDto = {
  /**
   * @format binary
   */
  file: Blob;
};
