# site/

Public landing page for CANAL-AI, deployed to GitHub Pages by
`.github/workflows/pages.yml` on every push to `main` that touches
this folder.

## Local preview

No build step — it is plain HTML + CSS. Open `site/index.html` directly
in a browser, or serve the folder:

```bash
python -m http.server --directory site 8080
# then visit http://localhost:8080
```

## Enabling GitHub Pages

After the first push:

1. GitHub → **Settings** → **Pages**.
2. **Source**: *GitHub Actions*.
3. Push to `main`; the workflow will publish the site.

## What belongs here

Only public-facing content: project description, institutional partners,
high-level status, planned outputs. **No individual names**, no dates
tied to private correspondence, no IRB details beyond the fact that
review is sought. Internal planning docs live in `docs/` and `admin/`
and are gitignored.
