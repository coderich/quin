export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;
export const makeThunk = (name, fn) => Object.defineProperty((val, cmp = fn) => cmp(val), 'name', { value: name });
export const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      return `${value}`;
    }
    case 'Float': case 'Number': {
      return Number(value);
    }
    case 'Int': {
      return parseInt(value, 10);
    }
    case 'Boolean': {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return Boolean(value);
    }
    default: {
      return value;
    }
  }
};

export const mergeSchema = (schema) => {
  // Identify instances
  const rules = instances.filter(({ instance }) => instance.type === 'rule');
  const transformers = instances.filter(({ instance }) => instance.type === 'transformer');

  // Ensure schema
  schema.typeDefs = schema.typeDefs || [];
  schema.schemaDirectives = Object.assign(schema.schemaDirectives || {}, { quin: QuinDirective });
  schema.typeDefs = Array.isArray(schema.typeDefs) ? schema.typeDefs : [schema.typeDefs];

  // Merge schema
  schema.typeDefs.push(`
    scalar QuinMixed
    enum QuinEnforceEnum { null ${rules.map(({ name }) => name).join(' ')} }
    enum QuinTransformEnum  { null ${transformers.map(({ name }) => name).join(' ')} }

    directive @quin(
      enforce: [QuinEnforceEnum!]
      transform: [QuinTransformEnum!]
    ) on OBJECT | FIELD_DEFINITION
  `);

  // Return new Schema
  return new Schema(schema);
};
