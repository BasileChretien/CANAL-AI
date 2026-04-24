# 03_cohort_definition.R -----------------------------------------------
# CANAL-AI — apply inclusion / exclusion criteria and produce the final
# analytical cohort. Input: CDM-shaped tables from 02_harmonization_omop.R.
# -----------------------------------------------------------------------

stopifnot(exists("CONFIG"), exists("log_msg"))

# 1. Study window -------------------------------------------------------
STUDY_START <- as.Date("2018-01-01")
STUDY_END   <- as.Date("2025-12-31")
FOLLOWUP_MONTHS <- 24

# 2. ADT drug classes ---------------------------------------------------
# These sets will be resolved to OMOP concept IDs via the variable
# dictionary (see 02_harmonization_omop.R).

adt_classes <- list(
  gnrh_agonist    = c("leuprorelin", "goserelin", "triptorelin", "buserelin"),
  gnrh_antagonist = c("degarelix", "relugolix"),
  arsi            = c("enzalutamide", "apalutamide", "darolutamide",
                     "abiraterone")
)

# 3. Inclusion ----------------------------------------------------------
# - Adult males, prostate-cancer diagnosis on or before index.
# - First ADT drug_exposure within [STUDY_START, STUDY_END].

apply_inclusion <- function(cdm) {
  # TODO: implement using CohortConstructor / PatientProfiles.
  tibble::tibble(person_id = integer(), index_date = as.Date(character()),
                 adt_class = character())
}

# 4. Exclusion ----------------------------------------------------------
# - Prior MACE within 12 months before index.
# - Life expectancy < 6 months (as documented / inferable from records).
# - Enrolled in a cardiovascular interventional trial changing ADT choice.
# - Exercised opt-out.

apply_exclusion <- function(cohort, cdm) {
  # TODO: implement.
  cohort
}

# 5. Outcome operationalisation -----------------------------------------
# MACE composite: MI (I21/I22), ischaemic stroke (I63), HF hospitalisation
# (I50), cardiovascular death (I00–I99 underlying cause). 24-month window.

build_mace <- function(cohort, cdm) {
  # TODO: implement.
  cohort
}

# 6. Final analytical dataset -------------------------------------------
# Joins baseline covariates, exposure, outcomes; returns a single tibble
# ready for 04_descriptive_table1.R and the federated training.

build_analytical_dataset <- function(cohort, cdm) {
  # TODO: implement.
  cohort
}

log_msg("03_cohort_definition.R complete. (stub — no rows produced)")
