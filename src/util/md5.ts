const md5 = (string: string): string =>
  Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string)
    .slice(0, 8)
    .map(n => n.toString(16))
    .join('');

export default md5;
