module.exports = {
  name: 'FaaS Blocks',
  features: [
    {
      name: '@faas',
      path: [
        '/test/features/blocks/how-to-choose-a-future-proof-cdp',
        '/test/features/blocks/omnichannel-orchestration-with-adobe-marketo-engage-and-adobe-experience-cloud',
      ],
      envs: '@bacom',
      tags: '@faas-form',
    },
    {
      name: '@faas',
      path: [
        '/test/features/blocks/faas-rfi',
        '/test/features/blocks/faas-do',
      ],
      envs: '@milo_prod',
      tags: '@faas-form',
    },
  ],
};
