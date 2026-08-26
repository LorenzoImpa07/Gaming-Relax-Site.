# Gaming Relax — Sito Web

Sito per **Gaming Relax**, attività di tastiere custom, keycaps artisan e servizi digitali (bot Discord, consulenze, grafica). Frontend statico (HTML/CSS/JS, nessuna build richiesta), con login utenti e una Dashboard admin collegate a **Firebase** (Authentication + Firestore).

Ricreato a partire da una registrazione video del sito originale (site123.me), con la stessa struttura di pagine, testi e identità visiva (tema scuro, accento verde lime + viola).

## Struttura del progetto

```
gaming-relax/
├── index.html              Home (testi hero modificabili da Dashboard)
├── store.html               Store — prodotti caricati in automatico da Firestore
├── custom.html               Percorso "crea la tua tastiera custom"
├── art.html                  Galleria opere / keycaps artisan
├── team.html                  Team — membri caricati in automatico da Firestore
├── contatti.html               Form contatti
├── faq.html                    Domande frequenti
├── privacy.html                 Privacy Policy
├── termini.html                 Termini e Condizioni
├── login.html                   Accesso utenti / staff
├── register.html                 Registrazione nuovo utente
├── dashboard.html                 Pannello admin (solo staff)
├── firestore.rules.txt             Regole di sicurezza da incollare in Firebase
├── css/style.css                   Tutti gli stili del sito
└── js/
    ├── script.js                   Menu mobile, FAQ accordion, form contatti
    ├── firebase-config.js           Le TUE chiavi Firebase (già inserite)
    ├── firebase-init.js             Inizializza Firebase
    ├── auth.js                      Login, registrazione, logout, menu account
    ├── dashboard.js                 Logica del pannello admin
    ├── store-dynamic.js             Collega lo Store ai prodotti su Firestore
    ├── team-dynamic.js              Collega la pagina Team a Firestore
    └── home-dynamic.js              Applica i testi hero personalizzati
```

## Come funziona il sistema di accesso

- **Chiunque** può registrarsi da `register.html` con la propria email e una password a scelta (minimo 6 caratteri). Un utente normale, dopo il login, non vede la Dashboard.
- **Solo l'account staff** — email `gamingrelaxadmin@gmail.com`, password impostata da te in Firebase — dopo il login viene reindirizzato automaticamente a `dashboard.html`, dove può:
  - **Prodotti**: aggiungere, modificare, eliminare prodotti. Compaiono in automatico nello Store, per tutti i visitatori.
  - **Team**: aggiungere, modificare, eliminare membri del team. Compaiono in automatico nella pagina Team.
  - **Contenuti Home**: modificare titolo, sottotitolo e testo del pulsante nella sezione hero della Home.

⚠️ **Importante sulla sicurezza**: l'email admin è visibile nel codice (è scritta in `js/firebase-config.js` e `js/auth.js`) — questo è normale e non è un problema, perché **non basta conoscerla** per accedere alla Dashboard: serve anche la password corretta, verificata da Firebase Authentication, e le regole di Firestore (vedi sotto) impediscono comunque a chiunque altro di scrivere nel database anche se scoprisse l'email.

## Configurazione già fatta

Il progetto Firebase `gaming-relax` è già collegato in `js/firebase-config.js`. Se in futuro crei un nuovo progetto Firebase, dovrai solo aggiornare quei valori (li trovi in Console Firebase → Project settings → Your apps).

### Cosa devi ancora fare tu, una volta sola

1. **Incolla le regole di sicurezza**: apri `firestore.rules.txt`, copia tutto il contenuto, vai su Console Firebase → Firestore Database → scheda "Regole", incolla e clicca "Pubblica". Senza questo passaggio lo Store e la Dashboard non funzioneranno correttamente (le richieste di lettura/scrittura verranno rifiutate).
2. **Verifica che l'utente admin esista**: Console Firebase → Authentication → Users → deve comparire `gamingrelaxadmin@gmail.com`. Se non c'è, clicca "Add user" e crealo con la password che vuoi usare.
3. **Autorizza il dominio del sito**: Console Firebase → Authentication → Settings → "Authorized domains" → aggiungi il dominio dove pubblicherai il sito (es. `<tuo-utente>.github.io`). Senza questo passaggio il login non funzionerà una volta online (in locale con `localhost` funziona già).

## Come pubblicarlo su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `gaming-relax`).
2. Carica tutti i file di questa cartella nella root del repository.
3. Vai su **Settings → Pages**.
4. In "Source" seleziona il branch `main` e la cartella `/ (root)`.
5. Salva: dopo qualche minuto il sito sarà online su `https://<tuo-utente>.github.io/gaming-relax/`.
6. Non dimenticare il punto 3 sopra (autorizzare il dominio in Firebase), altrimenti login e registrazione daranno errore online.

## Pagamenti (link Stripe per prodotto)

Non c'è un carrello multi-prodotto: ogni prodotto può avere un **link di pagamento Stripe** (creato gratis, senza scrivere codice, dal pannello Stripe → Payment Links). Se un prodotto ha questo link compilato nella Dashboard, nello Store il bottone diventa "Acquista" e porta dritto alla pagina di pagamento sicura di Stripe (carte Visa/Mastercard, PayPal e Revolut Pay, se li attivi nelle impostazioni Stripe). Se il campo è vuoto, resta il bottone "Richiedi" che porta al form Contatti — utile per servizi su preventivo o prodotti ancora da configurare.

Passaggi: crea un account su [stripe.com](https://stripe.com), attiva i metodi di pagamento che vuoi in Impostazioni → Payment methods, crea un link di pagamento per prodotto da Payment Links, e incolla l'URL nel campo "Link di pagamento Stripe" di quel prodotto nella Dashboard.

## Cosa completare prima di andare online

- **Immagini reali**: logo, foto team, foto prodotti, galleria Art. Nella Dashboard i campi "URL immagine" accettano un link diretto a un'immagine (puoi caricarla su un servizio come Imgur, o su un tuo hosting, e incollare qui il link).
- **Pagamenti reali nello Store**: vedi la sezione dedicata sopra ("Pagamenti (link Stripe per prodotto)").
- **Form contatti** (`contatti.html`): al momento mostra solo un messaggio di conferma, senza inviare nulla. Collegalo a [Formspree](https://formspree.io) o [EmailJS](https://www.emailjs.com), oppure a un tuo backend.
- **Link social**: sostituisci i link `#` di Discord, YouTube, Instagram, TikTok con quelli reali.
- **Testi legali**: Privacy Policy e Termini sono indicativi — fatti revisionare da un professionista prima della pubblicazione (nota anche che ora il sito raccoglie account utente: la Privacy Policy andrebbe aggiornata per menzionarlo esplicitamente).

## Estendere la Dashboard ad altre pagine

Il pattern usato per Prodotti / Team / Home è sempre lo stesso: una collezione Firestore + un form nella Dashboard che scrive su quella collezione + uno script "dinamico" nella pagina pubblica che la legge. Per rendere modificabile un'altra sezione (es. i testi della pagina Custom, o la galleria Art), si replica lo stesso schema di `home-dynamic.js` + un nuovo pannello in `dashboard.js`.

## Personalizzazione rapida

- Colori: variabili CSS in cima a `css/style.css` (`--lime`, `--purple`, `--bg`…).
- Font: Space Grotesk (titoli) + Inter (testo), caricati da Google Fonts.
- Menu e footer sono ripetuti in ogni pagina HTML (sito statico semplice, senza componenti); se in futuro vuoi evitare di modificare ogni file singolarmente, valuta un framework come Astro o degli include lato build.
