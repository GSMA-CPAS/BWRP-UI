const dataMixin = {
  methods: {
    resetData() {
      for (const val in this._data) {
        if (Object.prototype.hasOwnProperty.call(this._data, val)) {
          this._data[val] = null;
        }
      }
    },
  },
};
const converterMixin = {
  methods: {
    convertRawToJSON(data) {
      return JSON.parse(atob(data));
    },
  }
};
const utilsMixin = {
  methods: {
    labelsToCamelCase(array) {
      return array.map((label) => ({key: this._.camelCase(label), label}));
    },
    longestArray(arrays) {
      return arrays.reduce(
        (curLength, arr) => (arr.length > curLength ? arr.length : curLength),
        0,
      );
    },
  },
};

export {dataMixin, utilsMixin, converterMixin};
