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

    enum QuinValidEnum { email }
    enum QuinRestrictEnum { self change dupes }
    enum QuinTransformEnum { lowerCase upperCase titleCase createdAt updatedAt }
    enum QuinOnDeleteEnum { cascade nullify restrict }

    directive @quin(
      alias: String
      allow: [QuinMixed!]
      deny: [QuinMixed!]
      restrict: [QuinRestrictEnum!]
      range: [Int!]
      distinct: [QuinMixed!]
      valid: [QuinValidEnum!]
      transform: [QuinTransformEnum!]
      materializeBy: String
      embedded: Boolean
      hidden: Boolean
      driver: String
      onDelete: QuinOnDeleteEnum
      indexes: [QuinIndexInput]
    ) on OBJECT | FIELD_DEFINITION
  `,

  schemaDirectives: { quin: QuinDirective },
};
