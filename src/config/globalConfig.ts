import { env } from 'common/env';
import { localStorage } from 'common/storage';
import { configOverridesLocalStorageKey } from './constants';
import { ConfigKey, GlobalConfig } from './types';

type ConfigMap = Map<ConfigKey, any>;

function serializeOverrides(overrides: ConfigMap) {
    try {
        localStorage.setItem(
            configOverridesLocalStorageKey,
            JSON.stringify(Array.from(overrides.entries()))
        );
    } catch (e) {
        console.error('Failed to serialize config overrides:\n ${e}');
    }
}

function readOverrides(): ConfigMap {
    try {
        const value = JSON.parse(
            localStorage.getItem(configOverridesLocalStorageKey) || ''
        );
        return Array.isArray(value) ? new Map(value) : new Map();
    } catch (e) {
        return new Map();
    }
}

const configOverrides: ConfigMap = readOverrides();
const configValues: ConfigMap = new Map([['adminApiUrl', env.ADMIN_API_URL]]);

function clearAllOverrides() {
    configOverrides.clear();
    localStorage.removeItem(configOverridesLocalStorageKey);
}

function clearOverride(key: ConfigKey) {
    configOverrides.delete(key);
    serializeOverrides(configOverrides);
}

function getValue<T>(key: ConfigKey): T | undefined {
    if (configOverrides.has(key)) {
        return configOverrides.get(key);
    }

    if (configValues.has(key)) {
        return configValues.get(key);
    }

    return undefined;
}

function setOverride(key: ConfigKey, value: any) {
    configOverrides.set(key, value);
    serializeOverrides(configOverrides);
}

export const globalConfig: GlobalConfig = {
    clearAllOverrides,
    clearOverride,
    getValue,
    setOverride
};

// export to global so overrides can be set via the console
window.config = globalConfig;
