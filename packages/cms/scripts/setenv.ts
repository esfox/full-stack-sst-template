import { readFileSync, writeFileSync } from 'fs';

const templatePath = './src/environments/environment.example';
const targetPath = `./src/environments/environment.prod.ts`;

let environmentFileContent = readFileSync(templatePath, 'utf8');

const tokens = [
  {
    token: '{API_URL}',
    replacement: process.env['API_URL'] ?? '',
  },
  {
    token: '{IS_PROD}',
    replacement: 'true',
  },
];

for (const { token, replacement } of tokens) {
  environmentFileContent = environmentFileContent.replaceAll(token, replacement);
}

writeFileSync(targetPath, environmentFileContent);
console.log(`[CMS] Done setting environment variables in path: ${targetPath}`);
