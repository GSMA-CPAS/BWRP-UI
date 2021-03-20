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
    csvToJSON(csv, result) {
      const lines=csv.split('\n');
      const headers=[
          'yearMonth',
          'homeTadig',
          'visitorTadig',
          'direction',
          'service',
          'usage',
          'units'
      ];
      for (let i=1; i<lines.length; i++) {
        const obj = {};
        const currentLine=lines[i].replace('\r', '').split(/[,;]+/);
        for (let j=0; j<headers.length; j++) {
          obj[headers[j]] = currentLine[j];
        }
        obj['currency']='EUR';
        if (obj['direction']?.toLowerCase() === 'inbound') {
          result.inbound.push(obj);
        } else if (obj['direction']?.toLowerCase() === 'outbound') {
          result.outbound.push(obj);
        }
        delete obj['direction'];
      }
    },
    parseJson(json, result) {
      const headers = {
        'Year_Month': 'yearMonth',
        'HPMN': 'homeTadig',
        'VPMN': 'visitorTadig',
        'Services Categorised': 'service',
        'Usage': 'usage',
        'Units': 'units'
      };
      for (const row of json) {
        const obj = row;
        obj['Direction']?.toLowerCase() === 'inbound' ?
            this.parseSingleUsage(obj, result.inbound, headers) : this.parseSingleUsage(obj, result.outbound, headers);
      }
    },
    parseSingleUsage(obj, result, headers) {
      const newObj = {};
      for (const oldKey of Object.keys(headers)) {
          newObj[headers[oldKey]] = obj[oldKey];
      }

      newObj['currency']='EUR';
      result.push(newObj);
    }
  },
  // Accepts the array and key

};

export {dataMixin, utilsMixin, converterMixin};
