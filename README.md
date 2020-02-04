# Quin

### Data Validation & Transformation

**Quin** is a GraphQL plugin for data **validation** and **transformation**. It provides a custom `@quin` directive for declarative schema design plus a JavaScript API for runtime introspection.

Features include:
* Validation & Transformation Framework
* JavaScript Schema API
* Fully Extensible

#### Basic Example:

Define a schema with `@quin`:

```gql
Type User {
  id: ID!
  name: String! @quin(transform: [trim, toTitleCase])
  emailAddress: String! @quin(enforce: email, transform: toLowerCase)
}
```

Validate at runtime:

```js
const schema = new Quin(gqlSchema);
const userModel = schema.getModel('User');

// Validate will first perform transformations
userModel.validate({ name: ' QUIN ' }); // Returns { name: 'Quin' }
userModel.validate({ emailAddress: 'foobar' }); // Throws
```

## The Quin Directive

By default, the `@quin` directive provides two *key-value* pairs for use in your schema:

| key | value | example
| - | - | - |
| *transform* | Array of `Transformers` to apply | `@quin(transform: [trim, toTitleCase])`
| *enforce* | Array of `Rules` to enforce | `@quin(enforce: [email, immutable])`

> Note: *email* and *immutable* are examples of custom `Rules`

#### Default Transformers

Below is a list of default `Transformers` that can be used out of the box:

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

There are no default `Rules` other than the *required* rule. This `Rule` is automatically run when the `validation` method on any required `!` field is called.
