// Ron Penones | November 21st 2025 - Feel free to share and reproduce, the core idea is mine with some assistance of AI. Padayon!

const url = "https://cdn.jsdelivr.net/gh/mobiledropbox/landing_pages_scripts@main/meowtivationhub/capstone_day8_penones.pdf"; // Dito po kinukuha ang pdf.

let pdfDoc = null;
let currentPage = 1;
let isRendering = false;
let pendingPage = null;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

pdfjsLib.getDocument(url).promise.then((pdf) => {
pdfDoc = pdf;
renderPage(currentPage);
});

function renderPage(num) {
isRendering = true;

pdfDoc.getPage(num).then((page) => {
const viewport = page.getViewport({ scale: 1.5 });
canvas.height = viewport.height;
canvas.width = viewport.width;

const renderContext = {
canvasContext: ctx,
viewport: viewport,
};

page.render(renderContext).promise.then(() => {
isRendering = false;
document.getElementById("pageInfo").textContent = `Page ${currentPage}`;

if (pendingPage !== null) {
renderPage(pendingPage);
pendingPage = null;
}
});
});
}

function queueRenderPage(num) {
if (isRendering) {
pendingPage = num;
} else {
renderPage(num);
}
}

document.getElementById("prevPage").addEventListener("click", () => {
if (currentPage <= 1) return;
currentPage--;
queueRenderPage(currentPage);
});

document.getElementById("nextPage").addEventListener("click", () => {
if (!pdfDoc || currentPage >= pdfDoc.numPages) return;
currentPage++;
queueRenderPage(currentPage);
});
