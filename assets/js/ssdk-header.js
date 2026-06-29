// SSDK Legacy Header Shim
// This file connects old static HTML tools into the modern Bootstrap architecture dynamically.

const isSub = window.location.pathname.includes("/pages/") || window.location.pathname.includes("/tools/") || window.location.pathname.includes("/categories/");
const prefix = isSub ? ".." : ".";

// Prevent multiple boot injections if somehow loaded twice
if (!document.getElementById("ssdk-bootloader")) {
  const bootScript = document.createElement('script');
  bootScript.id = "ssdk-bootloader";
  bootScript.type = 'module';
  bootScript.src = `${prefix}/core/bootstrap.js`;
  document.head.appendChild(bootScript);
}