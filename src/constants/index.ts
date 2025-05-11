import path from 'path';
import fs from 'fs';

const readFileFromPath = (filePath: string) => {
  const filDir = path.join(__dirname, filePath);
  return fs.readFileSync(filDir, 'utf8');
};

const forgotPasswordTemplate = readFileFromPath(
  '/templates/forgotPassword.html'
);

import errorCodes from './jsons/errorCodes.json';

export {errorCodes, forgotPasswordTemplate};
