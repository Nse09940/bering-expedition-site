import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Bering Expedition Docs",
  tagline: "Техническая документация проекта об экспедициях Витуса Беринга",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://history.dymnikov.tech",
  baseUrl: "/docs/",
  organizationName: "miald",
  projectName: "bering-expedition-site",

  onBrokenLinks: "throw",
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Bering Docs",
      logo: {
        alt: "Bering Docs Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Документация",
        },
        {
          href: "https://history.dymnikov.tech",
          label: "Сайт",
          position: "right",
        },
        {
          href: "https://history.dymnikov.tech/api/docs",
          label: "API",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Введение",
              to: "/intro",
            },
            {
              label: "Архитектура",
              to: "/architecture",
            },
          ],
        },
        {
          title: "Проект",
          items: [
            {
              label: "Публичный сайт",
              href: "https://history.dymnikov.tech",
            },
            {
              label: "FastAPI docs",
              href: "https://history.dymnikov.tech/api/docs",
            },
          ],
        },
        {
          title: "Разделы",
          items: [
            {
              label: "Контентная модель",
              to: "/content-model",
            },
            {
              label: "Правила контента",
              to: "/content-guidelines",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bering Expedition Site. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
