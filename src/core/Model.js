import Type from './Type';
import Field from './Field';

export default class Model extends Type {
  constructor(schema, model) {
    super(model);
    this.schema = schema;
    this.fields = Object.values(model.getFields()).map(field => new Field(schema, field));
    this.toString = () => `${this.getName()}`;
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

  getEmbeddedArrayFields() {
    return this.fields.filter(field => field.isArray() && !field.isVirtual());
  }

  getCountableFields() {
    return this.fields.filter(field => field.isArray() && field.getDataRef());
  }

  getCreateFields() {
    return this.fields.filter(field => field.isCreateField());
  }

  getUpdateFields() {
    return this.fields.filter(field => field.isUpdateField());
  }

  getDataRefFields() {
    return this.fields.filter(field => Boolean(field.getDataRef()));
  }

  getOnDeleteFields() {
    return this.fields.filter(field => Boolean(field.getDataRef()) && Boolean(field.getOnDelete()));
  }

  getScalarFields() {
    return this.fields.filter(field => field.isScalar());
  }

  getIndexes() {
    return this.getDirectiveArg('quin', 'indexes', []);
  }

  getDriver() {
    return this.getDirectiveArg('quin', 'driver', 'default');
  }

  isHidden() {
    return Boolean(this.getDirectiveArg('quin', 'hidden'));
  }

  isVisible() {
    return !this.isHidden();
  }

  referentialIntegrity(refs) {
    if (refs) this.referentials = refs;
    return this.referentials;
  }

  transform(data) {
    return Object.entries(data).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: this.getField(key).transform(value) });
    }, {});
  }

  validate(data) {
    return Object.entries(data).reduce((prev, [key, value]) => {
      return Object.assign(prev, { [key]: this.getField(key).validate(value) });
    }, {});
  }
}
