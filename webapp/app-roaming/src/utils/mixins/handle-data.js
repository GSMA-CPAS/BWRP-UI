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
    parseValue(number) {
      const notNullNumber = number ? number : 0;
      return Number(notNullNumber).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    usageJsonToCsv(body) {
      const inboundItems = body.inbound;
      const outboundItems = body.outbound;
      const header = Object.keys(inboundItems[0]);
      header.push('direction');
      // remove currency header
      for ( let i = 0; i < header.length; i++) {
        if ( header[i] === 'currency') {
          header.splice(i, 1);
        }
      }
      const headers = {
        'yearMonth': 'Year_Month',
        'homeTadig': 'HPMN',
        'visitorTadig': 'VPMN',
        'service': 'Services Categorised',
        'usage': 'Usage',
        'units': 'Units',
        'direction': 'Direction',
        'charges': 'Charges'
      };
      const csvHeaders = [];
      header.forEach((key) => csvHeaders.push(headers[key]));
      return [
        csvHeaders.join(','), // header row first
        ...inboundItems.map((row) => header.map((fieldName) => {
          if (fieldName === 'direction') return 'inbound';
          else return row[fieldName] ? row[fieldName] : '';
        }).join(',')),
        ...outboundItems.map((row) => header.map((fieldName) => {
          if (fieldName === 'direction') return 'outbound';
          else return row[fieldName] ? row[fieldName] : '';
        }).join(','))
      ].join('\r\n');
    },
    exportUsageToCSV(body) {
      const data = new Blob([this.usageJsonToCsv(body)], {
        type: 'data:text/csv',
      });
      const fileName = `${this.referenceId}.csv`;
      this.generateFile(data, fileName);
    },
    exportUsageToXLSX(body) {
      const data = new Blob([this.usageJsonToCsv(body)], {
        type: 'application/excel',
      });
      const fileName = `${this.referenceId}.xlsx`;
      this.generateFile(data, fileName);
    },
    exportOwnUsageToCSV() {
      this.exportUsageToCSV(this.$store.state.usage.ownUsage.body);
    },
    exportPartnerUsageToCSV() {
      this.exportUsageToCSV(this.$store.state.usage.partnerUsage.body);
    },
    exportOwnUsageToXLSX() {
      this.exportUsageToXLSX(this.$store.state.usage.ownUsage.body);
    },
    exportPartnerUsageToXLSX() {
      this.exportUsageToXLSX(this.$store.state.usage.partnerUsage.body);
    },
    exportToJSON(json) {
      const data = new Blob([JSON.stringify(json)], {
        type: 'application/json',
      });
      const fileName = `${this.referenceId}.json`;
      this.generateFile(data, fileName);
    },
    generateFile(data, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
        // ie11
        window.navigator.msSaveOrOpenBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = fileName;
        link.href = window.URL.createObjectURL(data);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
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
      const headers = {
        'Year_Month': 'yearMonth',
        'HPMN': 'homeTadig',
        'VPMN': 'visitorTadig',
        'Services Categorised': 'service',
        'Usage': 'usage',
        'Units': 'units',
        'Direction': 'direction',
        'Charges': 'charges'
      };
      const csvHeaders=lines[0].replace('\r', '').split(/[,;]+/);
      for (let i=1; i<lines.length; i++) {
        const obj = {};
        const currentLine=lines[i].replace('\r', '').split(/[,;]+/);
        for (let j=0; j<csvHeaders.length; j++) {
          obj[csvHeaders[j]] = currentLine[j];
        }
        Object.keys(obj).forEach((oldKey) => {
          const newKey = headers[oldKey];
          obj[newKey] = obj[oldKey];
          delete obj[oldKey];
        });
        obj['currency']='EUR';
        obj['usage'] = Number(obj['usage']);
        if (obj['charges'] && obj['charges'] !== '') {
          obj['charges'] = Number(obj['charges']);
        } else delete obj['charges'];
        if (obj['direction']?.toLowerCase() === 'inbound') {
          delete obj['direction'];
          result.inbound.push(obj);
        } else if (obj['direction']?.toLowerCase() === 'outbound') {
          delete obj['direction'];
          result.outbound.push(obj);
        }
      }
    },
    parseJson(json, result) {
      const headers = {
        'Year_Month': 'yearMonth',
        'HPMN': 'homeTadig',
        'VPMN': 'visitorTadig',
        'Services Categorised': 'service',
        'Usage': 'usage',
        'Units': 'units',
        'Charges': 'charges'
      };
      for (const row of json) {
        const obj = row;
        if (obj['Direction']?.toLowerCase() === 'inbound') {
            this.parseSingleUsage(obj, result.inbound, headers);
        } else if (obj['Direction']?.toLowerCase() === 'outbound') {
            this.parseSingleUsage(obj, result.outbound, headers);
        }
      }
    },
    parseSingleUsage(obj, result, headers) {
      const newObj = {};
      for (const oldKey of Object.keys(headers)) {
          newObj[headers[oldKey]] = obj[oldKey];
      }
      if (!newObj['charges']) delete newObj['charges'];
      else newObj['charges']= Number(newObj['charges']);
      newObj['yearMonth']= String(newObj['yearMonth']);
      newObj['currency']='EUR';
      result.push(newObj);
    }
  },

};

export {dataMixin, utilsMixin, converterMixin};
