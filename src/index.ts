#!/usr/bin/env node
const fs = require('fs-extra');
const chalk = require('chalk');
const readXLSXFile = require('read-excel-file/node');
const Excel = require('exceljs');
const unflatten = require('flat').unflatten;
import * as path from 'path';
import utils from './utils';

(async () => {
  try {
    const files = process.argv.slice(2);
    const sourceFileType = files.map((v) => {
      return utils.getSourceFileType(v);
    }).reduce((p1, p2) => {
      if (p1 === p2) {
        return p1;
      } else {
        return '';
      }
    });

    if (!(utils.isJSON(sourceFileType) || utils.isXLSX(sourceFileType))) {
      utils.parseErrorMessage('File type is not supported. Either use JSON or XLSX file to convert.');
      process.exit(1);
    }

    if (utils.isXLSX(sourceFileType)) {
      const readXlsx = (file: string) => {
        return readXLSXFile(file).then((rows: string[][]) => {
          const titleRow = rows[0];
          const allLanguages: any = {};
          const titles = [];

          for (const [idx, row] of titleRow.entries()) {
            titles.push(row);

            if (idx > 0) {
              allLanguages[row] = {};
            }
          }

          for (let idx = 1; idx < rows.length; idx++) {
            const row = rows[idx];

            for (let secondIdx = 1; secondIdx < row.length; secondIdx++) {
              if (row[0]) {
                allLanguages[titles[secondIdx]][row[0]] = row[secondIdx].replace(/\r/g,'');
              }
            }
          }

          return allLanguages;
        });
      };

      for (const file of files) {
        readXlsx(file)
          .then((allLanguages: any) => {
            let outputFileName = '';

            for (const languageTitle in allLanguages) {
              outputFileName = `${languageTitle.trim().toLowerCase()}${utils.getFileExtension(file)}`;

              const unflattenedLanguageObj = unflatten(allLanguages[languageTitle], { object: true });

              fs.writeFileSync(utils.documentSavePath(file, outputFileName), JSON.stringify(unflattenedLanguageObj, null, 2), 'utf-8');

              utils.log(chalk.yellow(`Output file name for ${languageTitle} is ${outputFileName}`));
              utils.log(chalk.grey(`Location of the created file is`));
              utils.log(chalk.magentaBright(`${utils.documentSavePath(file, outputFileName)}\n`));
            }

            utils.log(chalk.green(`File conversion is successful!`));
          })
          .catch((e: Error) => {
            utils.error(chalk.red(`Error: ${e}`));

            process.exit(1);
          });
      }
    } else {
      let outputFile: string;
      if (files.length > 1) {
        const commonPrefix = utils.getCommonPathPrefix(files);
        if (commonPrefix === '') {
          utils.error(chalk.red(`Error: No common path prefix for output file`));
          process.exit(1);
        }
        let inputCommon = path.parse(commonPrefix);
        outputFile = path.resolve(inputCommon.dir, `${inputCommon.name}translation.xlsx`);
      } else {
        let inputFile = path.parse(files[0])
        outputFile = path.resolve(inputFile.dir, `${inputFile.name}.xlsx`);
      }
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Converted');

      let keysToRow: Record<string,number> = {};
      let columnIndex = 2;
      let rowCount = 1;
      const writeToXLSX = (key: string, value: string) => {
        let rowIdx = keysToRow[key];
        let writeCol1 = false;
        if (rowIdx === undefined) {
          rowIdx = rowCount;
          rowCount += 1;
          keysToRow[key] = rowIdx;
          writeCol1 = true;
        }
        const rows = worksheet.getRow(rowIdx);
        if (writeCol1) {
          rows.getCell(1).value = key;
        }
        rows.getCell(columnIndex).value = (value || '-').toString();
      };
      for (const JSONFile of files!) {
        utils.log(chalk.yellow('Read the JSON file for column ' + utils.getFileName(JSONFile)));
        utils.log(chalk.grey('Reading ' + JSONFile));
        const sourceBuffer = await fs.promises.readFile(JSONFile);
        const sourceText = sourceBuffer.toString();
        const sourceData = JSON.parse(sourceText);

        writeToXLSX('Key', utils.getFileName(JSONFile).toUpperCase());

        const parseAndWrite = (parentKey: string | null, targetObject: any) => {
          const keys = Object.keys(targetObject);

          for (const key of keys as string[]) {
            const element: any = targetObject[key];

            if (typeof element === 'object' && element !== null) {
              parseAndWrite(utils.writeByCheckingParent(parentKey, key), element);
            } else {
              writeToXLSX(utils.writeByCheckingParent(parentKey, key), element);
            }
          }
        };

        parseAndWrite(null, sourceData);
        columnIndex += 1;
      }
      for (let i = 1 ; i<columnIndex ; i++) {
        const col = worksheet.getColumn(i);
        col.width = 50;
        col.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }
      utils.log(chalk.yellow(`Location of the created file is`));
      utils.log(chalk.magentaBright(outputFile));
      await workbook.xlsx
        .writeFile(outputFile)
        .then(() => {
          utils.log(chalk.green(`File conversion is successful!\n`));
        })
        .catch((e: Error) => {
          utils.error(chalk.red(`Error: ${e}`));

          process.exit(1);
        });
    }
  } catch (e) {
    utils.error(chalk.red(`Error: ${e}`));

    process.exit(1);
  }
})();
