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

class AliasDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }

  visitObject(type) { // eslint-disable-line
  }
}

export default {
  typeDefs: `
    enum indexEnum { unique }
    enum onDeleteEnum { cascade nullify restrict }
    input IndexInput {
      name: String
      type: indexEnum!
      fields: [String!]!
    }
    directive @virtual(by: String!) on FIELD_DEFINITION
    directive @immutable on FIELD_DEFINITION
    directive @onDelete(op: onDeleteEnum!) on FIELD_DEFINITION
    directive @alias(name: String!) on OBJECT | FIELD_DEFINITION
    directive @indexes(on: [IndexInput!]!) on OBJECT
  `,
  schemaDirectives: {
    virtual: VirtualDirective,
    immutable: ImmutableDirective,
    onDelete: OnDeleteDirective,
    alias: AliasDirective,
    indexes: IndexesDirective,
  },
};
