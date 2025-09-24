const scene = document.getElementById("scene");
const eras = document.querySelectorAll(".era");

let scrollPos = 0;
let targetPos = 0;
const spacing = 1800; // increased gap
const maxIndex = eras.length - 1;

// Position each era
eras.forEach((era, i) => {
  const z = i * -spacing;
  era.dataset.z = z;
  era.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
});

// Animate camera
function animate() {
  scrollPos += (targetPos - scrollPos) * 0.08;
  scene.style.transform = `translateZ(${scrollPos}px)`;

  let nearest = 0;
  let minDist = Infinity;

  eras.forEach((era, i) => {
    const z = parseFloat(era.dataset.z);
    const dist = Math.abs(scrollPos + z);

    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }

    const scale = 1 - dist / (spacing * 3);
    era.style.opacity = dist < spacing * 1.5 ? "1" : "0";
    era.style.transform = `translate(-50%, -50%) translateZ(${z}px) scale(${Math.max(
      0.7,
      scale
    )})`;
  });

  eras.forEach((era, i) => {
    era.classList.toggle("active", i === nearest);
  });

  requestAnimationFrame(animate);
}
animate();

// Desktop scroll
let wheelTimeout;
window.addEventListener("wheel", (e) => {
  if (wheelTimeout) return;
  wheelTimeout = setTimeout(() => {
    targetPos += e.deltaY * 0.8;
    targetPos = Math.max(0, Math.min(targetPos, maxIndex * spacing));
    wheelTimeout = null;
  }, 50);
});

// Mobile drag
let touchStartY = null;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
  if (touchStartY === null) return;
  let deltaY = touchStartY - e.touches[0].clientY;
  targetPos += deltaY * 2;
  targetPos = Math.max(0, Math.min(targetPos, maxIndex * spacing));
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", () => {
  touchStartY = null;
});

// Toggle info on click
eras.forEach((era) => {
  const info = era.querySelector(".info");
  if (info) {
    era.addEventListener("click", () => {
      info.classList.toggle("show");
    });
  }
});
