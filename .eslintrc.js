module.exports = {
    "env": {
        "browser": true
    },
    "rules": {
        "semi": ["error", "never"],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/prefer-default-export": 'off',
        'import/no-named-as-default-member': 'off',
    },
    "extends": "airbnb"
};