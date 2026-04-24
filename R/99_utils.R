# 99_utils.R -----------------------------------------------------------
# CANAL-AI — helpers shared by the numbered scripts.
# Kept intentionally small and side-effect free.
# -----------------------------------------------------------------------

# Safe divide ----------------------------------------------------------
safe_div <- function(num, den) ifelse(den == 0, NA_real_, num / den)

# Age in years at a reference date -------------------------------------
age_at <- function(birthdate, ref_date) {
  stopifnot(inherits(birthdate, "Date"), inherits(ref_date, "Date"))
  as.integer(floor(as.numeric(difftime(ref_date, birthdate, units = "days")) / 365.25))
}

# Coalesce-first-non-NA -------------------------------------------------
coalesce_first <- function(...) {
  args <- list(...)
  Reduce(function(a, b) ifelse(is.na(a), b, a), args)
}

# Hash an identifier deterministically (for *local* cross-referencing,
# never for export) ----------------------------------------------------
local_hash <- function(x, salt = "CANAL-AI-local") {
  vapply(as.character(x),
         function(v) digest::digest(paste0(salt, v), algo = "sha256"),
         character(1))
}

# Aggregate check: refuses to return rows under the min-cell threshold -
safe_aggregate <- function(df, by, min_cell = 5L) {
  out <- df |>
    dplyr::count(dplyr::across(dplyr::all_of(by)), name = "n")
  out$n <- ifelse(out$n < min_cell, NA_integer_, out$n)
  out
}

# Human-friendly file timestamp suffix ---------------------------------
ts_suffix <- function() format(Sys.time(), "%Y%m%d_%H%M%S")
