# Quin

### Data Validation & Transformation

**Quin** is a GraphQL plugin for data **validation** and **transformation**. It provides a custom `@quin` directive for declarative schema design plus a JavaScript API for runtime validation.

Features include:
* Validation & Transformation Framework
* JavaScript Schema API
* Fully Extensible

#### Basic Example:

Decorate a GraphQL schema with `@quin`:

```gql
Type User {
  id: ID!
  name: String! @quin(transform: [trim, toTitleCase])
  emailAddress: String! @quin(transform: toLowerCase, enforce: email)
}
```

Validate schema at runtime:

```js
const quinSchema = new Quin(schema);
const userModel = quinSchema.getModel('User');

// Validate will first run any transformers
userModel.validate({ name: ' QUIN ' }); // Returns { name: 'Quin' }
userModel.validate({ emailAddress: 'foobar' }); // Throws Error
```

## Quin Directive

By default the `@quin` directive provides two *key-value* pairs for immediatae use:

| key | value | example
| - | - | - |
| *transform* | Array of `Transformers` to apply | `@quin(transform: [trim, toTitleCase])`
| *enforce* | Array of `Rules` to enforce | `@quin(enforce: [email, immutable])`

> Note: *email* and *immutable* are examples of using custom `Rules`

#### Default Transformers

Below is a list of default `Transformers` for immediate use:

| value | description
| - | - |
| *trim* | Remove whitespace from both ends of a string
| *trimEnd* | Remove whitespace from the end of a string
| *trimStart* | Remove whitespace from the start of a string
| *toLowerCase* | Convert string to lower case
| *toUpperCase* | Convert string to upper case
| *toTitleCase* | Convert string to title case
| *toSentenceCase* | Convert string to sentence case
| *dedupe* | Remove duplicates from array
| *timestamp* | Returns Date.now()

#### Default Rules

There are no default `Rules` other than the *required* rule. The *required* `Rule` is automatically run when `validation` takes place on a required `!` field.

## Schema API

| API | description | Returns
| - | - | - |
| `new Quin(gql)` | Constructor. Modifies the input `gql` to support `@quin` directives | `schema`
| `schema.getModels()` | Retrieve array of models | `[model]`
| `schema.getModelMap()` | Retrieve map of models (keyed by name) | `Map <model>`
| `schema.getModel(name)` | Retrieve a single model by name | `model`
| `schema.getRules()` | Retrieve all `Rules` | `Map <Rule>`
| `schema.getTransformers()` | Retrieve all `Transformers` | `Map <Transformer>`
| `schema.getExecutableSchema()` | Get underlying [executable schema]() | `GQLSchema`


## Extending Quin

