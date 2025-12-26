export type SiteConfig = typeof siteConfig;
import i18next from "../i18n";

export const siteConfig = () => ({
  needCookieConsent: true,
  name: "FlashFusion",
  description:
    "AI-powered SaaS for content generation, campaign management, and multi-channel publishing",
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
      label: i18next.t("marketplace"),
      href: "/marketplace",
    },
    {
      label: i18next.t("prompt-builder"),
      href: "/prompt-builder",
    },
    {
      label: i18next.t("pricing"),
      href: "/pricing",
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
      label: i18next.t("flashfusion"),
      href: "/flashfusion",
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
      label: i18next.t("monitoring"),
      href: "/monitoring",
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
