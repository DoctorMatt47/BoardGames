export function wordHyphenation(word: string): string {
  if (word.length <= 8) {
    return word;
  }

  return word.replace(/(.{7})/g, "$1-");
}
