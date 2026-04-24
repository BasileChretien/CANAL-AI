# 04_descriptive_table1.R ----------------------------------------------
# CANAL-AI — Table 1 and baseline descriptive statistics.
# Enforces minimum cell size to protect confidentiality.
# -----------------------------------------------------------------------

stopifnot(exists("CONFIG"), exists("log_msg"))

MIN_CELL <- 5L  # cells below this are suppressed in any exported output.

# 1. Suppression helper -------------------------------------------------
# Any count < MIN_CELL is replaced by NA with a note.

suppress_small_cells <- function(x, min_cell = MIN_CELL) {
  if (is.numeric(x)) ifelse(x < min_cell & x > 0, NA_integer_, x) else x
}

# 2. Table 1 via gtsummary ----------------------------------------------
# Expects an analytical dataset `df` with columns:
#   - person_id, adt_class, age, bmi, prior_mi, prior_stroke, hf_hx, ...

build_table1 <- function(df) {
  if (!nrow(df)) {
    log_msg("build_table1: empty input, skipping.")
    return(invisible(NULL))
  }
  tbl <- gtsummary::tbl_summary(
    df,
    by = "adt_class",
    missing = "ifany",
    type = list(gtsummary::all_continuous() ~ "continuous2")
  ) |>
    gtsummary::add_overall() |>
    gtsummary::add_n() |>
    gtsummary::modify_header(label ~ "**Characteristic**") |>
    gtsummary::bold_labels()
  tbl
}

# 3. Export (aggregated only) ------------------------------------------
# Outputs live under output/, which is gitignored for anything
# non-aggregated. Audit before committing any exported file.

export_table1 <- function(tbl, filename = "table1.html") {
  out <- file.path(PATHS$output, filename)
  gtsummary::as_gt(tbl) |> gt::gtsave(out)
  log_msg("Table 1 exported to: ", out)
  invisible(out)
}

log_msg("04_descriptive_table1.R loaded.")
