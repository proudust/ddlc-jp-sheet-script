declare let global: { PropertiesService: Partial<GoogleAppsScript.Properties.PropertiesService> };

export default (properties: object): void => {
  global.PropertiesService = {
    getScriptProperties: () =>
      ({
        getProperties: () => properties,
      } as GoogleAppsScript.Properties.Properties),
  };
};
