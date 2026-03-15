export type ConfigType = 'THEME' | 'FEATURE_FLAG' | 'API_KEYS';

interface BaseConfig {
  key: string;
  type: ConfigType;
}

export interface ThemeConfig extends BaseConfig {
  type: 'THEME';
  primaryColor: string;
  darkMode: boolean;
}

export interface FeatureConfig extends BaseConfig {
  type: 'FEATURE_FLAG';
  enabledFeatures: string[];
}

export interface ApiKeyConfig extends BaseConfig {
  type: 'API_KEYS';
  serviceName: string;
  expiresAt: Date;
}

export type AppConfig = ThemeConfig | FeatureConfig | ApiKeyConfig;
