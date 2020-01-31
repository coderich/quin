import { SchemaDirectiveVisitor } from 'graphql-tools';

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

export default {
  typeDefs: `
    scalar QuinMixed

    enum QuinIndexEnum { unique }
    input QuinIndexInput { name: String type: QuinIndexEnum! on: [String!]! }

    enum QuinEnforceEnum { email selfless immutable distinct }
    enum QuinTransformEnum  { charAt charCodeAt concat indexOf lastIndexOf localeCompare repeat replace search slice split substr substring toLocaleLowerCase toLocaleUpperCase toLowerCase toString toUpperCase trim toTitleCase toLocaleTitleCase toSentenceCase toLocaleSentenceCase dedupe timestamp }
    enum QuinOnDeleteEnum { cascade nullify restrict }

    directive @quin(
      allow: [QuinMixed!]
      deny: [QuinMixed!]
      norepeat: [QuinMixed!]
      range: [Int!]
      enforce: [QuinEnforceEnum!]
      transform: [QuinTransformEnum!]

      alias: String
      materializeBy: String
      embedded: Boolean
      hidden: Boolean
      onDelete: QuinOnDeleteEnum
      indexes: [QuinIndexInput]
      driver: String
    ) on OBJECT | FIELD_DEFINITION
  `,

  schemaDirectives: { quin: QuinDirective },
};
