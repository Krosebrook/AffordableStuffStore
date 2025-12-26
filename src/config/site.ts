export type SiteConfig = typeof siteConfig;
import i18next from "../i18n";

export const siteConfig = () => ({
  needCookieConsent: true,
  name: "FlashFusion",
  description:
    "AI-Powered Creative Mega App - Production-grade SaaS platform for content generation and campaign management",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Prompt Builder",
      href: "/prompt-builder",
    },
    {
      label: "Content Studio",
      href: "/content-studio",
    },
    {
      label: "Campaigns",
      href: "/campaigns",
    },
    {
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      label: "Prompts",
      href: "/prompts",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Prompt Builder",
      href: "/prompt-builder",
    },
    {
      label: "Content Studio",
      href: "/content-studio",
    },
    {
      label: "Campaigns",
      href: "/campaigns",
    },
    {
      label: "Marketplace",
      href: "/marketplace",
    },
    {
      label: "Prompts",
      href: "/prompts",
    },
    {
      label: i18next.t("settings"),
      href: "/settings",
    },
    {
      label: i18next.t("help-and-feedback"),
      href: "/help-feedback",
    },
    {
      label: i18next.t("logout"),
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/Krosebrook/AffordableStuffStore",
    twitter: "https://twitter.com/flashfusion",
    docs: "/docs",
    discord: "https://discord.gg/flashfusion",
    sponsor: "https://github.com/sponsors/flashfusion",
  },
});
