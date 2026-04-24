# 02_harmonization_omop.R ----------------------------------------------
# CANAL-AI — harmonise the site's raw data to the OMOP-CDM.
# The output of this script is a CDM-shaped set of tables that can be
# consumed identically by 03_cohort_definition.R at either site.
# -----------------------------------------------------------------------

stopifnot(exists("CONFIG"), exists("log_msg"))

# 1. Variable dictionary ------------------------------------------------
# The canonical variable list for CANAL-AI — OMOP concept IDs, units,
# and site-specific source mappings — lives in docs/ (to be drafted).
# This script reads that dictionary and applies it.

VAR_DICT_PATH <- file.path(PATHS$docs, "variable_dictionary.yml")

if (file.exists(VAR_DICT_PATH)) {
  var_dict <- yaml::read_yaml(VAR_DICT_PATH)
} else {
  log_msg("variable_dictionary.yml not found — using empty stub.")
  var_dict <- list()
}

# 2. Map source codes to OMOP concept IDs -------------------------------
# Handles: ICD-10 → condition_concept_id; ATC → drug_concept_id; etc.
# Use the Athena vocabulary release agreed upon at project start.
#
# Example signature:
#   map_icd10_to_omop <- function(icd_codes, vocab) { ... }

map_icd10_to_omop <- function(icd_codes, vocab) {
  # TODO
  tibble::tibble(source = icd_codes, concept_id = NA_integer_)
}

map_atc_to_omop <- function(atc_codes, vocab) {
  # TODO
  tibble::tibble(source = atc_codes, concept_id = NA_integer_)
}

# 3. Build the CDM-shaped tables ---------------------------------------
# build_person(), build_condition_occurrence(), build_drug_exposure() etc.
# Each takes the raw tables and returns a CDM-conformant tibble.

# TODO: implement once the variable dictionary is locked.

log_msg("02_harmonization_omop.R complete.")
