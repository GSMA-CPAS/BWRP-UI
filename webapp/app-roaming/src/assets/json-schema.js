const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

ajv.addFormat('date', function(dateTimeString) {
  if (typeof dateTimeString === 'object') {
    dateTimeString = dateTimeString.toISOString();
  }
  return !isNaN(Date.parse(dateTimeString));
});

const schema = {
  type: 'object',
  patternProperties: {
    '^[A-Z]{4}$': {
      type: 'object',
      properties: {
        signatures: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {type: 'string'},
              name: {type: 'string'},
              role: {type: 'string'},
            },
            required: ['id', 'name', 'role'],
            additionalProperties: false,
          },
          uniqueItems: true,
          contains: {type: 'object'},
        },
      },
    },
  },
  properties: {
    generalInformation: {
      type: 'object',
      properties: {
        name: {type: 'string'},
        type: {type: 'string', enum: ['Special', 'Normal']},
        authors: {type: 'string'},
        startDate: {format: 'date'},
        endDate: {format: 'date'},
        prolongationLength: {type: 'number', minimum: 0},
        taxesIncluded: {type: 'boolean'},
      },
      required: [
        'name',
        'type',
        'authors',
        'startDate',
        'endDate',
        'prolongationLength',
        'taxesIncluded',
      ],
      patternProperties: {
        '^[[A-Z]{4}$': {
          type: 'object',
          properties: {
            currencyForAllDiscounts: {
              type: 'string',
              enum: ['JPY', 'GBP'],
              // pattern: '^[[A-Z]{3}$',
            },
            tadigCodes: {
              type: 'object',
              properties: {
                codes: {type: 'string'},
                includeContractParty: {type: 'boolean'},
              },
              required: ['codes', 'includeContractParty'],
              additionalProperties: false,
            },
          },
          required: ['currencyForAllDiscounts', 'tadigCodes'],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  required: ['generalInformation'],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

test({
  generalInformation: {
    name: 'Contract',
    type: 'Special',
    startDate: '2020-01-01T00:00:00.000Z',
    endDate: '2020-02-01T00:00:00.000Z',
    prolongationLength: 12,
    taxesIncluded: true,
    authors: 'Author',
    TMUS: {
      currencyForAllDiscounts: 'JPY',
      tadigCodes: {
        codes: 'Code',
        includeContractParty: true,
      },
    },
    DTAG: {
      currencyForAllDiscounts: 'GBP',
      tadigCodes: {
        codes: 'fsddd',
        includeContractParty: false,
      },
    },
  },
  TMUS: {
    signatures: [
      {
        id: 'signature-0',
        name: 'Signature',
        role: 'ewqoek',
      },
    ],
  },
  DTAG: {
    signatures: [
      {
        id: 'signature-0',
        name: 'Signature',
        role: 'ewqoek',
      },
      {
        id: 'signature-1',
        name: 'fafds',
        role: 'f',
      },
    ],
  },
});

function test(data) {
  const valid = validate(data);
  if (valid) console.log('Valid!');
  else console.log('Invalid: ' + ajv.errorsText(validate.errors));
}
