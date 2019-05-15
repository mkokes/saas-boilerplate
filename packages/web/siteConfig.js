const { WEB_URL, APP_URL } = process.env;

const siteConfig = {
  customDocsPath: "web/docs",
  title: "ACME",
  tagline: "Tagline",
  url: WEB_URL,
  baseUrl: "/",
  appUrl: APP_URL,
  docsUrl: "",
  gaTrackingId: "",
  projectName: "",
  headerLinks: [
    { href: `${APP_URL}/auth/login`, label: "Log in" },
    { href: `${APP_URL}/signup`, label: "Get started" },
    { href: `${APP_URL}/pricing`, label: "Pricing" },
    { blog: true, label: "Blog" }
  ],
  headerIcon: "img/logo.png",
  footerIcon: "img/logo.png",
  favicon: "img/logo.png",
  colors: {
    primaryColor: "#764ABC",
    secondaryColor: "#40216F",
    thirdColor: "#6f2dd9",
    accentColor: "#717171"
  },
  copyright: `Copyright © ${new Date().getFullYear()} Brand name.`,
  highlight: {
    theme: "atom-one-dark"
  },
  scripts: [],
  onPageNav: "separate",
  cleanUrl: true,
  ogImage: "img/docusaurus.png",
  twitter: true,
  twitterImage: "img/docusaurus.png",
  twitterUsername: "@demo",
  changelogUrl: "https://changelog.domain.io",
  statusUrl: "https://status.domain.io",
  emailContact: "info@domain.io",
  supportUrl: `${APP_URL}/support`,
  users: [
    {
      caption: "Coinbase",
      image: "/img/homepage/users/coinbase.png",
      infoLink: "https://www.coinbase.com",
      pinned: true
    },
    {
      caption: "Binance",
      image: "/img/homepage/users/binance.svg",
      infoLink: "https://www.binance.com",
      pinned: true
    },
    {
      caption: "Bitfinex",
      image: "/img/homepage/users/bitfinex.png",
      infoLink: "https://www.bitfinex.com",
      pinned: true
    }
  ],
  scrollToTop: true
};

module.exports = siteConfig;
