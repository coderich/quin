# Quin
### Enrich your GraphQL schema.

**Quin** is a [GraphQL Directive](https://www.apollographql.com/docs/graphql-tools/schema-directives/) to easily add field *transformations*, *validation*, and *meta data* to any GraphQL schema.

Features include:
* Field *transformations* and *validation*
* Schema *meta-data*
* Extensibility

##### At a glance:
```gql
Type User {
  id: ID!
  name: String! @quin(transform: [trim, titleCase])
  emailAddress: String! @quin(enforce: email)
}
```

| key | value | example
| - | - | - |
| *allow* | Array of values to allow | `@quin(allow: ["red", "green", "blue"])`
| *deny* | Array of values to deny | `@quin(deny: [0, false, "false"])`
| *range* | Numerical range [*min*, *max*] | `@quin(range: [0, 100])`
| *norepeat* | Array of values to never repeat | `@quin(norepeat: [""])`
| *enforce* | Array of `Rules` to enforce | `@quin(enforce: [email, immutable])`
| *transform* | Array of `Transforms` to apply | `@quin(transform: titlecase)`

| key | value | example
| - | - | - |
| *driver* | Specify data driver | `@quin(driver: mongo)`
| *alias* | Specify fieldName for driver | `@quin(alias: "first_name")`
| *materializeBy* | Define a virtual field | `@quin(materializedBy: "author"`
| *embedded* | Embed fields into model | `@quin(embedded: true)`
| *hidden* | Mark unavailable for API | `@quin(hidden: true)`
| *onDelete* | Define `onDelete` behavior | `@quin(onDelete: cascade)`
| *indexes* | Define `Indexes` for model | `@quin(indexes: [{ ... }])`
