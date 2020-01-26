import { SchemaDirectiveVisitor } from 'graphql-tools';

class VirtualDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
    // const { name, resolve = root => root[name], type } = field;
    // const returnType = type.toString().replace(/[[\]!]/g, '');

    // field.resolve = async function resolver(root, args, context, info) {
    //   const payload = await resolve.call(this, root, args, context, info);
    // };
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

export default {
  typeDefs: `
    directive @virtual(by: String!) on FIELD_DEFINITION
    directive @immutable on FIELD_DEFINITION
    directive @onDelete(op: String!) on FIELD_DEFINITION
  `,
  schemaDirectives: {
    virtual: VirtualDirective,
    immutable: ImmutableDirective,
    onDelete: OnDeleteDirective,
  },
};
