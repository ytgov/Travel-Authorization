# web/src/use/README.md

This is a very light store pattern. Each instance of the store has its own state.
The primary use for this is per-query state, that also tracks loading and error states.
This is useful if you need to use the same store for multiple components on a page and don't want to share state between them.
