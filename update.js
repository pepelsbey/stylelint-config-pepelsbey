import bcd from '@mdn/browser-compat-data' with { type: 'json' };
import { writeFileSync } from 'node:fs';
import { propertiesOrder } from './order.js';

const checkOnly = process.argv.includes('--check');

const excludeProperties = new Set([
	'alt',				// Deprecated, Safari 9 only, no real usage
	'ime-mode',			// Deprecated, old Firefox/Edge only
	'custom-property',	// Meta-property for --* CSS variables, not a real property name
]);

const bcdProperties = Object.keys(bcd.css?.properties || {})
	.filter(prop => !prop.startsWith('-webkit-') && !prop.startsWith('-moz-'))
	.filter(prop => !excludeProperties.has(prop))
	.sort();

const existingProperties = new Set(propertiesOrder);

console.log(`BCD properties: ${bcdProperties.length}`);
console.log(`Config properties: ${propertiesOrder.length}\n`);

// Find duplicate properties in the config
const seen = new Set();
const duplicateProperties = propertiesOrder.filter(prop => {
	if (seen.has(prop)) {
		return true;
	}
	seen.add(prop);
	return false;
});

if (duplicateProperties.length > 0) {
	console.log(`🔁 Found ${duplicateProperties.length} duplicate(s) in the config:\n`);
	duplicateProperties.forEach(prop => console.log(`- ${prop}`));
	console.log();
}

// Find properties in the config that are not in BCD
const extraProperties = propertiesOrder.filter(prop => !bcdProperties.includes(prop));

if (extraProperties.length > 0) {
	console.log(`📋 Found ${extraProperties.length} config propert${extraProperties.length === 1 ? 'y' : 'ies'} not in BCD:\n`);
	extraProperties.forEach(prop => console.log(`- ${prop}`));
	console.log();
}

// Find properties that are in BCD but missing from the config
const missingProperties = bcdProperties.filter(prop => !existingProperties.has(prop));

if (missingProperties.length === 0) {
	console.log('✅ All BCD properties are present in the config!');
} else {
	console.log(`⚠️ Found ${missingProperties.length} missing propert${missingProperties.length === 1 ? 'y' : 'ies'}:\n`);
	missingProperties.forEach(prop => console.log(`- ${prop}`));

	writeFileSync('missing.json', JSON.stringify(missingProperties, null, '\t') + '\n');
	console.log('\nWrote missing.json');
}

// --check mode: fail only on duplicates (for CI/test)
// Default mode: fail on missing properties (for update workflow)
if (checkOnly) {
	process.exit(duplicateProperties.length > 0 ? 1 : 0);
} else {
	process.exit(missingProperties.length > 0 ? 1 : 0);
}
