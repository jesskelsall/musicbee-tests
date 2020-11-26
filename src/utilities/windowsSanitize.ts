const disallowedChars = /[\\\/:*\?"<>]/g;
const trailingPeriod = /\.$/;

export function windowsSanitize(text: string): string {
  return text.replace(disallowedChars, " ");
}

export function directorySanitize(text: string): string {
  return windowsSanitize(text).replace(trailingPeriod, "").trim();
}
