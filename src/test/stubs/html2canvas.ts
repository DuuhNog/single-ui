/** Stub for html2canvas — used only in tests to avoid missing-package errors */
const html2canvas = async (_el: unknown): Promise<{ toDataURL: () => string }> => ({
  toDataURL: () => 'data:image/png;base64,stub',
});

export default html2canvas;
