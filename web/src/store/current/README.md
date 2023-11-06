# web/src/store/current/README.md

This folder contains Vuex stores that are based of the "current" User, or something they are currently interacting with.

Pattern:

- All names will likely be singular.
- All file names should be prefixed with current, and map to a back-end model.
- All attribute names should be prefixed with current, to avoid import collisions.
- All statefull names should be suffixed with the attribute in question.
  e.g. currentUser -> loadingCurrentUser, this will vastly reduce naming collisions on import.
- Primary objects should attempt to keep the same type as much as possible. e.g. `currentUser` -> `{}` instead of `currentUser` -> `null`.
- Each object should get three additional generic stateful attributes. i.e. `currentUser` -> `loadingCurrentUser`, `errroedCurrentUser`, and `initializedCurrentUser`.
