# data/ — intentionally empty

**No patient data is ever committed to this repository.**

This folder exists only to anchor the path structure (`here::here("data")`
in R, `Path(__file__).parent.parent / "data"` in Python). Everything inside
it except this `README.md` and the `.gitkeep` sentinel is gitignored.

## Where the real data lives

- **Caen side.** Inside the CHU de Caen Entrepôt de Données de Santé
  infrastructure, accessed via a collaborateur-bénévole arrangement
  under the French scientific responsible. Extracts stay on the
  hospital's secure storage.
- **Nagoya side.** Inside Nagoya University Hospital's Data Warehouse
  infrastructure. Extracts stay on the hospital's secure storage.

The site-level path is specified in each site's local `config.yml` under
`paths.local_extract` (see `R/00_setup.R`). That `config.yml` is
gitignored and must never be committed.

## What MAY go in `data/` during local work

During development only, the following may be placed in `data/` **on a
local machine** (still gitignored):

- Synthetic test fixtures (generated, not derived from real patients).
- OMOP vocabulary files from Athena (large; keep outside git anyway).
- Dictionary / codelist drafts in YAML form — these may be committed
  if they contain no patient-derived information; place them under
  `docs/` instead to make that status explicit.

## What MUST NEVER go in `data/`

- Patient identifiers, direct or indirect.
- Row-level tabular extracts.
- Free-text clinical notes or imaging.
- Any aggregated cell with a count below 5.

If you accidentally commit any file that should not be here: stop, do
not push, and `git rm --cached` the file. If it already reached a remote,
rotate credentials and follow the site's incident-response procedure
(documented internally).
