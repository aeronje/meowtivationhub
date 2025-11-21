// Ron Penones | November 21st 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const url =
  "https://cdn.jsdelivr.net/gh/mobiledropbox/landing_pages_scripts@main/meowtivationhub/capstone_day8_penones.pdf";

let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pendingPage = null;
const scale = 1.5;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

const textLayerDiv = document.getElementById("textLayer");

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

  pdfDoc
    .getPage(num)
    .then((page) => {
      const viewport = page.getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      textLayerDiv.style.height = viewport.height + "px";
      textLayerDiv.style.width = viewport.width + "px";
      textLayerDiv.innerHTML = ""; // clear previous

      page
        .render({ canvasContext: ctx, viewport })
        .promise.then(() => {
          isRendering = false;
          updateControls();

          if (pendingPage !== null) {
            const next = pendingPage;
            pendingPage = null;
            renderPage(next);
          }
        });

      page.getTextContent().then((textContent) => {
        pdfjsLib.renderTextLayer({
          textContent,
          container: textLayerDiv,
          viewport,
          textDivs: []
        });
      });
    })
    .catch((err) => {
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

pdfjsLib
  .getDocument(url)
  .promise.then((pdf) => {
    pdfDoc = pdf;
    currentPage = 1;
    updateControls();
    renderPage(currentPage);
  })
  .catch((err) => {
    console.error("Failed to load PDF:", err);
    pageInfo.textContent = "Failed to load PDF";
  });

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  queueRenderPage(currentPage);
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= pdfDoc.numPages) return;
  currentPage++;
  queueRenderPage(currentPage);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevBtn.click();
  if (e.key === "ArrowRight") nextBtn.click();
});
