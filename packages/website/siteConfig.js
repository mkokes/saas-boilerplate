const siteConfig = {
  customDocsPath: 'website/docs',
  title: 'ACME',
  tagline: 'Tagline',
  url: 'https://dcabot.io',
  baseUrl: '/',
  appUrl: process.env.APP_URL,
  docsUrl: '',
  projectName: '',
  headerLinks: [
    { href: `${process.env.APP_URL}/auth/login`, label: 'Sign In' },
    { href: `${process.env.APP_URL}/signup`, label: 'Get Started' },
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
  changelogUrl: 'https://changelog.dcabot.io',
  statusUrl: 'https://status.dcabot.io',
  emailContact: 'info@dcabot.io',
  supportUrl: 'https://support.dcabot.io',
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