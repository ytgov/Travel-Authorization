# Services

Services provide a place to put logic for model create/read/update/delete (CRUD) actions.
If the codebase isn't using an object relational mapper (ORM), such as Sequelize, they also provide a pattern for model retrieval and lookups.

A standard usage example might look like this:

```typescript
class FormsController {
  create() {
    return FormService
      .create(this.request.body, this.currentUser)
      .then((form) => {
        return this.response.status(201).json({ form });
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Form submission failed: ${error}` });
      });
  }
}
```

In the above example, the controller handles the mapping of the action, while the actual model changes occur in the service.

The service should, for convenience, expose static methods, that call interal instance methods.
