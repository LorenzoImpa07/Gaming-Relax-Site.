// ==========================================================================
// Dashboard admin — gestione Prodotti, Team, Contenuti Home
// Protetta: solo l'account con email === ADMIN_EMAIL può vederla e scrivere
// (la protezione vera è nelle regole di Firestore, questa è solo l'interfaccia)
// ==========================================================================
import { auth, db, ADMIN_EMAIL } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot,
  setDoc, getDoc, serverTimestamp, orderBy, query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// --- Guardia di accesso ---
onAuthStateChanged(auth, (user) => {
  const guard = document.getElementById("dashboard-guard");
  const root = document.getElementById("dashboard-root");

  if (!user || user.email !== ADMIN_EMAIL) {
    guard.innerHTML = user
      ? "<p>Questo account non ha accesso alla Dashboard.<br><a href='index.html' class='btn btn--outline' style='margin-top:16px;'>Torna al sito</a></p>"
      : "<p>Devi accedere con l'account amministratore.<br><a href='login.html' class='btn btn--lime' style='margin-top:16px;'>Vai al login</a></p>";
    guard.style.display = "flex";
    root.style.display = "none";
    return;
  }

  guard.style.display = "none";
  root.style.display = "block";
  document.getElementById("admin-email").textContent = user.email;
  initTabs();
  initProducts();
  initTeam();
  initPageContent();
  initDesign();
});

document.getElementById("logout-dash")?.addEventListener("click", () => {
  signOut(auth).then(() => { window.location.href = "index.html"; });
});

// --- Tabs ---
function initTabs() {
  const tabs = document.querySelectorAll(".dash-tab");
  const panels = document.querySelectorAll(".dash-panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.panel).classList.add("active");
    });
  });
}

// ==========================================================================
// PRODOTTI — sincronizzati in automatico con store.html
// ==========================================================================
function initProducts() {
  const form = document.getElementById("product-form");
  const list = document.getElementById("admin-products-list");
  const colRef = collection(db, "products");
  const cancelBtn = document.getElementById("product-cancel-edit");

  onSnapshot(query(colRef, orderBy("createdAt", "desc")), (snap) => {
    if (snap.empty) {
      list.innerHTML = '<p class="empty-hint">Nessun prodotto ancora. Aggiungine uno dal form.</p>';
      return;
    }
    list.innerHTML = "";
    snap.forEach((docSnap) => {
      const p = docSnap.data();
      const row = document.createElement("div");
      row.className = "admin-row";
      row.innerHTML = `
        <img class="admin-row__thumb" src="${escapeHtml(p.imageUrl || "")}" alt="" onerror="this.style.visibility='hidden'">
        <div class="admin-row__info">
          <strong>${escapeHtml(p.name)}</strong>
          <span>${escapeHtml(p.category)} — ${escapeHtml(p.price)}</span>
        </div>
        <div class="admin-row__actions">
          <button type="button" class="btn btn--outline btn-edit" data-id="${docSnap.id}">Modifica</button>
          <button type="button" class="btn btn--outline btn-delete" data-id="${docSnap.id}">Elimina</button>
        </div>`;
      list.appendChild(row);
    });

    list.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Eliminare definitivamente questo prodotto? Sparirà anche dallo Store.")) {
          await deleteDoc(doc(db, "products", btn.dataset.id));
        }
      });
    });

    list.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const snap2 = await getDoc(doc(db, "products", btn.dataset.id));
        const p = snap2.data();
        form.querySelector("#p-name").value = p.name || "";
        form.querySelector("#p-category").value = p.category || "tastiere";
        form.querySelector("#p-price").value = p.price || "";
        form.querySelector("#p-payment-link").value = p.paymentLink || "";
        form.querySelector("#p-desc").value = p.description || "";
        form.querySelector("#p-image").value = p.imageUrl || "";
        form.dataset.editId = btn.dataset.id;
        form.querySelector("button[type=submit]").textContent = "Salva modifiche";
        cancelBtn.style.display = "inline-flex";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: form.querySelector("#p-name").value.trim(),
      category: form.querySelector("#p-category").value,
      price: form.querySelector("#p-price").value.trim(),
      paymentLink: form.querySelector("#p-payment-link").value.trim(),
      description: form.querySelector("#p-desc").value.trim(),
      imageUrl: form.querySelector("#p-image").value.trim()
    };
    const editId = form.dataset.editId;
    if (editId) {
      await updateDoc(doc(db, "products", editId), data);
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(colRef, data);
    }
    resetProductForm();
  });

  cancelBtn.addEventListener("click", resetProductForm);

  function resetProductForm() {
    form.reset();
    delete form.dataset.editId;
    form.querySelector("button[type=submit]").textContent = "Aggiungi prodotto";
    cancelBtn.style.display = "none";
  }
}

// ==========================================================================
// TEAM — sincronizzato in automatico con team.html
// ==========================================================================
function initTeam() {
  const form = document.getElementById("team-form");
  const list = document.getElementById("admin-team-list");
  const colRef = collection(db, "team");
  const cancelBtn = document.getElementById("team-cancel-edit");

  onSnapshot(colRef, (snap) => {
    if (snap.empty) {
      list.innerHTML = '<p class="empty-hint">Nessun membro del team ancora. Aggiungine uno dal form.</p>';
      return;
    }
    list.innerHTML = "";
    snap.forEach((docSnap) => {
      const m = docSnap.data();
      const row = document.createElement("div");
      row.className = "admin-row";
      row.innerHTML = `
        <img class="admin-row__thumb" src="${escapeHtml(m.photoUrl || "")}" alt="" onerror="this.style.visibility='hidden'">
        <div class="admin-row__info">
          <strong>${escapeHtml(m.name)}</strong>
          <span>${escapeHtml(m.role)} — ${escapeHtml(m.category)}</span>
        </div>
        <div class="admin-row__actions">
          <button type="button" class="btn btn--outline btn-edit" data-id="${docSnap.id}">Modifica</button>
          <button type="button" class="btn btn--outline btn-delete" data-id="${docSnap.id}">Elimina</button>
        </div>`;
      list.appendChild(row);
    });

    list.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Eliminare questo membro del team?")) {
          await deleteDoc(doc(db, "team", btn.dataset.id));
        }
      });
    });

    list.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const snap2 = await getDoc(doc(db, "team", btn.dataset.id));
        const m = snap2.data();
        form.querySelector("#t-name").value = m.name || "";
        form.querySelector("#t-role").value = m.role || "";
        form.querySelector("#t-category").value = m.category || "tastiere";
        form.querySelector("#t-photo").value = m.photoUrl || "";
        form.dataset.editId = btn.dataset.id;
        form.querySelector("button[type=submit]").textContent = "Salva modifiche";
        cancelBtn.style.display = "inline-flex";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: form.querySelector("#t-name").value.trim(),
      role: form.querySelector("#t-role").value.trim(),
      category: form.querySelector("#t-category").value,
      photoUrl: form.querySelector("#t-photo").value.trim()
    };
    const editId = form.dataset.editId;
    if (editId) {
      await updateDoc(doc(db, "team", editId), data);
    } else {
      await addDoc(colRef, data);
    }
    resetTeamForm();
  });

  cancelBtn.addEventListener("click", resetTeamForm);

  function resetTeamForm() {
    form.reset();
    delete form.dataset.editId;
    form.querySelector("button[type=submit]").textContent = "Aggiungi membro";
    cancelBtn.style.display = "none";
  }
}

// ==========================================================================
// TESTI DELLE PAGINE — un form dinamico per pagina, generato da PAGE_FIELDS
// ==========================================================================
const PAGE_FIELDS = {
  home: [
    { key: "heroTitleLine1", label: "Titolo hero — riga 1", type: "input", placeholder: "La tua tastiera." },
    { key: "heroTitleLine2", label: "Titolo hero — riga 2", type: "input", placeholder: "Il tuo pezzo" },
    { key: "heroAccent", label: "Titolo hero — parola evidenziata", type: "input", placeholder: "unico." },
    { key: "heroSubtitle", label: "Sottotitolo hero", type: "textarea", placeholder: "Grafiche custom per tastiere e arte su misura..." },
    { key: "heroCta", label: "Testo pulsante hero", type: "input", placeholder: "Esplora il nostro mondo →" },
    { key: "studioTitle", label: "Titolo sezione \"Un team. Uno studio.\"", type: "textarea", placeholder: "Un team.\nUno studio." },
    { key: "studioText", label: "Testo sezione \"Un team. Uno studio.\"", type: "textarea" },
    { key: "ctaTitle", label: "Titolo banner finale (\"Hai un'idea?\")", type: "textarea", placeholder: "Hai un'idea?\nTrasformiamola in qualcosa di unico." }
  ],
  store: [
    { key: "eyebrow", label: "Etichetta sopra il titolo", type: "input", placeholder: "Esplora lo Store" },
    { key: "title", label: "Titolo", type: "textarea", placeholder: "Hardware & Accessori" },
    { key: "subtitle", label: "Sottotitolo", type: "textarea" }
  ],
  custom: [
    { key: "eyebrow", label: "Etichetta sopra il titolo", type: "input", placeholder: "Il processo" },
    { key: "title", label: "Titolo", type: "textarea", placeholder: "Tu la immagini,\nnoi la costruiamo" },
    { key: "subtitle", label: "Sottotitolo", type: "textarea" }
  ],
  art: [
    { key: "title", label: "Titolo", type: "textarea", placeholder: "L'arte non ha limiti" },
    { key: "subtitle", label: "Sottotitolo", type: "textarea" }
  ],
  team: [
    { key: "title", label: "Titolo", type: "textarea", placeholder: "Il nostro team" },
    { key: "subtitle", label: "Sottotitolo", type: "textarea" }
  ],
  contatti: [
    { key: "eyebrow", label: "Etichetta sopra il titolo", type: "input", placeholder: "Progetti" },
    { key: "title", label: "Titolo", type: "textarea", placeholder: "Iniziamo a\ncostruire" },
    { key: "subtitle", label: "Sottotitolo", type: "textarea" }
  ]
};

function initPageContent() {
  const pageSelect = document.getElementById("page-select");
  const fieldsContainer = document.getElementById("page-content-fields");
  const form = document.getElementById("page-content-form");
  const statusMsg = document.getElementById("page-content-status");

  function renderFieldsFor(pageKey) {
    const fields = PAGE_FIELDS[pageKey] || [];
    fieldsContainer.innerHTML = fields.map((f) => `
      <div class="field">
        <label for="pf-${f.key}">${f.label}</label>
        ${f.type === "textarea"
          ? `<textarea id="pf-${f.key}" placeholder="${f.placeholder || ""}"></textarea>`
          : `<input type="text" id="pf-${f.key}" placeholder="${f.placeholder || ""}">`
        }
      </div>
    `).join("");

    getDoc(doc(db, "siteContent", pageKey)).then((snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      fields.forEach((f) => {
        const el = document.getElementById(`pf-${f.key}`);
        if (el && d[f.key]) el.value = d[f.key];
      });
    });
  }

  pageSelect.addEventListener("change", () => renderFieldsFor(pageSelect.value));
  renderFieldsFor(pageSelect.value);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pageKey = pageSelect.value;
    const fields = PAGE_FIELDS[pageKey] || [];
    const data = {};
    fields.forEach((f) => {
      data[f.key] = document.getElementById(`pf-${f.key}`).value.trim();
    });
    await setDoc(doc(db, "siteContent", pageKey), data, { merge: true });

    statusMsg.textContent = "Salvato. Ricarica quella pagina del sito per vedere le modifiche.";
    statusMsg.classList.add("visible");
    setTimeout(() => statusMsg.classList.remove("visible"), 4000);
  });
}

// ==========================================================================
// ASPETTO GRAFICO — colori globali del sito
// ==========================================================================
const DEFAULT_COLORS = {
  limeColor: "#c6ff1a",
  purpleColor: "#9b3dff",
  bgColor: "#0a0d16",
  bgAltColor: "#10141f",
  cardColor: "#14182a"
};

function initDesign() {
  const form = document.getElementById("design-form");
  const statusMsg = document.getElementById("design-status");
  const resetBtn = document.getElementById("design-reset");
  const ref = doc(db, "siteContent", "design");

  const inputs = {
    limeColor: document.getElementById("d-lime"),
    purpleColor: document.getElementById("d-purple"),
    bgColor: document.getElementById("d-bg"),
    bgAltColor: document.getElementById("d-bg-alt"),
    cardColor: document.getElementById("d-card")
  };

  getDoc(ref).then((snap) => {
    if (!snap.exists()) return;
    const d = snap.data();
    Object.entries(inputs).forEach(([key, el]) => { if (d[key]) el.value = d[key]; });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {};
    Object.entries(inputs).forEach(([key, el]) => { data[key] = el.value; });
    await setDoc(ref, data, { merge: true });

    statusMsg.textContent = "Salvato. Ricarica una pagina qualsiasi del sito per vedere i nuovi colori.";
    statusMsg.classList.add("visible");
    setTimeout(() => statusMsg.classList.remove("visible"), 4000);
  });

  resetBtn.addEventListener("click", async () => {
    if (!confirm("Ripristinare i colori predefiniti del sito?")) return;
    Object.entries(inputs).forEach(([key, el]) => { el.value = DEFAULT_COLORS[key]; });
    await setDoc(ref, DEFAULT_COLORS, { merge: true });
    statusMsg.textContent = "Colori predefiniti ripristinati.";
    statusMsg.classList.add("visible");
    setTimeout(() => statusMsg.classList.remove("visible"), 4000);
  });
}
