const trialPeriodStartedAt = new Date();
const trialPeriodEndsAt = new Date();
trialPeriodEndsAt.setDate(trialPeriodEndsAt.getDate() + 7);

module.exports = [
  {
    _subscription: null,
    passwordUpdatedAt: new Date(),
    isTwoFactorAuthenticationEnabled: false,
    twoFactorAuthenticationSecret: null,
    isSignUpEmailConfirmed: true,
    emailConfirmedAt: new Date(),
    accountStatus: 'active',
    isInTrialPeriod: true,
    trialExpiringNotified: false,
    timezone: 'Europe/Madrid',
    roles: [],
    legal: [
      {
        type: 'TERMS_AND_CONDITIONS',
        accepted: '1553730504760',
      },
      {
        type: 'PRIVACY_POLICY',
        accepted: '1553730504760',
      },
      {
        type: 'MARKETING_INFO',
        accepted: '1553730504760',
      },
    ],
    apiKeyStatus: 'active',
    signupSource: null,
    signupCountry: null,
    signupCity: null,
    signupIP: null,
    email: 'me@alfon.io',
    password: '$2a$10$V5Cd0AUc6Fb.SyRjytLSs.yY2.zPFN9yn838AfraNJ25DXRMI2ExO', // foo
    firstName: 'Alfonso Manuel',
    lastName: 'García Astorga',
    nickname: 'AMGA',
    emailConfirmationToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic2lnbnVwIiwiaWF0IjoxNTUzNzMwNTIzfQ.6UWwmklRdLrO_692O_yLaJpWyzhnxNVGHMlX1et64ro',
    trialPeriodEndsAt,
    trialDaysLength: 7,
    avatar:
      'PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjgnIGhlaWdodD0nMTI4JyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgxNzMsMzgsMjE3LDEpOyBzdHJva2U6cmdiYSgxNzMsMzgsMjE3LDEpOyBzdHJva2Utd2lkdGg6MC42NDsnPjxyZWN0ICB4PSc1NicgeT0nMjYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc1NicgeT0nNTYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc0MScgeT0nNTYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc3MScgeT0nNTYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc0MScgeT0nNzEnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc3MScgeT0nNzEnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PScyNicgeT0nNTYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc4NicgeT0nNTYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PScyNicgeT0nNzEnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc4NicgeT0nNzEnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PScyNicgeT0nODYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjxyZWN0ICB4PSc4NicgeT0nODYnIHdpZHRoPScxNScgaGVpZ2h0PScxNScvPjwvZz48L3N2Zz4=',
    trialPeriodStartedAt,
    lastLoginAt: new Date(),
    signupAt: new Date(),
    _shortId: 'H1ZBY',
    apiKey: '48423d8a-4bdd-409a-8e55-1f60db4351ac',
  },
];
