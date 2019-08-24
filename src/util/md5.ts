export function MD5(string: string): string {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string, Utilities.Charset.UTF_8)
    .slice(0, 4)
    .map(n => (n < 0 ? n + 256 : n))
    .map(n => ('0' + n.toString(16)).slice(-2))
    .join('');
}
