import Crypto from 'crypto';

declare let global: { Utilities: Partial<GoogleAppsScript.Utilities.Utilities> };

export default (): void => {
  global.Utilities = {
    computeDigest: (
      algorithm: GoogleAppsScript.Utilities.DigestAlgorithm,
      value: number[] | string,
    ): number[] => {
      if (value instanceof Array) throw Error('not supported');
      return (
        Crypto.createHash('md5')
          .update(value)
          .digest('hex')
          .match(/.{2}/g) || []
      ).map(c => parseInt(c, 16));
    },
    Charset: { US_ASCII: 0, UTF_8: 0 },
    DigestAlgorithm: { MD2: 0, MD5: 0, SHA_1: 0, SHA_256: 0, SHA_384: 0, SHA_512: 0 },
  };
};
