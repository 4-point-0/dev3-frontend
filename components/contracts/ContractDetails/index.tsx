import React, { useEffect, useRef, useState } from "react";

import { useWalletSelector } from "../../../context/WalletSelectorContext";
import {
  getMethodsFromSchema,
  getSchemaFromCodeView,
} from "../../../utils/raen";
import { ContractMethods } from "../ContractMethods";

const EXAMPLE_CONTRACT = "advanced.statusmessage.raendev.testnet";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    AccountId: {
      maxLength: 64,
      minLength: 2,
      pattern: "^(([a-z\\d]+[-_])*[a-z\\d]+\\.)*([a-z\\d]+[-_])*[a-z\\d]+$",
      type: "string",
    },
    Balance: {
      $ref: "#/definitions/U128",
      description:
        "Balance is a type for storing amounts of tokens, specified in yoctoNEAR.",
    },
    CallOptions: {
      additionalProperties: false,
      properties: {
        attachedDeposit: {
          $ref: "#/definitions/Balance",
          default: "0",
          description: "Units in yoctoNear",
        },
        gas: {
          default: "30000000000000",
          description: "Units in gas",
          pattern: "[0-9]+",
          type: "string",
        },
      },
      type: "object",
    },
    GetStatus: {
      additionalProperties: false,
      contractMethod: "view",
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            account_id: {
              $ref: "#/definitions/AccountId",
            },
          },
          required: ["account_id"],
          type: "object",
        },
      },
      required: ["args"],
      type: "object",
    },
    GetStatus__Result: {
      anyOf: [
        {
          $ref: "#/definitions/Message",
        },
        {
          type: "null",
        },
      ],
    },
    Message: {
      additionalProperties: false,
      description: "A simple message with a title",
      properties: {
        body: {
          description: "body of the  message",
          type: "string",
        },
        title: {
          description: "Title that describes the message",
          type: "string",
        },
      },
      required: ["title", "body"],
      type: "object",
    },
    SetStatus: {
      additionalProperties: false,
      contractMethod: "change",
      properties: {
        args: {
          additionalProperties: false,
          properties: {
            message: {
              $ref: "#/definitions/Message",
            },
          },
          required: ["message"],
          type: "object",
        },
        options: {
          $ref: "#/definitions/CallOptions",
        },
      },
      required: ["args", "options"],
      type: "object",
    },
    SetStatus__Result: {
      type: "null",
    },
    U128: {
      description: "String representation of a u128-bit integer",
      pattern: "^[0-9]+$",
      type: "string",
    },
  },
};

export const ContractDetails = () => {
  const { getViewCode } = useWalletSelector();
  const schemaRef = useRef<string>();

  // useEffect(() => {
  //   const work = async () => {
  //     const code = await getViewCode(EXAMPLE_CONTRACT);

  //     if (code && !schemaRef.current) {
  //       schemaRef.current = await getSchemaFromCodeView(code);

  //       console.log(JSON.parse(schemaRef.current));
  //     }
  //   };

  //   work();
  // }, [getViewCode]);e

  console.log(getMethodsFromSchema(schema));

  return (
    <>
      <ContractMethods contractId={EXAMPLE_CONTRACT} schema={schema} />
    </>
  );
};
