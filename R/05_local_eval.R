# 05_local_eval.R ------------------------------------------------------
# CANAL-AI — local (non-federated) baseline model for sanity-checking
# and calibration reference. Produces discrimination / calibration
# metrics that stay inside the site.
#
# The federated training itself is done in Python with FedBioMed — see
# ../python/README.md. This script is NOT the federated pipeline; it is
# the local reality check.
# -----------------------------------------------------------------------

stopifnot(exists("CONFIG"), exists("log_msg"))

# 1. Train-test split (local, stratified on outcome) --------------------
split_local <- function(df, outcome_col = "mace_24m", test_frac = 0.2,
                        seed = 1729) {
  set.seed(seed)
  idx <- sample(seq_len(nrow(df)),
                size = floor(test_frac * nrow(df)))
  list(train = df[-idx, ], test = df[idx, ])
}

# 2. A modest baseline: logistic regression -----------------------------
# Intentionally simple. The federated deep models live in Python.
fit_local_baseline <- function(train, formula) {
  glm(formula, data = train, family = binomial(link = "logit"))
}

# 3. Discrimination + calibration --------------------------------------
eval_local <- function(model, test, outcome_col = "mace_24m") {
  pred <- predict(model, newdata = test, type = "response")
  y    <- test[[outcome_col]]
  # AUC via the tidymodels-style pROC package if available
  auc <- tryCatch(
    as.numeric(pROC::auc(pROC::roc(y, pred, quiet = TRUE))),
    error = function(e) NA_real_
  )
  # Brier
  brier <- mean((pred - y)^2, na.rm = TRUE)
  # Calibration slope/intercept
  lp <- qlogis(pmin(pmax(pred, 1e-6), 1 - 1e-6))
  cal_fit <- tryCatch(
    glm(y ~ lp, family = binomial(link = "logit")),
    error = function(e) NULL
  )
  cal_slope <- if (!is.null(cal_fit)) coef(cal_fit)[2] else NA_real_
  cal_intercept <- if (!is.null(cal_fit)) coef(cal_fit)[1] else NA_real_
  list(
    auc = auc,
    brier = brier,
    calibration_slope = unname(cal_slope),
    calibration_intercept = unname(cal_intercept),
    n = nrow(test)
  )
}

log_msg("05_local_eval.R loaded.")
