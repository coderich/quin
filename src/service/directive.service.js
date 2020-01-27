import { SchemaDirectiveVisitor } from 'graphql-tools';

class VirtualDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
}

class ImmutableDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
}

class OnDeleteDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
}

class IndexesDirective extends SchemaDirectiveVisitor {
  visitObject(type) { // eslint-disable-line
  }
}

class RulesDirective extends SchemaDirectiveVisitor {
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
    enum QuinIndexEnum { unique }
    enum QuinValidEnum { email }
    enum QuinRejectEnum { self change }
    enum QuinTransformEnum { lowerCase upperCase titleCase }
    enum QuinOnDeleteEnum { cascade nullify restrict }

    input QuinIndexInput {
      name: String
      type: QuinIndexEnum!
      fields: [String!]!
    }

    directive @virtual(by: String!) on FIELD_DEFINITION
    directive @immutable on FIELD_DEFINITION
    directive @onDelete(op: QuinOnDeleteEnum!) on FIELD_DEFINITION
    directive @alias(name: String!) on OBJECT | FIELD_DEFINITION
    directive @indexes(on: [QuinIndexInput!]!) on OBJECT
    directive @hidden on OBJECT | FIELD_DEFINITION
    directive @rules(
      allow: [String!]
      deny: [String!]
      range: [Int!]
      valid: [QuinValidEnum!]
      reject: [QuinRejectEnum!]
      transform: [QuinTransformEnum!]
    ) on FIELD_DEFINITION
  `,
  schemaDirectives: {
    virtual: VirtualDirective,
    immutable: ImmutableDirective,
    onDelete: OnDeleteDirective,
    alias: AliasDirective,
    indexes: IndexesDirective,
    hidden: HiddenDirective,
    rules: RulesDirective,
  },
};
