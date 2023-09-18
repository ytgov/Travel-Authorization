# Controllers

These files map api routes to services.
See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions

e.g.

```typescript
router.route("/api/forms").post(FormsController.create)
```

maps the `/api/forms` POST endpoint to the `FormsController#create` instance method.

Controllers are advantageous because they provide a suite of helper methods to access various request methods. .e.g. `currentUser`, or `params`. They also provide a location to perform policy checks.

Controllers should implement the BaseController, and provide instance methods.
The `BaseController` provides the magic that lets those methods map to an appropriate route.
