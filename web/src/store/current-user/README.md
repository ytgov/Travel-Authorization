# web/src/store/current-user/README.md

This folder contains Vuex stores that are based off the "current" User, or something the User is currently interacting with.

Pattern:

- All objects depend on current user.
- All file names should map to a back-end model.
- Primary objects should attempt to keep the same type as much as possible. e.g. `attributes` -> `{}` instead of `attributes` -> `null`.
- Each object should get three additional generic stateful attributes. i.e. `attributes` -> `isLoading`, `isErrored`, and `isInitialized`.
- actions should log then raise any errors, until we have a notification store or something for generic error handling.
- Singular objects should store their attributes in `state.attributes`, plural objects should use `state.items`

Method patterns:

- initialize - this method should return the state if already initialized, otherwise fetch new state, defers to fetch if it exists.
- fetch (optional) - this method should always refresh the state, it should trigger loaders, optionally defer to fetchSilently if it exists.
- fetchSilently (optional) - this method should always refresh the state, it should _not_ trigger loaders.
