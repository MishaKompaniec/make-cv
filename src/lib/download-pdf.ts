type DownloadPdfOptions = {
  cvId: string;
  fileName: string;
  triggerPaywall: () => void;
};

export async function downloadPdf({
  cvId,
  fileName,
  triggerPaywall,
}: DownloadPdfOptions) {
  const res = await fetch(`/api/export/pdf?cvId=${encodeURIComponent(cvId)}`);

  if (res.status === 401 || res.status === 402) {
    triggerPaywall();
    return;
  }

  if (!res.ok || res.headers.get("Content-Type") !== "application/pdf") {
    console.error("PDF export failed", {
      status: res.status,
      contentType: res.headers.get("Content-Type"),
    });
    return;
  }

  const pdfBlob = await res.blob();

  if (!pdfBlob.size) {
    console.error("PDF export returned empty blob", {
      status: res.status,
      contentType: res.headers.get("Content-Type"),
    });
    return;
  }

  const objectUrl = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
