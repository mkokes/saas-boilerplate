const { APP_URL } = process.env;

const siteConfig = {
  customDocsPath: 'web/docs',
  title: 'ACME',
  tagline: 'Tagline',
  url: 'https://domain.io',
  baseUrl: '/',
  appUrl: APP_URL,
  docsUrl: '',
  gaTrackingId: '',
  projectName: '',
  headerLinks: [
    { href: `${APP_URL}/auth/login`, label: 'Log in' },
    { href: `${APP_URL}/signup`, label: 'Get started' },
    { blog: true, label: 'Blog' },
  ],
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/logo.png',
  colors: {
    primaryColor: '#764ABC',
    secondaryColor: '#40216F',
    accentColor: '#717171',
  },
  copyright: `Copyright © ${new Date().getFullYear()} Brand name`,
  highlight: {
    theme: 'default',
  },
  scripts: [],
  onPageNav: 'separate',
  cleanUrl: true,
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',
  twitterUsername: '',
  linkedinUrl: 'https://www.linkedin.com',
  changelogUrl: 'https://changelog.domain.io',
  statusUrl: 'https://status.domain.io',
  emailContact: 'info@domain.io',
  supportUrl: `${APP_URL}/support`,
  users: [
    {
      caption: 'Coinbase',
      image: '/img/homepage/users/coinbase.png',
      infoLink: 'https://www.coinbase.com',
      pinned: true,
    },
    {
      caption: 'Binance',
      image: '/img/homepage/users/binance.svg',
      infoLink: 'https://www.binance.com',
      pinned: true,
    },
    {
      caption: 'Bitfinex',
      image: '/img/homepage/users/bitfinex.png',
      infoLink: 'https://www.bitfinex.com',
      pinned: true,
    },
  ],
};

module.exports = siteConfig;
