module.exports = {
    "env": {
        "browser": true
    },
    "rules": {
        "max-len": ['error', 500],
        "semi": ["error", "never"],
        'react/prefer-stateless-function': ['warn', { ignorePureComponents: true }],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/prefer-default-export": 'off',
        'import/no-named-as-default-member': 'off',
    },
    "extends": "airbnb"
};
