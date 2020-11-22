const validationRules = {

  required: (value) => !!value || 'Required',

  email: (value) => {
    if (!value || !value.trim()) return true;
    return /.+@.+/.test(value) || 'E-mail must be valid';
  },

  password: (value) => {
    if (!value || !value.trim()) return true;
    const text = 'The password must contain at least: 1 uppercase letter (A-Z), 1 lowercase letter (a-z), 1 number (0-9), and one special character (E.g. , . _ & ? etc)';
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\u0020-\u002f\u003a-\u0040\u005b-\u0060\u007b-\u007e\u00A7])(?=.{8,})/;
    return pattern.test(value) || text;
  },

  username: (value) => {
    if (!value || !value.trim()) return true;
    return /^[a-z0-9_]*$/.test(value) || 'Username must contain only lowercase letters, numbers and underscores';
  }
};

export {validationRules};
