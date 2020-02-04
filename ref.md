A `Rule` is used to enforce data validation for a particular field.


A `Transformer` is a function that modifies data. Specifically, each `Transformer` is a *thunk* that accepts a single argument (data).

> You may also use any [JavaScript String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) method as a `transformer`  (eg. `toLowerCase`)


#### Experimental

| key | value | example
| - | - | - |
| *driver* | Specify data driver | `@quin(driver: mongo)`
| *alias* | Specify fieldName for driver | `@quin(alias: "first_name")`
| *materializeBy* | Define a virtual field | `@quin(materializedBy: "author"`
| *embedded* | Embed fields into model | `@quin(embedded: true)`
| *hidden* | Mark unavailable for API | `@quin(hidden: true)`
| *onDelete* | Define `onDelete` behavior | `@quin(onDelete: cascade)`
| *indexes* | Define `Indexes` for model | `@quin(indexes: [{ ... }])`
