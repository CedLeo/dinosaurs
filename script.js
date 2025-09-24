// script.js
const scene = document.getElementById("scene");
const eras = Array.from(document.querySelectorAll(".era"));
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalPeriod = document.getElementById("modal-period");
const modalEvo = document.getElementById("modal-evo");
const modalFact = document.getElementById("modal-fact");
const modalClose = document.getElementById("modal-close");

let scrollPos = 0;
let targetPos = 0;
const spacing = 1200; // distance between layers
const maxIndex = Math.max(0, eras.length - 1);

// Position each era along the z axis
eras.forEach((era, i) => {
  const z = i * -spacing;
  era.dataset.z = z;
  era.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
  // add tabindex for keyboard accessibility
  era.setAttribute("tabindex", "0");
});

// Smooth camera animation loop
function animate() {
  scrollPos += (targetPos - scrollPos) * 0.08;
  scene.style.transform = `translateZ(${scrollPos}px)`;

  // update which era is active (closest to camera center)
  eras.forEach((era, idx) => {
    const z = parseFloat(era.dataset.z);
    const distance = Math.abs(scrollPos + z);
    if (distance < spacing / 2) {
      era.classList.add("active");
      era.setAttribute("aria-current", "true");
    } else {
      era.classList.remove("active");
      era.removeAttribute("aria-current");
    }
  });

  requestAnimationFrame(animate);
}
animate();

// Wheel navigation (smooth)
window.addEventListener("wheel", (e) => {
  // adjust scroll sensitivity
  targetPos += e.deltaY * 0.6;
  targetPos = Math.max(0, Math.min(targetPos, maxIndex * spacing));
});

// Arrow keys navigation
window.addEventListener("keydown", (e) => {
  if (modal.getAttribute("aria-hidden") === "false") {
    // close modal on Escape
    if (e.key === "Escape") closeModal();
    return;
  }
  if (e.key === "ArrowDown") {
    targetPos = Math.min(targetPos + spacing, maxIndex * spacing);
    focusNearest();
  }
  if (e.key === "ArrowUp") {
    targetPos = Math.max(targetPos - spacing, 0);
    focusNearest();
  }
  if (e.key === "Enter") {
    // When Enter pressed, open modal for the focused element (if any)
    const active = document.activeElement;
    if (active && active.classList.contains("era")) {
      openModalFor(active);
    }
  }
});

// Click / touch to open modal
eras.forEach((era) => {
  era.addEventListener("click", () => openModalFor(era));
  era.addEventListener("keypress", (e) => {
    if (e.key === "Enter") openModalFor(era);
  });
});

function openModalFor(era) {
  const name = era.dataset.dino || era.dataset.era || "Dinosaur";
  const period = era.dataset.period || era.dataset.era || "";
  const evo = era.dataset.evolution || "Evolution details not available.";
  const fact = era.dataset.fact || "No fun fact available.";

  modalTitle.textContent = name;
  modalPeriod.textContent = period;
  modalEvo.innerHTML = `<strong>Evolution:</strong> ${evo}`;
  modalFact.innerHTML = `<strong>Fun fact:</strong> ${fact}`;

  modal.setAttribute("aria-hidden", "false");
  // trap focus inside modal for accessibility
  modalClose.focus();
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
}

// close button
modalClose.addEventListener("click", closeModal);

// close if clicking outside modal card
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Keep camera focused on nearest layer when user stops interacting
let idleTimer = null;
function focusNearest() {
  // snap camera to nearest layer index
  const idx = Math.round(targetPos / spacing);
  targetPos = Math.max(0, Math.min(idx * spacing, maxIndex * spacing));
  // set focus to the element to improve keyboard accessibility
  const element = eras[idx];
  if (element) element.focus({ preventScroll: true });
  // clear any existing timer
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    // minor bounce into place
    scrollPos = targetPos;
  }, 350);
}

// Make sure scene doesn't get stuck if resized
window.addEventListener("resize", () => {
  // reapply transforms in case layout changed
  eras.forEach((era, i) => {
    const z = i * -spacing;
    era.dataset.z = z;
    era.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
  });
});

// Optionally: when user double-click a non-active era, jump to it
eras.forEach((era, idx) => {
  era.addEventListener("dblclick", () => {
    targetPos = Math.min(idx * spacing, maxIndex * spacing);
    focusNearest();
  });
});

// initial focus on first era for keyboard users
if (eras[0]) eras[0].focus({ preventScroll: true });
// set initial camera position
