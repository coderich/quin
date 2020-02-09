import Type from './Type';
import Field from './Field';

export default class Model extends Type {
  constructor(schema, model) {
    super(schema, model);
    this.fields = Object.values(model.getFields()).map(field => new Field(schema, this, field));
  }

  getFields() {
    return this.fields;
  }

  getFieldNames() {
    return this.fields.map(field => field.getName());
  }

  getFieldMap() {
    return this.fields.reduce((prev, field) => Object.assign(prev, { [field.getName()]: field }), {});
  }

  getField(path = '') {
    const [name, ...rest] = path.split('.');
    const field = this.fields.find(f => f.getName() === name);
    if (field == null) return field;

    if (rest.length) {
      const modelRef = field.getModelRef();
      if (modelRef) return modelRef.getField(rest.join('.'));
      return null;
    }

    return field;
  }

  getScalarFields() {
    return this.fields.filter(field => field.isScalar());
  }

  getArrayFields() {
    return this.fields.filter(field => field.isArray());
  }

  getDataRefFields() {
    return this.fields.filter(field => Boolean(field.getDataRef()));
  }

  transform(data, mapper) {
    if (data == null) data = {};

    return Object.entries(data).reduce((prev, [key, value]) => {
      const field = this.getField(key);
      if (!field) return Object.assign(prev, { [key]: value });
      return Object.assign(prev, { [key]: field.transform(value, mapper) });
    }, {});
  }

  normalize(data, mapper) {
    if (data == null) data = {};

    return Object.entries(data).reduce((prev, [key, value]) => {
      const field = this.getField(key);
      if (!field) return Object.assign(prev, { [key]: value });
      const alias = field.getAlias();
      return Object.assign(prev, { [alias]: field.normalize(value, mapper) });
    }, {});
  }

  validate(data, mapper) {
    // Validate does an explicit transform first
    const transformed = this.transform(data, mapper);

    // Enforce the rules
    return Promise.all(this.getFields().map((field) => {
      return field.validate(transformed[field.getName()], mapper);
    })).then(() => transformed);
  }
}
