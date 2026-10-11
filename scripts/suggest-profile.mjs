// npm run suggest-profile -- путь/к/выгрузке.csv
// Читает заголовок и первые строки, печатает черновик профиля формы.
// Файл выгрузки содержит персональные данные: храни его в private/ и не коммить.
import fs from 'node:fs';
import { suggestProfile } from './registrations.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Использование: npm run suggest-profile -- private/registrations/<файл>.csv');
  process.exit(1);
}

const { profile, notes } = suggestProfile(fs.readFileSync(file, 'utf8'));
if (!profile) {
  console.error(notes.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify(profile, null, 2));
if (notes.length) console.error('\nНа что обратить внимание:\n- ' + notes.join('\n- '));
console.error('\nСохрани как scripts/form-profiles/<оператор>.json, поправь id и проверь поля cell.fields.');
