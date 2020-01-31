# Quin

### Enrich your GraphQL schema.

**Quin** is a [GraphQL Directive](https://www.apollographql.com/docs/graphql-tools/schema-directives/) to easily add field *transformations*, *validation*, and *meta data* to a GraphQL schema.

Features include:
* Field *transformations* and *validation*
* Schema *meta-data*
* Extensibility

#### Quickview:

```gql
Type User {
  id: ID!
  name: String! @quin(transform: [trim, toTitleCase])
  emailAddress: String! @quin(enforce: email, transform: toLowerCase)
}
```

## The Quin Directive

The `@quin` directive provides a variety of *key-value* pairs that can be used on various parts of your schema.

| key | value | example | on
| - | - | - | -|
| *allow* | Array of values to allow | `@quin(allow: ["red", "green", "blue"])` | `Fields`
| *deny* | Array of values to deny | `@quin(deny: [0, false, "false"])` | `Fields`
| *range* | Numerical range [*min*, *max*] | `@quin(range: [0, 100])` | `Fields`
| *norepeat* | Array of values to never repeat | `@quin(norepeat: ["special1", "special2"])` | `Fields`
| *transform* | Array of `Transforms` to apply | `@quin(transform: [trim, toTitleCase])`| `Fields `
| *enforce* | Array of `Rules` to enforce | `@quin(enforce: [email, immutable])` | `Fields`


#### Transforms

> You may additionally use any [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) method as a *value* for the `transform` key (eg. `toLowerCase`):

| value | description
| - | - |
| *toTitleCase* | Transform value to titleCase
| *toLocaleTitleCase* | Transform value to locale titleCase
| *toSentenceCase* | Transform value to sentenceCase
| *toLocaleSentenceCase* | Transform value to locale sentenceCase
| *dedupe* | Remove any duplicates found in array
| *timestamp* | Transform value to Date.now()

#### Rules

| key | value | example
| - | - | - |
| *driver* | Specify data driver | `@quin(driver: mongo)`
| *alias* | Specify fieldName for driver | `@quin(alias: "first_name")`
| *materializeBy* | Define a virtual field | `@quin(materializedBy: "author"`
| *embedded* | Embed fields into model | `@quin(embedded: true)`
| *hidden* | Mark unavailable for API | `@quin(hidden: true)`
| *onDelete* | Define `onDelete` behavior | `@quin(onDelete: cascade)`
| *indexes* | Define `Indexes` for model | `@quin(indexes: [{ ... }])`
