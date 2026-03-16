import { getDb, closeDb } from '../../../../db.js';
import type { AppConfig } from './type.js';

async function main() {
  const db = await getDb('config_db');
  const configCol = db.collection<AppConfig>('app_config');

  const configs: AppConfig[] = [
    {
      key: 'ui_theme',
      type: 'THEME',
      primaryColor: '#ff0000',
      darkMode: true,
    },
    {
      key: 'new_checkout',
      type: 'FEATURE_FLAG',
      enabledFeatures: ['one-click-pay', 'crypto'],
    },
    {
      key: 'stripe_prod',
      type: 'API_KEYS',
      serviceName: 'Stripe',
      expiresAt: new Date('2027-01-01'),
    },
    {
      key: 'admin_theme',
      type: 'THEME',
      primaryColor: '#000000',
      darkMode: false,
    },
    {
      key: 'beta_testing',
      type: 'FEATURE_FLAG',
      enabledFeatures: ['ai-chat', 'live-reporting'],
    },
  ];

  try {
    await configCol.deleteMany({});
    await configCol.insertMany(configs);
    console.log('Configs inserted successfully!');

    const allConfigs = await configCol.find().toArray();

    allConfigs.forEach((conf) => {
      console.log(`\nProcessing key: ${conf.key}`);

      switch (conf.type) {
        case 'THEME':
          console.log(`Theme Config: Color is ${conf.primaryColor}`);
          break;
        case 'FEATURE_FLAG':
          console.log(`Feature Flag: ${conf.enabledFeatures.join(', ')}`);
          break;
        case 'API_KEYS':
          console.log(
            `API Key for ${conf.serviceName}, expires on ${conf.expiresAt.toDateString()}`
          );
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    closeDb();
  }
}

main();
