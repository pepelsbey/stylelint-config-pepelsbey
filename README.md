# stylelint-config-pepelsbey

My [Stylelint](https://stylelint.io/) config.

## Installation

```bash
npm install --save-dev stylelint-config-pepelsbey
```

This config requires the following peer dependencies:

- `stylelint`
- `stylelint-order`

If you don’t have them installed:

```bash
npm install --save-dev stylelint stylelint-order
```

## Usage

Add this to your `stylelint.config.js`:

```js
import config from 'stylelint-config-pepelsbey';

export default config;
```

Or this to your package.json:

```json
"stylelint": {
	"extends": ["stylelint-config-pepelsbey"]
}
```

## License

MIT
