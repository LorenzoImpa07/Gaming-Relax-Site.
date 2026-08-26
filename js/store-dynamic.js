// ==========================================================================
// Store dinamico — legge i prodotti da Firestore (aggiunti dalla Dashboard)
// ==========================================================================
import { db } from "./firebase-init.js";
import { collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CATEGORY_LABELS = {
  tastiere: "Tastiere Custom",
  keycaps: "Keycaps",
  accessori: "Accessori",
  servizi: "Servizi Tech"
};

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-dim);">Nessun prodotto disponibile al momento. Torna presto!</p>';
    return;
  }

  const activeFilter = document.querySelector(".filter-pill.active")?.dataset.storeFilter || "tutti";

  grid.innerHTML = products.map((p) => `
    <div class="product-card" data-product-category="${p.category}" style="${activeFilter !== "tutti" && activeFilter !== p.category ? "display:none;" : ""}">
      <div class="product-card__img" style="background:${p.imageUrl ? `url('${escapeHtml(p.imageUrl)}') center/cover` : "linear-gradient(135deg,#101522,#050608)"};"></div>
      <div class="product-card__body">
        <div class="product-card__top">
          <div>
            <span class="product-card__cat">${escapeHtml(CATEGORY_LABELS[p.category] || p.category)}</span>
            <h3>${escapeHtml(p.name)}</h3>
          </div>
          <button class="wish-btn" aria-label="Aggiungi ai preferiti">♡</button>
        </div>
        ${p.description ? `<p style="font-size:14px;">${escapeHtml(p.description)}</p>` : ""}
        <div class="product-card__footer">
          <span class="product-card__price">${escapeHtml(p.price)}</span>
          ${p.paymentLink
            ? `<a href="${escapeHtml(p.paymentLink)}" target="_blank" rel="noopener" class="btn btn--lime" style="padding:10px 22px;font-size:14px;">Acquista</a>`
            : `<a href="contatti.html" class="btn btn--lime" style="padding:10px 22px;font-size:14px;">Richiedi</a>`
          }
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".wish-btn").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("active"));
  });
}

let currentProducts = [];

const colRef = collection(db, "products");
onSnapshot(query(colRef, orderBy("createdAt", "desc")), (snap) => {
  currentProducts = snap.docs.map((d) => d.data());
  renderProducts(currentProducts);
}, () => {
  // Se le regole non sono ancora pronte o c'è un errore, mostra un messaggio invece di una pagina vuota
  const grid = document.getElementById("product-grid");
  if (grid) grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-dim);">Impossibile caricare i prodotti al momento.</p>';
});

// Filtri categoria — ricollegati ad ogni click, ricalcolano la visibilità sui prodotti già caricati
document.querySelectorAll("[data-store-filter]").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("[data-store-filter]").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    const filter = pill.dataset.storeFilter;
    document.querySelectorAll("[data-product-category]").forEach((card) => {
      card.style.display = (filter === "tutti" || card.dataset.productCategory === filter) ? "" : "none";
    });
  });
});
