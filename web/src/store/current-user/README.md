# web/src/store/current/README.md

This folder contains Vuex stores that are based off the "current" User, or something the User is currently interacting with.

Pattern:

- All objects depend on current user.
- All file names should map to a back-end model.
- Primary objects should attempt to keep the same type as much as possible. e.g. `attributes` -> `{}` instead of `attributes` -> `null`.
- Each object should get three additional generic stateful attributes. i.e. `attributes` -> `isLoading`, `isErrored`, and `isInitialized`.
- actions should log then raise any errors, until we have a notification store or something for generic error handling.
- Singular objects should store their attributes in `state.attributes`, plural objects should use `state.items`
