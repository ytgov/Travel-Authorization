# Store

Store are an abstraction that handles loading states and cache lookups.
Stores should be light-weight and mostly just add loading to api's.

Pattern:

- All file names should map to a back-end model.
- Primary objects should attempt to keep the same type as much as possible. e.g. `attributes` -> `{}` instead of `attributes` -> `null`.
- Each object should get three additional generic stateful attributes. i.e. `attributes` -> `isLoading`, `isErrored`, and `isCached`.
- actions should log then raise any errors, until we have a notification store or something for generic error handling.
- Singular objects should store their attributes in `state.attributes`, plural objects should use `state.items`
- (optional) defined an "isReady" getter that checks isCached && !isLoading && !isErrored

Method patterns:

- ensure - this method should return the state if already fetched, otherwise fetch new state, defers to fetch if it exists.
- fetch (optional) - this method should always refresh the state, it should trigger loaders, optionally defer to fetchSilently if it exists.
- fetchSilently (optional) - this method should always refresh the state, it should _not_ trigger loaders.

See `web/src/store/travel-authorization.js` for current state of the art store pattern.
