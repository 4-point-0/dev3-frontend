import { Box, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  ArrowsLeftRight,
  Book,
  Parachute,
  Settings,
  ThreeDCubeSphere,
} from "tabler-icons-react";

const topSectionData = [
  {
    icon: <ThreeDCubeSphere size={24} />,
    label: "Contracts",
    href: "/contracts",
  },
  {
    icon: <Parachute size={24} />,
    label: "Airdrops",
    href: "/airdrops",
  },
  {
    icon: <ArrowsLeftRight size={24} />,
    label: "Payment Requests",
    href: "/payments",
  },
  {
    icon: <Book size={24} />,
    label: "Address Book",
    href: "/address-book",
  },
];

const bottomSectionData = [
  {
    icon: <Settings size={24} />,
    label: "Settings",
    href: "/settings",
  },
];

export interface MainLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  disabled: boolean;
}

export function AppLink({ icon, label, href, disabled }: MainLinkProps) {
  const router = useRouter();

  return (
    <Box mb={8}>
      <Link href={href} passHref>
        <NavLink
          disabled={disabled}
          label={label}
          sx={(theme) => ({
            // padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
          })}
          active={router.pathname === href}
          icon={icon}
        />
      </Link>
    </Box>
  );
}

export interface LinksProps {
  disabled: boolean;
}

export function AppLinks({ disabled }: LinksProps) {
  const links = topSectionData.map((link) => (
    <AppLink {...link} key={link.label} disabled={disabled} />
  ));
  return <div>{links}</div>;
}

export function AppLinksBottom({ disabled }: LinksProps) {
  const links = bottomSectionData.map((link) => (
    <AppLink {...link} disabled={disabled} key={link.label} />
  ));
  return <div>{links}</div>;
}
