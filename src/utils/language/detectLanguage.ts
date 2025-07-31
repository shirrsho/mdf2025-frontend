export function isBangla(text: string | undefined) {
  // Bengali Unicode block: U+0980–U+09FF
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text ?? 'A');
}
