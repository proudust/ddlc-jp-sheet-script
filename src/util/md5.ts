const md5 = (string: string): string =>
  Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string)
    .slice(0, 4)
    .map(n => ('0' + n.toString(16)).slice(-2))
    .join('');

export default md5;
