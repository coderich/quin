// import { GraphQLID, GraphQLInt, GraphQLFloat, GraphQLString, GraphQLBoolean } from 'graphql';

export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;
