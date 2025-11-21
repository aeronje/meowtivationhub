// Ron Penones | November 21st 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const url = "https://cdn.jsdelivr.net/gh/mobiledropbox/landing_pages_scripts@main/meowtivationhub/capstone_day8_penones.pdf";

let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pendingPage = null;
const scale = 1.5; // tweak if needed

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

function updateControls() {
  if (!pdfDoc) {
    pageInfo.textContent = "Loading...";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }
  pageInfo.textContent = `Page ${currentPage} / ${pdfDoc.numPages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= pdfDoc.numPages;
}

function renderPage(num) {
  isRendering = true;
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    const renderTask = page.render(renderContext);
    renderTask.promise.then(() => {
      isRendering = false;
      updateControls();
      if (pendingPage !== null) {
        const next = pendingPage;
        pendingPage = null;
        renderPage(next);
      }
    }).catch((err) => {
      console.error("Render error:", err);
      isRendering = false;
    });
  }).catch((err) => {
    console.error("getPage error:", err);
    isRendering = false;
  });
}

function queueRenderPage(num) {
  if (isRendering) {
    pendingPage = num;
  } else {
    renderPage(num);
  }
}

pdfjsLib.getDocument(url).promise.then((pdf) => {
  pdfDoc = pdf;
  currentPage = 1;
  updateControls();
  renderPage(currentPage);
}).catch((err) => {
  console.error("Failed to load PDF:", err);

  console.warn("Check: URL correctness, CORS headers, and Content-Type: application/pdf");
  pageInfo.textContent = "Failed to load PDF (see console)";
});

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  queueRenderPage(currentPage);
});

nextBtn.addEventListener("click", () => {
  if (!pdfDoc || currentPage >= pdfDoc.numPages) return;
  currentPage++;
  queueRenderPage(currentPage);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});
