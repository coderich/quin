import { SchemaDirectiveVisitor } from 'graphql-tools';
import Rule from '../quin/Rule';
import Transformer from '../quin/Transformer';

class QuinDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) { // eslint-disable-line
  }
  visitObject(type) { // eslint-disable-line
  }
}

export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;
export const makeThunk = (name, fn) => Object.defineProperty((val, cmp = fn) => cmp(val), 'name', { value: name });

export const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      return `${value}`;
    }
    case 'Number': case 'Float': case 'Int': {
      return Number(value);
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

export const makeFactories = () => {
  // Transformers
  [
    'charAt', 'charCodeAt', 'codePointAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
    'normalize', 'padEnd', 'padStart', 'repeat', 'replace', 'search', 'slice', 'split', 'substr', 'substring',
    'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim', 'trimEnd', 'trimStart', 'raw',
  ].forEach(name => Transformer.factory(name, (...args) => v => String(v)[name](...args)));
  Transformer.factory('toTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
  Transformer.factory('toLocaleTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()));
  Transformer.factory('toSentenceCase', () => v => v.charAt(0).toUpperCase() + v.slice(1));
  Transformer.factory('toLocaleSentenceCase', () => v => v.charAt(0).toLocaleUpperCase() + v.slice(1));
  Transformer.factory('dedupe', () => v => [...new Set(v)]);
  Transformer.factory('timestamp', () => v => Date.now());
  Transformer.factory('cast', type => v => castCmp(type, v));

  // Rules
  ['endsWith', 'includes', 'match', 'search', 'startsWith'].forEach((name) => {
    Rule.factory(name, (...args) => (val) => {
      if (val === null) return;
      if (!String(val)[name](...args)) throw new Error();
    });
  });
  Rule.factory('allow', (...args) => (val) => {
    if (val == null) return;
    if (args.indexOf(val) === -1) throw new Error();
  });

  Rule.factory('deny', (...args) => (val) => {
    if (val == null) return;
    if (args.indexOf(val) > -1) throw new Error();
  });

  Rule.factory('range', (min, max) => {
    if (min == null) min = undefined;
    if (max == null) max = undefined;

    return (val) => {
      if (val == null) return;
      if (Number.isNaN(val) || val < min || val > max) throw new Error();
    };
  });
};

export const makeDirective = (quins = []) => {
  const rules = quins.filter(quin => quin.type === 'rule');
  const transformers = quins.filter(quin => quin.type === 'transformer');

  return {
    typeDefs: `
      scalar QuinMixed
      enum QuinEnforceEnum { email selfless immutable distinct }
      enum QuinTransformEnum  { charAt charCodeAt concat indexOf lastIndexOf localeCompare repeat replace search slice split substr substring toLocaleLowerCase toLocaleUpperCase toLowerCase toString toUpperCase trim toTitleCase toLocaleTitleCase toSentenceCase toLocaleSentenceCase dedupe timestamp }

      enum QuinIndexEnum { unique }
      input QuinIndexInput { name: String type: QuinIndexEnum! on: [String!]! }
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
};
