function resolveTenplate(literals: TemplateStringsArray, ...placeholders: string[]): string {
  return literals.reduce((str, literal) => (str += literal + (placeholders.shift() ?? '')), '');
}

export function trimMargin(string: string, marginPrefix?: string): string;
export function trimMargin(literals: TemplateStringsArray, ...placeholders: string[]): string;
export function trimMargin(
  arg1: string | TemplateStringsArray,
  arg2 = '',
  ...args: string[]
): string {
  const string = typeof arg1 === 'string' ? arg1 : resolveTenplate(arg1, arg2, ...args);
  const strings = string.split('\n');
  if (!strings?.[0].trim()) strings.shift();
  if (!strings?.[strings.length - 1].trim()) strings.pop();
  const marginPrefix = (typeof arg1 === 'string' && arg2) || '|';
  const regexp = marginPrefix === '|' ? /^\s*\|/ : new RegExp(`^\\s*${arg2}`);
  return strings.map(s => s.replace(regexp, '')).join('\n');
}

export function trimIndent(string: string): string;
export function trimIndent(literals: TemplateStringsArray, ...placeholders: string[]): string;
export function trimIndent(arg1: string | TemplateStringsArray, ...args: string[]): string {
  const string = typeof arg1 === 'string' ? arg1 : resolveTenplate(arg1, ...args);
  const strings = string.split('\n');
  if (!strings?.[0].trim()) strings.shift();
  if (!strings?.[strings.length - 1].trim()) strings.pop();
  const indent = Math.min(
    ...strings.filter(s => s.trim()).map(s => /^\s+/.exec(s)?.[0].length ?? 0),
  );
  return strings.map(s => s.slice(indent)).join('\n');
}
