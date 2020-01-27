import { SchemaDirectiveVisitor } from 'graphql-tools';

class IndexesDirective extends SchemaDirectiveVisitor {
  visitObject(type) { // eslint-disable-line
  }
}

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
}

class AliasDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

class HiddenDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

export default {
  typeDefs: `
    scalar QuinMixed
    enum QuinIndexEnum { unique }
    enum QuinValidEnum { email }
    enum QuinRejectEnum { self change }
    enum QuinTransformEnum { lowerCase upperCase titleCase createdAt updatedAt }
    enum QuinOnDeleteEnum { cascade nullify restrict }

    input QuinIndexInput {
      name: String
      type: QuinIndexEnum!
      fields: [String!]!
    }

    directive @alias(name: String!) on OBJECT | FIELD_DEFINITION
    directive @indexes(on: [QuinIndexInput!]!) on OBJECT
    directive @hidden on OBJECT | FIELD_DEFINITION

    directive @quin(
      allow: [QuinMixed!]
      deny: [QuinMixed!]
      reject: [QuinRejectEnum!]
      range: [Int!]
      distinct: [QuinMixed!]
      valid: [QuinValidEnum!]
      transform: [QuinTransformEnum!]
      materializeBy: String
      onDelete: QuinOnDeleteEnum
    ) on FIELD_DEFINITION
  `,

  schemaDirectives: {
    alias: AliasDirective,
    indexes: IndexesDirective,
    hidden: HiddenDirective,
    quin: QuinDirective,
  },
};
