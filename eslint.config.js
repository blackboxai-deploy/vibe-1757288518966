/**
 * ESLint flat config for the project.
 * Replaces legacy .eslintrc.* and .eslintignore usage.
 * No external dependencies required.
 */
export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'temp_venv/'],
  },

  // Lint worker code and tests
  {
    files: ['workers-site/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // Jest
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {},
  },

  // Lint frontend asset scripts (browser)
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        CustomEvent: 'readonly',
        DOMPurify: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        AbortSignal: 'readonly',
        performance: 'readonly',
        confirm: 'readonly',
        alert: 'readonly',
        Blob: 'readonly',
        FormData: 'readonly',
        FileReader: 'readonly',
        Notification: 'readonly',
        gtag: 'readonly',
        Event: 'readonly',
        btoa: 'readonly',
        // Project globals
        UIUtils: 'writable',
        AnimationUtils: 'writable',
        module: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      // Keep no-undef on; globals above should satisfy common references
      'no-undef': 'error',
    },
  },
];
