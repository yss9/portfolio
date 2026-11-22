/** Only these binary image formats can be promoted from the private inbox. */
export function imageExtension(bytes: Uint8Array) {
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b))
    return "png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpg";
  return null;
}
export const maxImageBytes = 2 * 1024 * 1024;
