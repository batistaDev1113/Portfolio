<!-- .github/pr-body-template.md
     Compact fill-in body for human-initiated PRs.
     Usage:
       gh pr create --title '<conventional-commit subject>' \
         --body-file .github/pr-body-template.md
     Delete every line between ~~~ markers and fill in the rest.
     Conventional-commit subjects this repo uses: feat/fix/chore/docs/test/perf
     (e.g. `fix(chat): ...`, `feat(content): ...`, `chore(deps): ...`).
     A filled-in example is at the bottom of this file. -->

## Summary

~~~What does this change do, and why? 1-3 sentences.~~~

## Type of change

~~~Pick one: bug fix / new feature / chore / refactor / docs / test~~~

## Test plan

~~~Which of the project gates did you run before opening this PR?
( lint / tsc / jest / build / audit / e2e — paste key results )~~~

## Related

~~~Issues or PRs this closes / references, if any (e.g. Closes #95).~~~

<!--
  EXAMPLE — filled-in reference. This block is an HTML comment, so it
  stays invisible in the rendered PR body when you pass this file to
  --body-file. Use it to see what a finished body looks like, then
  fill in the real sections above. Delete this block before opening
  the PR if you prefer a clean raw body.
-->

## Summary

Updates the Hero section bio and title to the current role
("Senior Frontend Engineer") so recruiters see accurate info on the
landing page right away.

## Type of change

new feature

## Test plan

- `npx tsc --noEmit` — pass
- `npm run lint:check` — pass (also green on CI)
- `npm run build` — pass
- Manual smoke test: `npm run dev`, homepage renders the updated
  title and bio in light and dark mode.

## Related

Closes #117
