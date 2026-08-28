// ==========================================================================
// Home dinamica — sovrascrive i testi dell'hero se lo staff li ha modificati
// dalla Dashboard. Se non c'è nulla di salvato, restano i testi di default
// già presenti nell'HTML (nessun flash vuoto in attesa del caricamento).
// ==========================================================================
import { db } from "./firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

getDoc(doc(db, "siteContent", "home")).then((snap) => {
  if (!snap.exists()) return;
  const d = snap.data();

  const t1 = document.getElementById("hero-title-1");
  const t2 = document.getElementById("hero-title-2");
  const accent = document.getElementById("hero-title-accent");
  const subtitle = document.getElementById("hero-subtitle");
  const cta = document.getElementById("hero-cta");

  if (d.heroTitleLine1 && t1) t1.textContent = d.heroTitleLine1;
  if (d.heroTitleLine2 && t2) t2.textContent = d.heroTitleLine2;
  if (d.heroAccent && accent) accent.textContent = d.heroAccent;
  if (d.heroSubtitle && subtitle) subtitle.textContent = d.heroSubtitle;
  if (d.heroCta && cta) cta.textContent = d.heroCta;
}).catch(() => { /* in caso di errore restano i testi predefiniti */ });
