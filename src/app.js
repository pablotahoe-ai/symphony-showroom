import { buildingData } from "../data/building-data.js";

const statusColors = {
  available: "#32ff7e",
  reserved: "#ffcc33",
  sold: "#ff3333",
  blocked: "#888888"
};

const statusLabels = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
  blocked: "No disponible"
};

const adminPassword = "Dcabo2021$.";
const storageKey = `${buildingData.building.id}:unit-statuses`;
const remoteStatusApiUrl = "/.netlify/functions/unit-statuses";
const salesWhatsApp = "5492235254857";

const state = {
  selectedFloor: 0,
  selectedUnitId: null,
  adminUnlocked: false,
  unitOverrides: loadUnitOverrides(),
  pendingUnitOverrides: {}
};

const icons = {
  floor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></svg>',
  unit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 21V3h11v18"/><path d="M16 7h3v14"/><path d="M10 12h.01"/></svg>',
  area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V4h16"/><path d="m8 16 8-8"/><path d="M8 11V8h3"/><path d="M13 16h3v-3"/></svg>',
  status: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 19V5h7a4 4 0 0 1 0 8H6"/><path d="M6 13h7"/></svg>',
  amenities: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>'
};

const building = document.querySelector("#building");
const buildingRender = document.querySelector("#buildingRender");
const floorSelector = document.querySelector("#floorSelector");
const unitSelector = document.querySelector("#unitSelector");
const panelTitle = document.querySelector("#panelTitle");
const summaryTitle = document.querySelector("#summaryTitle");
const summaryFeatures = document.querySelector("#summaryFeatures");
const panelProjectName = document.querySelector("#panelProjectName");
const panelProjectSubtitle = document.querySelector("#panelProjectSubtitle");
const statusPill = document.querySelector("#statusPill");
const axoImage = document.querySelector("#axoImage");
const infoList = document.querySelector("#infoList");
const contactButton = document.querySelector("#contactButton");
const scanLine = document.querySelector("#scanLine");
const floorUp = document.querySelector("#floorUp");
const floorDown = document.querySelector("#floorDown");
const headerAddress = document.querySelector(".header-address");
const menuButton = document.querySelector("#menuButton");
const adminDialog = document.querySelector("#adminDialog");
const adminLogin = document.querySelector("#adminLogin");
const adminPanel = document.querySelector("#adminPanel");
const adminPasswordInput = document.querySelector("#adminPassword");
const adminError = document.querySelector("#adminError");
const adminFloor = document.querySelector("#adminFloor");
const adminUnits = document.querySelector("#adminUnits");
const adminSave = document.querySelector("#adminSave");
const adminSaveStatus = document.querySelector("#adminSaveStatus");
let scanTimer = null;

function init() {
  applyUnitOverrides();
  syncRemoteUnitOverrides();
  summaryTitle.textContent = buildingData.building.name;
  summaryFeatures.innerHTML = buildingData.summary.map((item) => `<li>${item}</li>`).join("");
  panelProjectName.textContent = buildingData.building.name;
  panelProjectSubtitle.textContent = buildingData.building.subtitle;
  headerAddress.textContent = buildingData.building.address;
  renderBuilding();
  renderFloorSelector();
  floorUp.addEventListener("click", () => selectFloor(state.selectedFloor + 1));
  floorDown.addEventListener("click", () => selectFloor(state.selectedFloor - 1));
  setupAdmin();
  render();
}

function renderBuilding() {
  building.innerHTML = "";
  for (let floor = 1; floor <= buildingData.building.floorsCount; floor += 1) {
    const row = document.createElement("button");
    row.className = "floor-hit";
    row.type = "button";
    row.setAttribute("aria-label", `Seleccionar piso ${floor}`);
    row.dataset.floor = String(floor);
    row.style.bottom = `${(floor - 1) * 12.15}%`;
    row.addEventListener("click", () => selectFloor(floor));
    building.appendChild(row);
  }
}

function renderFloorSelector() {
  floorSelector.innerHTML = "";
  for (let floor = buildingData.building.floorsCount; floor >= 1; floor -= 1) {
    const button = document.createElement("button");
    button.className = "floor-button";
    button.type = "button";
    button.textContent = `Piso ${floor}`;
    button.dataset.floor = String(floor);
    button.addEventListener("click", () => selectFloor(floor));
    floorSelector.appendChild(button);
  }
}

function render() {
  const floorUnits = getUnitsByFloor(state.selectedFloor);
  const selectedUnit = getSelectedUnit(floorUnits);
  const buildingAsset = getBuildingAsset(state.selectedFloor);

  document.querySelectorAll("[data-floor]").forEach((element) => {
    element.classList.toggle("active", Number(element.dataset.floor) === state.selectedFloor);
  });

  buildingRender.src = buildingAsset;
  floorUp.disabled = state.selectedFloor >= getMaxAssetFloor();
  floorDown.disabled = state.selectedFloor <= 0;

  if (!selectedUnit) {
    unitSelector.innerHTML = "";
    panelTitle.textContent = "INFO";
    statusPill.textContent = "General";
    statusPill.style.color = "rgba(255, 255, 255, 0.72)";
    axoImage.src = buildingData.building.groundFloorAsset || "./assets/floors/ground-floor.png";
    axoImage.classList.add("ground-floor-image");
    infoList.innerHTML = [
      row("floor", "Vista", "General"),
      row("unit", "Proyecto", buildingData.building.name),
      row("area", "Pisos", buildingData.building.floorsCount),
      row("parking", "Cocheras", "Subsuelo"),
      row("amenities", "Amenities", "SUM + parrilla")
    ].join("");
    contactButton.href = buildWhatsAppUrl({ unit: "general", floor: "general", areaM2: null });
    return;
  }

  unitSelector.innerHTML = floorUnits
    .map((unit) => {
      const color = statusColors[unit.status] || "#888888";
      const active = unit.id === selectedUnit.id ? " active" : "";
      return `<button class="unit-button${active}" style="--unit-color:${color}" type="button" data-unit="${unit.id}">${unit.unit}</button>`;
    })
    .join("");

  unitSelector.querySelectorAll("[data-unit]").forEach((button) => {
    button.addEventListener("click", () => selectUnit(button.dataset.unit));
  });

  const statusColor = statusColors[selectedUnit.status] || "#ffffff";
  panelTitle.textContent = selectedUnit.title || "INFO";
  statusPill.textContent = selectedUnit.statusLabel;
  statusPill.style.color = statusColor;
  axoImage.src = selectedUnit.floorAsset;
  axoImage.classList.remove("ground-floor-image");

  infoList.innerHTML = [
    row("floor", "Piso", selectedUnit.floor),
    row("unit", "Unidad", selectedUnit.unit),
    row("area", "Superficie", selectedUnit.areaM2 ? `${selectedUnit.areaM2} m2` : "A definir"),
    row("amenities", "Tipologia", selectedUnit.typology || "Consultar"),
    row("floor", "Rango", selectedUnit.floorsLabel || `Piso ${selectedUnit.floor}`),
    row("status", "Estado", selectedUnit.statusLabel, statusColor),
    selectedUnit.owner ? row("unit", "Ocupado por", selectedUnit.owner) : "",
    row("parking", "Cochera", selectedUnit.parkingLabel ?? "Consultar"),
    row("amenities", "Amenities", selectedUnit.amenities ? "Si" : "No"),
    detailRows(selectedUnit.rooms || [])
  ].join("");

  contactButton.href = buildWhatsAppUrl(selectedUnit);
}

function row(icon, label, value, color = null) {
  const style = color ? ` style="color:${color}"` : "";
  return `<div class="info-row">${icons[icon]}<span>${label}</span><strong${style}>${value}</strong></div>`;
}

function detailRows(items) {
  if (!items.length) {
    return "";
  }

  return `<div class="detail-block"><span>Ambientes</span>${items.map((item) => `<p>${item}</p>`).join("")}</div>`;
}

function selectFloor(floor) {
  const minFloor = 0;
  const maxFloor = getMaxAssetFloor();
  const nextFloor = Math.max(minFloor, Math.min(maxFloor, floor));
  if (nextFloor === state.selectedFloor) {
    return;
  }

  floorUp.disabled = true;
  floorDown.disabled = true;
  runScan();

  window.clearTimeout(scanTimer);
  scanTimer = window.setTimeout(() => {
    state.selectedFloor = nextFloor;
    applySelectedFloor();
    buildingRender.classList.add("swapping");
    render();
    window.setTimeout(() => {
      buildingRender.classList.remove("swapping");
    }, 210);
  }, 330);
}

function applySelectedFloor() {
  const units = getUnitsByFloor(state.selectedFloor);
  state.selectedUnitId = units.find((unit) => unit.status === "available")?.id || units[0]?.id || null;
}

function selectUnit(unitId) {
  state.selectedUnitId = unitId;
  render();
}

function getUnitsByFloor(floor) {
  return buildingData.units.filter((unit) => unit.floor === floor);
}

function getSelectedUnit(floorUnits) {
  return floorUnits.find((unit) => unit.id === state.selectedUnitId) || floorUnits[0];
}

function getBuildingAsset(floor) {
  if (floor <= 0) {
    return buildingData.building.buildingAssetBase;
  }

  return buildingData.building.buildingAssetPattern.replace("{floor}", String(floor).padStart(2, "0"));
}

function getMaxAssetFloor() {
  return Math.min(buildingData.building.floorsCount, buildingData.building.maxConfiguredFloors || 20);
}

function buildWhatsAppUrl(unit) {
  const text = `Hola, quiero consultar por la unidad ${unit.unit} del piso ${unit.floor}, de ${unit.areaM2 || "superficie a definir"} m2 en ${buildingData.building.name}.`;
  return `https://wa.me/${salesWhatsApp}?text=${encodeURIComponent(text)}`;
}

function runScan() {
  scanLine.classList.remove("run");
  void scanLine.offsetWidth;
  scanLine.classList.add("run");
}

function setupAdmin() {
  menuButton.addEventListener("click", openAdminDialog);
  adminLogin.addEventListener("submit", handleAdminLogin);
  adminFloor.addEventListener("change", renderSelectedAdminFloorUnits);
  adminSave.addEventListener("click", savePendingAdminChanges);
  adminDialog.querySelectorAll("[data-admin-close]").forEach((button) => {
    button.addEventListener("click", closeAdminDialog);
  });

  adminDialog.addEventListener("click", (event) => {
    if (event.target === adminDialog) {
      closeAdminDialog();
    }
  });
}

function openAdminDialog() {
  adminError.textContent = "";
  if (state.adminUnlocked) {
    showAdminPanel();
  } else {
    showAdminLogin();
  }

  adminDialog.showModal();
  if (!state.adminUnlocked) {
    adminPasswordInput.focus();
  }
}

function closeAdminDialog() {
  state.pendingUnitOverrides = {};
  adminDialog.close();
}

function showAdminLogin() {
  adminDialog.classList.add("login-mode");
  adminDialog.classList.remove("panel-mode");
  adminLogin.hidden = false;
  adminPanel.hidden = true;
  adminPanel.inert = true;
  adminPasswordInput.value = "";
}

function showAdminPanel() {
  adminDialog.classList.add("panel-mode");
  adminDialog.classList.remove("login-mode");
  adminLogin.hidden = true;
  adminPanel.hidden = false;
  adminPanel.inert = false;
  state.pendingUnitOverrides = {};
  renderAdminFloorOptions();
  renderSelectedAdminFloorUnits();
  updateAdminSaveState(false);
}

function handleAdminLogin(event) {
  event.preventDefault();
  if (adminPasswordInput.value !== adminPassword) {
    adminError.textContent = "Contraseña incorrecta.";
    adminPasswordInput.select();
    return;
  }

  state.adminUnlocked = true;
  adminPasswordInput.blur();
  showAdminPanel();
}

function renderAdminFloorOptions() {
  const selected = state.selectedFloor > 0 ? state.selectedFloor : 1;
  adminFloor.innerHTML = Array.from({ length: buildingData.building.floorsCount }, (_, index) => {
    const floor = index + 1;
    return `<option value="${floor}"${floor === selected ? " selected" : ""}>Piso ${floor}</option>`;
  }).join("");
}

function renderSelectedAdminFloorUnits() {
  const floor = Number(adminFloor.value || 1);
  const units = getUnitsByFloor(floor);
  adminUnits.innerHTML = units.map((unit) => `
    <article class="admin-unit-row" data-admin-unit="${unit.id}">
      <strong>Unidad ${unit.unit}</strong>
      <small>${unit.areaM2 || "A definir"} m2 - ${unit.typology || "Consultar"}</small>
      <label>
        <span>Estado</span>
        <select data-admin-status>
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}"${getAdminDraft(unit.id).status === value ? " selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Ocupado por</span>
        <input data-admin-owner type="text" value="${escapeAttribute(getAdminDraft(unit.id).owner || "")}" placeholder="Nombre opcional" />
      </label>
    </article>
  `).join("");

  adminUnits.querySelectorAll("[data-admin-unit]").forEach((rowElement) => {
    const unitId = rowElement.dataset.adminUnit;
    rowElement.querySelector("[data-admin-status]").addEventListener("change", (event) => {
      stageUnitOverride(unitId, { status: event.target.value });
    });
    rowElement.querySelector("[data-admin-owner]").addEventListener("input", (event) => {
      stageUnitOverride(unitId, { owner: event.target.value.trim() });
    });
  });
}

function renderAdminUnits() {
  adminUnits.innerHTML = Array.from({ length: buildingData.building.floorsCount }, (_, index) => {
    const floor = index + 1;
    const units = getUnitsByFloor(floor);
    if (!units.length) {
      return "";
    }

    return `
      <section class="admin-floor-group">
        <h3>Piso ${floor}</h3>
        <div class="admin-floor-units">
          ${units.map((unit) => `
    <article class="admin-unit-row" data-admin-unit="${unit.id}">
      <strong>Unidad ${unit.unit}</strong>
      <small>${unit.areaM2 || "A definir"} m2 · ${unit.typology || "Consultar"}</small>
      <label>
        <span>Estado</span>
        <select data-admin-status>
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}"${getAdminDraft(unit.id).status === value ? " selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Ocupado por</span>
        <input data-admin-owner type="text" value="${escapeAttribute(getAdminDraft(unit.id).owner || "")}" placeholder="Nombre opcional" />
      </label>
    </article>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");

  adminUnits.querySelectorAll("[data-admin-unit]").forEach((rowElement) => {
    const unitId = rowElement.dataset.adminUnit;
    rowElement.querySelector("[data-admin-status]").addEventListener("change", (event) => {
      stageUnitOverride(unitId, { status: event.target.value });
    });
    rowElement.querySelector("[data-admin-owner]").addEventListener("input", (event) => {
      stageUnitOverride(unitId, { owner: event.target.value.trim() });
    });
  });
}

function getAdminDraft(unitId) {
  const unit = buildingData.units.find((item) => item.id === unitId);
  return {
    status: unit?.status || "available",
    owner: unit?.owner || "",
    ...state.pendingUnitOverrides[unitId]
  };
}

function stageUnitOverride(unitId, changes) {
  const current = getAdminDraft(unitId);
  const next = { ...current, ...changes };
  if (!next.owner) {
    delete next.owner;
  }

  state.pendingUnitOverrides[unitId] = next;
  updateAdminSaveState(true);
}

async function savePendingAdminChanges() {
  state.unitOverrides = {
    ...state.unitOverrides,
    ...state.pendingUnitOverrides
  };
  localStorage.setItem(storageKey, JSON.stringify(state.unitOverrides));
  const remoteSaved = await saveRemoteUnitOverrides(state.unitOverrides);
  state.pendingUnitOverrides = {};
  applyUnitOverrides();
  render();
  renderSelectedAdminFloorUnits();
  updateAdminSaveState(false, remoteSaved ? "Cambios guardados para todos." : "Cambios guardados solo en este navegador.");
}

function updateAdminSaveState(hasPending, message = null) {
  adminSave.disabled = !hasPending;
  adminSaveStatus.textContent = message || (hasPending ? "Hay cambios sin guardar." : "Sin cambios pendientes.");
}

function applyUnitOverrides() {
  buildingData.units.forEach((unit) => {
    const override = state.unitOverrides[unit.id];
    unit.status = override?.status || "available";
    unit.statusLabel = statusLabels[unit.status] || "Disponible";
    unit.owner = override?.owner || "";
  });
}

function loadUnitOverrides() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

async function syncRemoteUnitOverrides() {
  if (!remoteStatusApiUrl) {
    return;
  }

  try {
    const response = await fetch(remoteStatusApiUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("No se pudo leer el estado remoto.");
    }

    const remoteOverrides = await response.json();
    state.unitOverrides = remoteOverrides || {};
    localStorage.setItem(storageKey, JSON.stringify(state.unitOverrides));
    applyUnitOverrides();
    render();
  } catch (error) {
    console.warn(error);
  }
}

async function saveRemoteUnitOverrides(overrides) {
  if (!remoteStatusApiUrl) {
    return false;
  }

  try {
    const response = await fetch(remoteStatusApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides)
    });

    if (!response.ok) {
      throw new Error("No se pudo guardar el estado remoto.");
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

init();
