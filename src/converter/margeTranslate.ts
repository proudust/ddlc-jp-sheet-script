import Translate from '../transrate/translate';

function firstAtIndex<T>(array: T[], callbackfn: (item: T) => boolean): number | null {
  for (let i = 0; i < array.length; i++) if (callbackfn(array[i])) return i;
  return null;
}

export default {
  marge: (befores: Translate[], afters: Translate[]): Translate[] => {
    return afters.map(after => {
      const matchIndex = firstAtIndex(befores, before => before.original == after.original);
      return matchIndex ? after.marge(befores.splice(matchIndex, 1)[0]) : after;
    });
  },
};
