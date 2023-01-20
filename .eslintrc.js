/* eslint-disable no-undef */
module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	overrides: [
		{
			files: ['**/*.js', '**/*.jsx'],
			plugins: ['react', 'import'],
			extends: ['eslint:recommended', 'plugin:react/recommended'],
			rules: {
				'react/prop-types': 'off',
				'no-unused-vars': 'off',
				'import/order': [
					'error',
					{
						pathGroups: [
							{
								pattern: 'react',
								group: 'external',
								position: 'before'
							},
							{
								pattern: 'next',
								group: 'external',
								position: 'after'
							},
							{
								pattern: 'common/**',
								group: 'internal',
								position: 'after'
							},
							{
								pattern: 'modules/**',
								group: 'internal',
								position: 'after'
							}
						],
						groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
						'newlines-between': 'always',
						alphabetize: {
							order: 'asc',
							caseInsensitive: true
						},
						pathGroupsExcludedImportTypes: ['react', 'next']
					}
				]
			}
		}
	]
};
