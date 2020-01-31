import { makeThunk } from './app.service';

// Cast compare function
const castCmp = (type, value) => {
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

// Start with JS built-in String methods
const transforms = [
  'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
  'repeat', 'replace', 'search', 'slice', 'split', 'substr', 'substring',
  'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim',
].reduce((prev, name) => Object.assign(prev, { [name]: (...args) => makeThunk(name, v => String(v)[name](...args)) }), {});

// Custom transformations
transforms.toTitleCase = () => makeThunk('toTitleCase', v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
transforms.toLocaleTitleCase = () => makeThunk('toLocaleTitleCase', v => v.replace(/\w\S*/g, w => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()));
transforms.toSentenceCase = () => makeThunk('toSentenceCase', v => v.charAt(0).toUpperCase() + v.slice(1));
transforms.toLocaleSentenceCase = () => makeThunk('toLocaleSentenceCase', v => v.charAt(0).toLocaleUpperCase() + v.slice(1));
transforms.dedupe = () => makeThunk('dedupe', v => [...new Set(v)]);
transforms.timestamp = () => makeThunk('timestamp', v => Date.now());
transforms.cast = type => makeThunk('cast', v => castCmp(type, v)); // used internally

export default transforms;
