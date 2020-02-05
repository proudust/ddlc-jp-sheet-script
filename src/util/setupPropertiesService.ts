declare let global: { PropertiesService: Partial<GoogleAppsScript.Properties.PropertiesService> };

export function setupPropertiesService(props: object): void {
  global.PropertiesService = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.PropertiesService.getScriptProperties = () => ({ getProperties: () => props } as any);
}
