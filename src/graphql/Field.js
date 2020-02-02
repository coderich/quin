import Type from './Type';
import Transformer from '../quin/Transformer';
import Rule from '../quin/Rule';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.transforms = [];
    this.rules = [];
    this.cast = Transformer.cast(this.getType());

    // Populate transform and rule thunks
    if (this.isRequired()) this.rules.push(Rule.required());

    Object.entries(this.getDirectiveArgs('quin', {})).forEach(([key, value]) => {
      if (!Array.isArray(value)) value = [value];

      switch (key) {
        case 'enforce': {
          this.rules.push(...value.map(r => Rule[r]()));
          break;
        }
        case 'transform': {
          this.transforms.push(...value.map(t => Transformer[t]()));
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  getModelRef() {
    return this.schema.getModel(this.getDataRef());
  }

  transform(value, mapper) {
    if (mapper == null) mapper = {};

    return this.transforms.concat(this.cast).reduce((prev, transform) => {
      const cmp = mapper[transform.name];
      if (Array.isArray(prev)) return prev.map(p => transform(p, cmp));
      return transform(prev, cmp);
    }, value);
  }

  validate(value, mapper) {
    if (mapper == null) mapper = {};

    return Promise.all(this.rules.map((rule) => {
      const cmp = mapper[rule.name];
      if (Array.isArray(value)) return value.map(v => rule(v, cmp));
      return rule(value, cmp);
    }));
  }
}
