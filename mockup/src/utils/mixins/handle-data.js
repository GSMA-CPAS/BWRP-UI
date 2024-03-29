const dataMixin = {
  methods: {
    resetData() {
      for (const val in this._data) {
        this._data[val] = null;
      }
    },
  },
};
const utilsMixin = {
  methods: {
    labelsToCamelCase(array) {
      return array.map((label) => ({ key: this._.camelCase(label), label }));
    },
    longestArray(arrays) {
      return arrays.reduce(
        (curLength, arr) => (arr.length > curLength ? arr.length : curLength),
        length
      );
    },
  },
};

export { dataMixin, utilsMixin };
