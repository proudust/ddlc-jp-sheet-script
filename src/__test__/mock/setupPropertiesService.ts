declare let global: { PropertiesService: Partial<GoogleAppsScript.Properties.PropertiesService> };

export function setupPropertiesService(properties: object): void {
  global.PropertiesService = {
    getScriptProperties: () =>
      ({
        getProperties: () => properties,
      } as GoogleAppsScript.Properties.Properties),
  };
}
