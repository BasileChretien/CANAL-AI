# python/ — FedBioMed federated-training side

CANAL-AI's **federated training** runs on the FedBioMed framework
(https://fedbiomed.org/), which is Python-based. The R code under `../R/`
handles local data import, OMOP-CDM harmonisation, cohort construction
and descriptive statistics at each site; Python takes over from there.

This folder is currently a pointer, not an implementation — the actual
FedBioMed node code will be added here (or in a submodule) once the
kickoff meeting with the INRIA / Université Côte d'Azur team takes
place in 2026 Q2. See `../docs/04_timeline.md`.

## What will live here (planned)

```
python/
├── nodes/
│   ├── caen_node/           # site-specific node config & data loader
│   └── nagoya_node/         # site-specific node config & data loader
├── researcher/              # orchestrator scripts (training rounds, aggregation)
├── models/
│   ├── mlp.py               # Multi-Layer Perceptron
│   ├── tabnet.py            # TabNet (attention-based tabular)
│   └── fed_xgb.py           # Federated XGBoost variant
├── evaluation/              # per-site + global AUC, calibration, DCA
├── pyproject.toml           # or requirements.txt / uv.lock
└── README.md                # this file (expanded)
```

## Environment (expected)

- Python ≥ 3.10.
- FedBioMed (version pinned once kickoff meeting finalises it).
- PyTorch for MLP and TabNet.
- `xgboost` for the federated XGBoost variant.
- `scikit-learn` for evaluation utilities.
- `shap` for post-hoc interpretability outside federated training.

Dependency management: `uv` preferred, `pip + venv` acceptable. Lock file
committed; virtual environments are not (see `.gitignore`).

## How R and Python interoperate

- R writes a **local analytical dataset** (parquet) under the site's
  secure path — see `CONFIG$paths$local_extract` in `R/00_setup.R`.
- The Python node reads that parquet from its secure path, never from
  `data/` in this repo.
- No R → Python runtime bridge (`reticulate`) is planned; the two
  languages exchange files on disk, inside each site's trust perimeter.

## What does NOT belong here

- Any patient-level data.
- Any hospital-specific credentials (those go in the gitignored
  site-level `config.yml`).
- The FedBioMed server/aggregator code itself — that's upstream, and
  we pin a version rather than vendoring it.

## Coordination

Primary FedBioMed contact: the INRIA / Université Côte d'Azur team
(pro-bono methodological contribution — see `../docs/02_team.md`).
