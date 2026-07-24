export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText === undefined) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
