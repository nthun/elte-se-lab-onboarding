# S&E Lab Onboarding course

Onboarding course for new members of the ELTE Stress and Emotions Lab, built with [Quarto](https://quarto.org/) and [Quarto Live](https://r-wasm.github.io/quarto-live/).

- **Course site:** <https://nthun.github.io/elte-se-lab-onboarding/>
- **Original slide deck** (the course's source, lab members only): [Onboarding slide deck – Stress and Emotions lab](https://docs.google.com/presentation/d/1S_NBHGPXC1FEa-DpTeM41DyW_IjRz2QM3kzvfi3lt7c/edit)

## Structure

```
_quarto.yml            site config, sidebar, theme
_variables.yml         all checkpoint Form links and shared URLs (edit here once)
index.qmd              start page: how the course works, BA track
modules/01–07-*.qmd    one page per module
modules/progress.qmd   checkpoint quiz links and how completion works
assets/quiz.html       self-check quiz script (no R needed)
assets/quiz.css        quiz styling
assets/custom.scss     theme tweaks and the BA tag
_extensions/r-wasm/live  Quarto Live (in-browser R exercises)
```

Each module follows the same pattern: **Read** → **Do** (mirrored as a checklist in the ClickUp onboarding task) → **Check yourself** (self-check quizzes on the page) → **Checkpoint** (graded Google Form).

## Editing

### Self-check questions

Write a fenced `quiz` div with a markdown task list. `[x]` marks correct options. More than one `[x]` turns it into a "select all that apply" question. An optional `explain` div is revealed after answering.

```markdown
::: quiz
Where should a project decision be recorded?

- [ ] In a Slack thread
- [x] In the project's documents or ClickUp task

::: explain
Slack history is limited; decisions go into documents or ClickUp.
:::
:::
```

These are for self-study, not assessment: the correct answers are visible in the page source. Graded checks live in the Google Forms.

### Checkpoint quizzes

Create one Google Form per module in quiz mode, then paste its link into `_variables.yml` (replacing the `REPLACE-ME` placeholders). Every page picks the links up automatically. The course text says the pass mark is 80%; change it in `modules/progress.qmd` if you set a different one.

### R exercises (module 6)

Module 6 uses `format: live-html` and `engine: markdown`, so R code runs in the reader's browser via webR. Building the site does **not** need R. Exercise syntax (setup / exercise / check blocks, hints, solutions) is documented in the [Quarto Live docs](https://r-wasm.github.io/quarto-live/exercises/exercises.html).

### BA track

Tag a section heading with `[BA]{.ba-tag}` to mark it as required for BA students.

## Preview and publish

```bash
quarto preview          # local preview with live reload
quarto render           # build into _site/
```

To publish on GitHub Pages, push the repository to GitHub, then in **Settings → Pages** set the source to **GitHub Actions**. The workflow in `.github/workflows/publish.yml` renders and deploys the site on every push to `main`.

## Keep internal details out

This site is public. Don't add passwords, server addresses, account names or participant information. Internal details (e.g., the lab's experiment server) are handed over by the project supervisor.
