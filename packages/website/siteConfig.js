const siteConfig = {
  customDocsPath: 'website/docs',
  title: 'Brand name',
  tagline: 'Tagline',
  url: 'https://domain.io',
  baseUrl: '/',
  appUrl: process.env.APP_URL,
  docsUrl: '',
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
  linkedinUrl: '',
  changelogUrl: 'https://changelog.domain.io',
  statusUrl: 'https://status.domain.io',
  emailContact: 'admin@domain.io',
  supportUrl: 'https://support.domain.io',
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
