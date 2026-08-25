/**
 * Visual Barcode Generation Helpers
 */

export function generateBarcodeLines(code: string): number[] {
  // Deterministic bar widths (1-4px) based on characters of the barcode
  const lines: number[] = [];
  for (let i = 0; i < 38; i++) {
    const charCode = code.charCodeAt(i % code.length) || 48;
    const width = (charCode % 3) + 1;
    lines.push(width);
  }
  return lines;
}
