# R89 Repairs — mockup one-page (HTML + CSS)

Mockup static pentru viitorul site multipage (Apache + PHP + MySQL). Toate „paginile”
sunt secțiuni `<section class="page" id="...">` într-un singur `index.html`; meniul
navighează prin ancore. Structura a fost gândită astfel încât fiecare secțiune să
devină un fișier PHP fără modificări de CSS.

## Rulare

```bash
cd r89-repairs-mockup
python3 -m http.server 8089
# http://localhost:8089/
```

(Se poate deschide și direct `index.html`; harta Google din Contact și fonturile
au nevoie de internet.)

## Structură

```
index.html        toate paginile, cu comentarii <!-- PAGINA: ... --> la fiecare
css/style.css     tokens, componente, header/footer, secțiuni, formulare, responsive
js/main.js        meniu mobil, dropdown pe touch, link activ, formulare mock
img/              hero-motherboard.jpg, laptop.jpg, macbook.jpg, playstation.jpg, xbox.jpg
img/reviews/      avatarurile recenzenților Google (5 fișiere)
```

## Mapare secțiuni → pagini PHP

| Ancoră (mockup)            | Fișier PHP propus                   | URL final                     |
|----------------------------|-------------------------------------|-------------------------------|
| `#acasa`                   | `index.php`                         | `/`                           |
| `#despre-noi`              | `despre-noi.php`                    | `/despre-noi`                 |
| `#servicii`                | `servicii.php`                      | `/servicii`                   |
| `#servicii-laptopuri`      | `servicii/laptopuri.php`            | `/servicii/laptopuri`         |
| `#servicii-macbook`        | `servicii/macbook.php`              | `/servicii/macbook`           |
| `#servicii-playstation`    | `servicii/playstation.php`          | `/servicii/playstation`       |
| `#servicii-xbox`           | `servicii/xbox.php`                 | `/servicii/xbox`              |
| `#reparatii-prin-curier`   | `reparatii-prin-curier.php`         | `/reparatii-prin-curier`      |
| `#colaborari-b2b`          | `colaborari-b2b.php`                | `/colaborari-b2b`             |
| `#contact`                 | `contact.php`                       | `/contact`                    |
| `#solicita-reparatie`      | `solicita-reparatie.php`            | `/solicita-reparatie`         |
| `#termeni-si-conditii`     | `termeni-si-conditii.php`           | `/termeni-si-conditii`        |
| `#confidentialitate`       | `politica-de-confidentialitate.php` | `/politica-de-confidentialitate` |
| `#recenzii`, `#articole`   | secțiuni din homepage; blogul devine `articole.php` + `articol.php?slug=` |

Pași de conversie:

1. Blocurile marcate `HEADER` (topbar + `<header>`) și `FOOTER` devin
   `partials/header.php` și `partials/footer.php`; sprite-ul SVG de iconițe devine
   `partials/icons.php`, inclus o dată în header.
2. Fiecare `<section class="page">` se mută în fișierul PHP din tabel, cu
   `<?php include 'partials/header.php'; ?>` deasupra și footer-ul dedesubt.
   Se elimină clasa `page` și id-ul de ancoră (sau se păstrează, nu deranjează).
3. Toate `href="#ancora"` din meniu, footer și butoane se înlocuiesc cu URL-urile
   din tabel. Link-urile `data-equip="..."` de pe paginile de serviciu devin
   `solicita-reparatie.php?echipament=laptop|macbook|playstation|xbox`, iar
   select-ul se preselectează din `$_GET`.
4. Paginile de serviciu au aceeași structură; se poate face un singur
   `servicii/echipament.php` care citește conținutul dintr-un array sau din DB.
5. Recenziile Google: în mockup sunt statice (preluate din Places API la data
   construirii). În producție se pot reîmprospăta periodic printr-un cron PHP care
   apelează Places API (New) cu place ID `ChIJPTk44pSZRUcRU7HsozK1lY4` și cid
   `10274317354018845011`, salvând rezultatul în DB.

## Formulare → tabele MySQL (propunere)

Toate formularele au deja atribute `name` și `method="post"`; în mockup sunt
interceptate de `js/main.js` (`data-mock`) și afișează un mesaj de confirmare.

**`solicitari_reparatie`** (formularul „Solicită reparație”)
`id, nume, telefon, email, adresa, localitate, judet, echipament ENUM(laptop,macbook,
playstation,xbox), model, descriere, predare ENUM(personal,curier), termeni TINYINT,
acord_contact TINYINT, status, created_at`

**`mesaje_contact`** (formularul din Contact)
`id, nume, telefon, email, subiect, mesaj, gdpr TINYINT, created_at`

**`cereri_b2b`** (formularul din Colaborări B2B)
`id, firma, persoana, telefon, email, tip_activitate, volum, mesaj, gdpr TINYINT, created_at`

**`recenzii_google`** (opțional, pentru afișare din DB)
`id, autor, avatar_url, rating, text, publicat_la, relativ, google_url, fetched_at`

## De completat / verificat înainte de producție

- Denumirea juridică a firmei și CUI (în Termeni și în footer).
- Fotografii reale din atelier (secțiunea „Despre noi” folosește acum imaginea din hero).
- Perioadele exacte de garanție, condițiile de retur pentru echipamente nereparate,
  metodele de plată acceptate (textele actuale sunt formulate general).
- Articolele din blog: în mockup sunt trei titluri reale de pe site-ul vechi, cu
  link către `#articole`.
- Cheia Google Maps pentru harta din Contact nu este necesară (iframe `output=embed`).
