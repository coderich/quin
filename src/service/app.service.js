// import { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql';

export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Boolean'].indexOf(value) > -1;
// export const isScalarAst = ast =>
