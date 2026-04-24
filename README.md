# CANAL-AI

**Caen-Nagoya Alliance for AI in Health Data** — a Franco-Japanese federated-
learning project predicting cardiovascular adverse events of hormone therapy
in prostate cancer, using hospital data warehouses at Caen University Hospital (France)
and Nagoya University Hospital (Japan).

> Only model parameters cross the border, never patient data
> (FedBioMed / OMOP-CDM / GDPR + APPI compliant).

Public site: **<https://basilechretien.github.io/CANAL-AI/>** (trilingual EN / 日本語 / FR).

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

## Team (principal investigators)

- **Basile Chrétien** — Principal investigator. Nagoya University, Graduate
  School of Medicine ([ORCID](https://orcid.org/0000-0002-7483-2489) ·
  [LinkedIn](https://www.linkedin.com/in/basile-chretien/)).
- **Dr Charles Dolladille** — French scientific responsible. Caen University Hospital
  Normandie, INSERM U1086 ANTICIPE
  ([ORCID](https://orcid.org/0000-0003-0449-6261) ·
  [LinkedIn](https://www.linkedin.com/in/charles-dolladille-30090b2b0/)).
- **Dr Kazuki Nishida** — Biostatistician. Nagoya University
  ([ORCID](https://orcid.org/0000-0003-0367-8557) ·
  [LinkedIn](https://www.linkedin.com/in/kazuki-nishida-509bb0272/)).

## Institutional partners

- **Nagoya University** — Graduate School of Medicine (Japanese side).
- **Caen University Hospital** — Entrepôt de Données de Santé,
  Department of Pharmacology, INSERM U1086 ANTICIPE (French clinical side).
- **Université de Caen Normandie** — institutional partner (French side).
- **FedBioMed** — INRIA / Université Côte d'Azur (methodology, in-kind).

Pilot funding: [SECOM](https://www.secom.co.jp/). Internal planning and
further collaborators are listed in gitignored documents only.

## Status (high level)

- Letter of Intent Nagoya ↔ Caen University Hospital: **signed**.
- Caen Scientific & Ethics Committee: **favourable opinion**.
- Nagoya IRB: **in progress**.
- French data-access convention: **in progress**.

## License

- **Code** (everything under `R/` and `python/`): MIT — see `LICENSE`.
- **Documentation and site content**: CC BY 4.0.

## Contact

Enquiries should be addressed through Nagoya University's Graduate School
of Medicine or through Caen University Hospital's Department of Pharmacology.
