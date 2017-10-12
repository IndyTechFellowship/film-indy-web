module.exports = {
    "env": {
        "browser": true
    },
    "rules": {
        "comma-dangle": ["warn", "never"],
        "max-len": ['warn', 500],
        "semi": ["warn", "never"],
        'react/prefer-stateless-function': ['warn', { ignorePureComponents: true }],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/prefer-default-export": 'off',
        'import/no-named-as-default-member': 'off',
        "no-case-declarations": 'off'
    },
    "extends": "airbnb"
};
