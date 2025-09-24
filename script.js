const scene = document.getElementById("scene");
const eras = document.querySelectorAll(".era");
const backgrounds = document.querySelectorAll("#backgrounds .bg");

let scrollPos = 0;
let targetPos = 0;
const spacing = 2000;
const maxIndex = eras.length - 1;

// Position eras
eras.forEach((era, i) => {
  const z = i * -spacing;
  era.dataset.z = z;
  era.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
});

// Animation
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

    era.style.opacity = dist < spacing * 0.7 ? "1" : "0";
    era.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
  });

  // update active era
  eras.forEach((era, i) => {
    era.classList.toggle("active", i === nearest);
  });

  // update active background
  const activeEra = eras[nearest].classList.contains("triassic")
    ? "triassic"
    : eras[nearest].classList.contains("jurassic")
    ? "jurassic"
    : "cretaceous";

  backgrounds.forEach((bg) => {
    bg.classList.toggle("active", bg.classList.contains(activeEra));
  });

  requestAnimationFrame(animate);
}
animate();

// Scroll
let wheelTimeout;
window.addEventListener("wheel", (e) => {
  if (wheelTimeout) return;
  wheelTimeout = setTimeout(() => {
    targetPos += e.deltaY * 1;
    targetPos = Math.max(0, Math.min(targetPos, maxIndex * spacing));
    wheelTimeout = null;
  }, 60);
});

// Touch
let touchStartY = null;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchmove", (e) => {
  if (touchStartY === null) return;
  let deltaY = touchStartY - e.touches[0].clientY;
  targetPos += deltaY * 3;
  targetPos = Math.max(0, Math.min(targetPos, maxIndex * spacing));
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", () => {
  touchStartY = null;
});
