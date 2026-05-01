# CANAL-AI

**Caen–Nagoya Alliance for AI in Health Data** — a Franco-Japanese
federated-learning **pilot** predicting cardiovascular adverse events of
hormone therapy in prostate cancer, using the hospital data warehouses
at Caen University Hospital (France) and Nagoya University Hospital
(Japan). The pilot is designed to seed a wider federated network of
additional partner hospitals.

> **Only model parameters cross the border. Patient data never moves.**
> FedBioMed · OMOP-CDM · designed for GDPR + APPI conformity.

**Public site:** <https://canal-ai.org/> —
trilingual EN / 日本語 / FR.

**Research-use-only pilot.** No patient data has been processed to date.
Caen Scientific & Ethics Committee favourable opinion (30 March 2026);
Nagoya IRB and GDPR DPIA in progress.

---

## At a glance

| | |
|---|---|
| Framework | [FedBioMed](https://fedbiomed.org/) — INRIA / Université Côte d'Azur |
| Primary model | PyTorch MLP on OMOP tabular features, trained with FedAvg (FedProx fallback) |
| Baseline | Federated logistic regression via FedBioMed's scikit-learn training plan (`FedSGDClassifier`) |
| Privacy | Joye-Libert secure aggregation; OPACUS differential privacy evaluated |
| Endpoint | 4-point MACE within 12 months of ADT initiation (HERO definition) |
| Evaluation | Leave-one-site-out — AUROC, AUPRC, calibration (Brier, ICI), DCA |
| Funder | [SECOM](https://www.secom.co.jp/) (first supporter) |

---

## Repository layout

```
CANAL-AI/
├── README.md                ← you are here
├── LICENSE                  ← code MIT + docs CC BY 4.0
├── .gitignore               ← patient data + internal docs + rosters
├── CANAL-AI.Rproj           ← RStudio project file
│
├── site/                    ← public GitHub Pages site (HTML + CSS + JS)
│   ├── index.html
│   ├── sitemap.xml
│   ├── robots.txt
│   └── assets/
│       ├── style.css
│       ├── i18n.json        ← EN / JA / FR dictionary
│       ├── i18n.js          ← vanilla-JS language runtime
│       ├── photos/          ← hero banner, team portraits (PNG + WebP)
│       └── logos/           ← institutional logos (PNG + WebP)
│
├── .github/workflows/
│   └── pages.yml            ← deploys site/ to GitHub Pages
│
├── docs/                    ← INTERNAL — gitignored, not public
├── admin/                   ← INTERNAL — gitignored, not public
│
├── R/                       ← R code for LOCAL analysis at each node
│   ├── 00_setup.R
│   ├── 01_data_import.R
│   ├── 02_harmonization_omop.R
│   ├── 03_cohort_definition.R
│   ├── 04_descriptive_table1.R
│   ├── 05_local_eval.R
│   ├── 99_utils.R
│   └── README.md
│
├── python/                  ← FedBioMed side (Python-based)
│   └── README.md
│
├── data/                    ← NEVER commit patient data
│   ├── README.md
│   └── .gitkeep
│
└── output/                  ← generated artefacts
    ├── README.md
    └── .gitkeep
```

---

## Roadmap (12–24 months)

| Window | Milestones |
|---|---|
| **Q2–Q3 2026** | Nagoya IRB submission · DPIA · Caen data-access convention · FedBioMed kickoff with INRIA/UCA |
| **Q4 2026** | OMOP variable list locked · Cohort definition frozen · Synthetic-data prototype end-to-end |
| **Q1–Q2 2027** | First federated round · MLP baseline with secure aggregation · Sample-size and power report |
| **Q3–Q4 2027** | Model comparison · Methods paper submitted · APPI–GDPR blueprint published (CC BY 4.0) |
| **2028** | External validation at a third site · Clinical paper · Open-source release of full pipeline |

---

## Team (principal investigators)

- **Dr Charles Dolladille** — MD, PhD, cardiologist and pharmacologist.
  MCU-PH, Caen University Hospital; INSERM U1086 ANTICIPE.
  [ORCID](https://orcid.org/0000-0003-0449-6261) · [LinkedIn](https://www.linkedin.com/in/charles-dolladille-30090b2b0/).
- **Dr Basile Chrétien** — PharmD, MPH, MSc, pharmacologist. PhD candidate,
  Nagoya University Graduate School of Medicine. On leave from Caen
  University Hospital.
  [ORCID](https://orcid.org/0000-0002-7483-2489) · [LinkedIn](https://www.linkedin.com/in/basile-chretien/).
- **Dr Kazuki Nishida** — MD, PhD, biostatistician with machine-learning
  expertise, Nagoya University.
  [ORCID](https://orcid.org/0000-0003-0367-8557) · [LinkedIn](https://www.linkedin.com/in/kazuki-nishida-509bb0272/).

## Institutional partners

- **Nagoya University** — Graduate School of Medicine (Japanese side).
- **Nagoya University Hospital** — clinical and data-warehouse partner.
- **Caen University Hospital** — Entrepôt de Données de Santé, Department
  of Pharmacology, INSERM U1086 ANTICIPE.
- **Université de Caen Normandie** — French institutional partner.
- **FedBioMed** — INRIA / Université Côte d'Azur (methodology, in-kind).

Further collaborators are acknowledged on the [public site](https://canal-ai.org/#ack);
internal planning is tracked in gitignored documents.

---

## Public website (site/)

The trilingual landing page is deployed by `.github/workflows/pages.yml`
on every push to `main` that touches `site/**`.

To enable after first push:

1. **Settings → Pages**
2. **Source**: *GitHub Actions*
3. Push to `main` — the workflow publishes to
   <https://canal-ai.org/>.

Local preview:

```bash
python -m http.server --directory site 8080
# http://localhost:8080
```

Language override via URL hash: `…#lang=ja` or `…#lang=fr`. Preference
is persisted in `localStorage`.

---

## Quick start (after `git clone`)

1. Open `CANAL-AI.Rproj` in RStudio.
2. Install R dependencies — see `R/00_setup.R`.
3. Internal planning documents (charter, team roster, status, timeline,
   governance, protocol, glossary) live in `docs/` and `admin/` and are
   **not** tracked by git. Contact the project PI for access.

---

## Calls to action

- **Funders** — see <https://canal-ai.org/#fund>.
  Target pilot budget ≈ €450k over 24 months. SECOM has committed the
  first tranche; additional funders are warmly welcome.
- **Partner hospitals** — see <https://canal-ai.org/#join>.
  Requirements: a structured data warehouse, willingness to harmonise to
  OMOP-CDM, local IRB support, willingness to participate in federated
  learning, and a workstation capable of running a FedBioMed node.

---

## License

- **Code** (everything under `R/` and `python/`): MIT — see `LICENSE`.
- **Documentation and site content**: CC BY 4.0.
- **Portraits** of individuals displayed on the site are shown with the
  subject's permission; photograph rights are reserved by the subject
  and the photographer.

## Contact

Enquiries are best addressed through the single "Email the team" button
on the public site (<https://canal-ai.org/#contact>),
which reaches the three principal investigators in one message. For
institutional correspondence, write to Nagoya University's Graduate
School of Medicine or to Caen University Hospital's Department of
Pharmacology.
