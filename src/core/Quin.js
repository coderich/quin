import { SchemaDirectiveVisitor } from 'graphql-tools';
import Transformer from './Transformer';
import Rule from './Rule';
import Schema from '../graphql/Schema';

const instances = {};
const customDirectives = [];

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

class DirectiveBuilder {
  constructor(def) {
    // this.type = (def) => {
    //   this.directiveDef = `${key}: ${def}`;
    //   this.typeDef = '';
    // };

    // this.scalar = (def) => {
    //   const type = def.replace(/[[\]!]+/g, '');
    //   this.directiveDef = `${key}: ${def}`;
    //   this.typeDef = `scalar ${type}`;
    // };

    // this.enum = (def, args) => {
    //   const type = def.replace(/[[\]!]+/g, '');
    //   this.directiveDef = `${key}: ${def}`;
    //   this.typeDef = `enum ${type} { ${args.join(' ')} }`;
    // };

    // this.input = (def, gql) => {
    //   const type = def.replace(/[[\]!]+/g, '');
    //   this.directiveDef = `${key}: ${def}`;
    //   this.typeDef = `input ${type} ${gql}`;
    // };

    customDirectives.push(def);
  }
}

export default class Quin {
  constructor(schema) {
    // Identify instances
    const defaultTransformers = Object.entries(Transformer).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    const defaultRules = Object.entries(Rule).map(([name, method]) => ({ name, instance: method() })); // Create default instances
    const customInstances = Object.entries(instances).map(([name, instance]) => ({ name, instance }));
    const customRules = customInstances.filter(({ instance }) => instance.type === 'rule');
    const customTransformers = customInstances.filter(({ instance }) => instance.type === 'transformer');
    const rules = defaultRules.concat(customRules);
    const transformers = defaultTransformers.concat(customTransformers);

    // Ensure schema
    schema.typeDefs = schema.typeDefs || [];
    schema.schemaDirectives = Object.assign(schema.schemaDirectives || {}, { quin: QuinDirective });
    schema.typeDefs = Array.isArray(schema.typeDefs) ? schema.typeDefs : [schema.typeDefs];

    // Merge schema
    const quinDirective = `
      scalar QuinMixed
      enum QuinEnforceEnum { ${rules.map(({ name }) => name).join(' ')} }
      enum QuinTransformEnum  { ${transformers.map(({ name }) => name).join(' ')} }

      directive @quin(
        ${customDirectives.join('\n\t    ')}
        enforce: [QuinEnforceEnum!]
        transform: [QuinTransformEnum!]
      ) on OBJECT | FIELD_DEFINITION
    `;

    console.log(quinDirective);

    // Return new Schema
    schema.typeDefs.push(quinDirective);
    return new Schema(schema, rules, transformers);
  }

  static factory(name, instance) {
    const invalidArg = () => { throw new Error('Invalid argument; expected Rule|Transformer factory instance'); };
    const { method = invalidArg(), type = invalidArg() } = instance;
    const factoryMethod = (type === 'rule' ? Rule[method] : Transformer[method]);
    if (!factoryMethod) invalidArg();
    return (instances[name] = instance);
  }

  static extend(key, type) {
    return new DirectiveBuilder(key, type);
  }
}
