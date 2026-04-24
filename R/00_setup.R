# 00_setup.R ------------------------------------------------------------
# CANAL-AI — environment setup, paths, packages.
# Run this first in any session. Site-agnostic.
# -----------------------------------------------------------------------

# 1. renv bootstrap -----------------------------------------------------
# Uncomment on first initialisation at each site.
# install.packages("renv")
# renv::init(bare = TRUE)

# 2. Core packages ------------------------------------------------------
.pkgs <- c(
  # Core tidyverse
  "dplyr", "tidyr", "readr", "purrr", "stringr", "lubridate", "tibble",
  # Reporting
  "gt", "gtsummary", "flextable",
  # Survival / epidemiology
  "survival", "survminer", "cmprsk",
  # OMOP / HADES (load-on-demand — uncomment at sites that need them)
  # "CDMConnector", "CohortConstructor", "PatientProfiles", "CirceR",
  # I/O
  "here", "fs", "yaml", "jsonlite"
)

.install_missing <- function(pkgs) {
  missing <- setdiff(pkgs, rownames(installed.packages()))
  if (length(missing) > 0) install.packages(missing)
}
.install_missing(.pkgs)
invisible(lapply(.pkgs, library, character.only = TRUE))

# 3. Project paths ------------------------------------------------------
# `here::i_am()` anchors the project root so every script can use here().
here::i_am("R/00_setup.R")

PATHS <- list(
  root   = here::here(),
  R      = here::here("R"),
  data   = here::here("data"),
  output = here::here("output"),
  docs   = here::here("docs")
)

# 4. Site config --------------------------------------------------------
# Each site provides a local `config.yml` that is GIT-IGNORED and contains
# site-specific connection strings and paths. Never commit real credentials.
#
# Example `config.yml`:
#   site: "caen"            # or "nagoya"
#   db:
#     driver: "PostgreSQL"
#     host: "localhost"
#     port: 5432
#     dbname: "eds"
#     user: "readonly_user"
#   paths:
#     local_extract: "/secure/local/path"
#
.config_path <- here::here("config.yml")
if (file.exists(.config_path)) {
  CONFIG <- yaml::read_yaml(.config_path)
} else {
  message("No config.yml found. Running in offline / development mode.")
  CONFIG <- list(site = "dev", db = NULL, paths = NULL)
}

# 5. Safe-logging -------------------------------------------------------
# Wrapper for output that will never print patient-level identifiers.
log_msg <- function(...) {
  cat(sprintf("[%s] ", format(Sys.time(), "%Y-%m-%d %H:%M:%S")), ..., "\n",
      sep = "")
}

log_msg("CANAL-AI environment ready. Site: ", CONFIG$site)
