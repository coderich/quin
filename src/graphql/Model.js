import Type from './Type';
import Field from './Field';

export default class Model extends Type {
  constructor(schema, model) {
    super(model);
    this.schema = schema;
    this.fields = Object.values(model.getFields()).map(field => new Field(schema, field));
  }

  getFields() {
    return this.fields;
  }

  getFieldMap() {
    return this.fields.reduce((prev, field) => Object.assign(prev, { [field.getName()]: field }), {});
  }

  getField(path) {
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
    if (mapper == null) mapper = {};

    return Object.entries(data).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: this.getField(key).transform(value, mapper) });
    }, {});
  }

  validate(data, mapper) {
    if (data == null) data = {};
    if (mapper == null) mapper = {};

    // Validate does an explicit transform first
    const newData = this.transform(data, mapper);

    // Enforce the rules
    this.getFields().filter(field => field.getType() !== 'ID').forEach((field) => {
      field.validate(newData[field.getName()], mapper);
    });
  }
}
