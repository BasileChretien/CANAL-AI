# 01_data_import.R ------------------------------------------------------
# CANAL-AI — import the raw cohort from the local hospital data warehouse.
# This script is SITE-SPECIFIC: the implementation differs between Caen
# (EDS, PostgreSQL / OMOP-CDM) and Nagoya (HDW, local schema).
# -----------------------------------------------------------------------

# Dependencies already loaded by 00_setup.R.

stopifnot(exists("CONFIG"), exists("PATHS"), exists("log_msg"))

# 1. Open connection ----------------------------------------------------
# Prefer parameterised connections via DBI + a site-appropriate driver.
# Connection code intentionally left as a stub — each site fills its own.
#
# Example (Caen / PostgreSQL):
#   con <- DBI::dbConnect(
#     RPostgres::Postgres(),
#     host = CONFIG$db$host, port = CONFIG$db$port,
#     dbname = CONFIG$db$dbname, user = CONFIG$db$user
#   )
#
# Example (Nagoya / SQL Server):
#   con <- DBI::dbConnect(odbc::odbc(), "NagoyaHDW")
#
# Always use read-only credentials.

con <- NULL  # fill at each site

# 2. Pull raw tables ----------------------------------------------------
# Keep the import scope minimal and explicit. Do not pull free-text notes
# or imaging. Do not pull patients outside the study window.
#
# Suggested minimal set (mapped to OMOP in 02_harmonization_omop.R):
#   - person
#   - visit_occurrence
#   - condition_occurrence
#   - drug_exposure
#   - measurement
#   - procedure_occurrence
#   - death

import_eds_caen <- function(con) {
  stopifnot(!is.null(con))
  # TODO: implement. Return a named list of tibbles.
  stop("Caen EDS import not implemented yet.")
}

import_hdw_nagoya <- function(con) {
  stopifnot(!is.null(con))
  # TODO: implement. Return a named list of tibbles mappable to OMOP.
  stop("Nagoya HDW import not implemented yet.")
}

# 3. Dispatch by site ---------------------------------------------------
raw <- switch(
  CONFIG$site,
  caen    = import_eds_caen(con),
  nagoya  = import_hdw_nagoya(con),
  dev     = {
    log_msg("Dev mode — generating a synthetic placeholder.")
    list(person = tibble::tibble())
  },
  stop("Unknown site in config: ", CONFIG$site)
)

# 4. Persist a local, encrypted snapshot (outside git) ------------------
# Persistence is site-dependent. Typical: a parquet / fst file under
# CONFIG$paths$local_extract, NEVER under data/ in the git repo.

log_msg("01_data_import.R complete. Site: ", CONFIG$site)
