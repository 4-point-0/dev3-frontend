import { Badge, Group, Skeleton, Table, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { useWalletSelector } from "../../../context/WalletSelectorContext";
import { useDeployedContractControllerFindOne } from "../../../services/api/dev3Components";
import {
  getMethodsFromSchema,
  getSchemaFromCodeView,
} from "../../../utils/raen";
import { AddressCell } from "../../table/AddressCell";
import { CopyCell } from "../../table/CopyCell";
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
  const router = useRouter();

  const { data, isLoading } = useDeployedContractControllerFindOne({
    pathParams: {
      uuid: router.query.uuid as string,
    },
  });

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
      <Skeleton visible={isLoading}>
        <Table verticalSpacing={20}>
          <tr>
            <Text component="td" fw={700}>
              Name:
            </Text>
            <td>{data?.contract_template?.name}</td>
          </tr>

          <tr>
            <Text component="td" fw={700}>
              Description:
            </Text>
            <td>{data?.contract_template?.description}</td>
          </tr>

          <tr>
            <Text component="td" fw={700}>
              Tags:
            </Text>
            <td>
              <Group>
                {data?.contract_template?.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Group>
            </td>
          </tr>

          <tr>
            <Text component="td" fw={700}>
              Alias:
            </Text>
            <td>
              <CopyCell value={data?.alias || "-"}></CopyCell>
            </td>
          </tr>

          <tr>
            <Text component="td" fw={700}>
              Created At:
            </Text>
            <td>
              {data?.createdAt &&
                new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(data?.createdAt))}
            </td>
          </tr>

          <tr>
            <Text component="td" fw={700}>
              Address:
            </Text>
            <td>{data?.alias && <AddressCell alias={data?.alias} />}</td>
          </tr>
        </Table>
      </Skeleton>

      {/* <ContractMethods contractId={EXAMPLE_CONTRACT} schema={schema} /> */}
    </>
  );
};
