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
const schema = new Quin(gql);
const userModel = schema.getModel('User');

// Validate will first run any transformers
userModel.validate({ name: ' QUIN ' }); // Returns { name: 'Quin' }
userModel.validate({ emailAddress: 'foobar' }); // Throws Error
```

## Quin Directive

By default the `@quin` directive provides two key-value pairs for immediate use:

| key | value | example
| - | - | - |
| *transform* | List of `Transformer` *enums* to apply | `@quin(transform: [trim, toTitleCase])`
| *enforce* | List of `Rule` *enums* to enforce | `@quin(enforce: [email, immutable])`

> Note: *email* and *immutable* are examples of custom `Rules`

#### Default Transformers

Below is a list of default `Transformers` that come with `@quin`:

| enum | description
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

## Quin API

#### Schema

```js
const schema = new Quin(gql); // Call BEFORE makeExecutableSchema(). Modifies gql.
```

| API | description | Returns
| - | - | - |
| `schema.getModels()` | Retrieve map of all `models` | `Map <model>`
| `schema.getRules()` | Retrieve map of all `rules` | `Map <rule>`
| `schema.getTransformers()` | Retrieve map of all `transformers` | `Map <transformer>`
| `schema.getExecutableSchema()` | Get underlying [executable schema]() | `GQLSchema`

#### Model

```js
const model = schema.getModel('User');
```

| API | description | Returns
| - | - | - |
| `model.getFields()` | Retrieve map of all `models` | `Map <model>`
| `model.transform(data, mapper)` | Retrieve map of all `rules` | `Map <rule>`
| `model.validate(data, mapper)` | Retrieve map of all `transformers` | `Map <transformer>`

#### Field

```js
const field = model.getField('emailAddress');
```

| API | description | Returns
| - | - | - |
| `field.transform(data, mapper)` | Apply all field `transformers` to *data* | Transformed data
| `field.validate(data, mapper)` | First performs a `transform(...)` then enforces all `rules` | Transformed data or `Throws Error`

## Extending Quin

