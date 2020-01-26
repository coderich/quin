import Field from './Field';

export default class Model {
  constructor(schema, name, ast) {
    this.schema = schema;
    this.name = name;
    this.ast = ast;
    this.fields = Object.entries(ast.getFields()).map(([fieldName, fieldAST]) => new Field(schema, fieldName, fieldAST));
    this.toString = () => `${name}`;
  }

  getName() {
    return this.name;
  }

  getFields() {
    return this.fields;
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
    return this.fields.filter(field => !field.isVirtual());
  }

  getUpdateFields() {
    return this.fields.filter(field => !field.isVirtual() && !field.isImmutable());
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

  getAlias() {
    return this.options.alias || this.getName();
  }

  getIndexes() {
    return this.options.indexes || [];
  }

  getDriver() {
    return this.driver.dao;
  }

  getDriverName() {
    return this.options.driver || 'default';
  }

  isHidden() {
    return this.options.hideFromApi;
  }

  isVisible() {
    return !this.isHidden();
  }

  referentialIntegrity(refs) {
    if (refs) this.referentials = refs;
    return this.referentials;
  }
}
