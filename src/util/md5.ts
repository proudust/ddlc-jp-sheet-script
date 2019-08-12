import Crypto from 'crypto';

const md5 = {
  node: (string: string): string =>
    Crypto.createHash('md5')
      .update(string)
      .digest('hex')
      .slice(0, 8),
  gas: (string: string): string =>
    Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string)
      .map(n => n.toString(16))
      .join(),
};

export default (mode: keyof (typeof md5)): ((string: string) => string) => md5[mode];
