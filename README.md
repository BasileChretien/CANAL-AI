# CANAL-AI

**Caen-Nagoya Alliance for AI in Health Data** — a Franco-Japanese federated-
learning project predicting cardiovascular adverse events of hormone therapy
in prostate cancer, using hospital data warehouses at CHU de Caen (France)
and Nagoya University Hospital (Japan).

> Only model parameters cross the border, never patient data
> (FedBioMed / OMOP-CDM / GDPR + APPI compliant).

Public site: **<https://>** *(enable GitHub Pages from the `site/` folder — see below.)*

---

## Repository layout

```
CANAL-AI/
├── README.md               ← you are here
├── LICENSE                 ← code license (MIT) + docs notice (CC BY 4.0)
├── .gitignore              ← patient data + internal docs + participant names
├── CANAL-AI.Rproj          ← RStudio project file
│
├── site/                   ← public GitHub Pages site (HTML + CSS)
│   ├── index.html
│   └── assets/style.css
│
├── .github/workflows/
│   └── pages.yml           ← deploys site/ to GitHub Pages
│
├── docs/                   ← INTERNAL — gitignored, not public
├── admin/                  ← INTERNAL — gitignored, not public
│
├── R/                      ← R code for LOCAL analysis at each node
│   ├── 00_setup.R
│   ├── 01_data_import.R
│   ├── 02_harmonization_omop.R
│   ├── 03_cohort_definition.R
│   ├── 04_descriptive_table1.R
│   ├── 05_local_eval.R
│   ├── 99_utils.R
│   └── README.md
│
├── python/                 ← pointer to the FedBioMed side (Python-based)
│   └── README.md
│
├── data/                   ← NEVER commit patient data — see data/README.md
│   ├── README.md
│   └── .gitkeep
│
└── output/                 ← generated artefacts (figures, tables, logs)
    ├── README.md
    └── .gitkeep
```

---

## Quick start (after `git clone`)

1. Open `CANAL-AI.Rproj` in RStudio (sets the working directory).
2. Install dependencies: see `R/00_setup.R`.
3. Internal planning documents (charter, team roster, status, timeline,
   governance, protocol, glossary) live in `docs/` and `admin/` and are
   **not** tracked by git. Contact the project PI for access.

## Public website

The landing page at `site/` is deployed by the workflow in
`.github/workflows/pages.yml`. To enable it:

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. The next push to `main` will publish the site.

Local preview:

```bash
python -m http.server --directory site 8080
# http://localhost:8080
```

## Partners

- **Nagoya University** — Graduate School of Medicine (Japanese side).
- **CHU de Caen Normandie** — Entrepôt de Données de Santé,
  Department of Pharmacology, INSERM U1086 ANTICIPE (French clinical side).
- **Université de Caen Normandie** — institutional partner (French side).
- **FedBioMed** — INRIA / Université Côte d'Azur (methodology, in-kind).

Individual collaborators are listed in internal documents only.

## Status (high level)

- Letter of Intent Nagoya ↔ CHU de Caen: **signed**.
- Caen Scientific & Ethics Committee: **favourable opinion**.
- Nagoya IRB: **in progress**.
- French data-access convention: **in progress**.

## License

- **Code** (everything under `R/` and `python/`): MIT — see `LICENSE`.
- **Documentation and site content**: CC BY 4.0.

## Contact

Enquiries should be addressed through Nagoya University's Graduate School
of Medicine or through CHU de Caen's Department of Pharmacology.
