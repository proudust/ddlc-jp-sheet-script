/**
 * 指定の文字列から MD5 ハッシュを計算し、16進数の頭8文字を返します。
 * @param string ハッシュを計算する文字列
 */
export function MD5(string: string): string {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, string, Utilities.Charset.UTF_8)
    .slice(0, 4)
    .map(n => (n < 0 ? n + 256 : n))
    .map(n => ('0' + n.toString(16)).slice(-2))
    .join('');
}
