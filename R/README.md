# R/ — local analysis pipeline

The R code here runs **locally at each federated node** (Caen and Nagoya).
It covers data import from the local warehouse, OMOP-CDM harmonisation,
cohort definition, descriptive analysis, and *local* model evaluation.

The **federated training itself** is orchestrated by the FedBioMed
Python stack — see `../python/README.md`. R and Python coexist at each
node; R prepares the local analytical dataset, Python runs the federated
training on top of it.

## Numbered scripts

| Script | Purpose |
|---|---|
| `00_setup.R` | Environment, packages, paths, config. Run first. |
| `01_data_import.R` | Connect to the local HDW / EDS and pull the raw cohort. Stub — site-specific. |
| `02_harmonization_omop.R` | Map local tables to OMOP-CDM. Stub. |
| `03_cohort_definition.R` | Apply inclusion / exclusion; produce the analytical cohort. |
| `04_descriptive_table1.R` | Table 1 — aggregates only, cells ≥ 5. |
| `05_local_eval.R` | Local evaluation metrics on a locally-trained baseline model. |
| `99_utils.R` | Helpers loaded by all other scripts. |

Run the pipeline with:

```r
source("R/00_setup.R")
source("R/99_utils.R")
source("R/01_data_import.R")
source("R/02_harmonization_omop.R")
source("R/03_cohort_definition.R")
source("R/04_descriptive_table1.R")
source("R/05_local_eval.R")
```

Or — preferred once `targets` is set up — declare dependencies in a
`_targets.R` pipeline to avoid re-running unchanged steps.

## Conventions

- Tidyverse idioms (`dplyr`, `tidyr`, `purrr`, `lubridate`, `stringr`).
- Date handling via `lubridate`.
- Survival analysis via `survival` and `survminer` where needed.
- OMOP-CDM tooling: `CDMConnector`, `CohortConstructor`, `PatientProfiles`
  (HADES ecosystem).
- Reporting: `gt`, `gtsummary`, `flextable`.
- No patient-level data in any printed / logged / committed output.

## Environment

After the first run, `renv::snapshot()` should be executed to lock
dependencies. The resulting `renv.lock` is committed; the `renv/library`
directory is not.
