# output/ — generated artefacts

Tables, figures, logs, model cards, and other artefacts produced by the
pipeline. Everything inside `output/` except this `README.md` and the
`.gitkeep` sentinel is gitignored by default.

## Commit policy

Committing any file from this folder is a **deliberate** act, not the
default. Before `git add output/something`:

1. Confirm the file contains only aggregated information (cells ≥ 5).
2. Confirm no patient identifiers, hashes of identifiers, or free-text
   clinical content.
3. Confirm the file will be useful to reviewers / co-authors / reviewers
   (i.e., it is not a transient debugging output).
4. Prefer adding figures for publication to a dedicated `output/paper/`
   subfolder with a short explanatory note.

## Suggested layout (as the project grows)

```
output/
├── tables/
│   ├── table1.html          # aggregated baseline (gitignored until reviewed)
│   └── ...
├── figures/
│   ├── flow_diagram.pdf
│   ├── calibration_plot.pdf
│   └── ...
├── model_cards/
│   └── mlp_v1.md            # TRIPOD-AI-style model card
├── logs/                    # always gitignored
└── blueprint/               # drafts of the APPI–GDPR operational blueprint
```
