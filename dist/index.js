#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs-extra');
const chalk = require('chalk');
const readXLSXFile = require('read-excel-file/node');
const Excel = require('exceljs');
const unflatten = require('flat').unflatten;
const path = require("path");
const utils_1 = require("./utils");
(async () => {
    try {
        const files = process.argv.slice(2);
        const sourceFileType = files.map((v) => {
            return utils_1.default.getSourceFileType(v);
        }).reduce((p1, p2) => {
            if (p1 === p2) {
                return p1;
            }
            else {
                return '';
            }
        });
        if (!(utils_1.default.isJSON(sourceFileType) || utils_1.default.isXLSX(sourceFileType))) {
            utils_1.default.parseErrorMessage('File type is not supported. Either use JSON or XLSX file to convert.');
            process.exit(1);
        }
        if (utils_1.default.isXLSX(sourceFileType)) {
            const readXlsx = (file) => {
                return readXLSXFile(file).then((rows) => {
                    const titleRow = rows[0];
                    const allLanguages = {};
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
                                allLanguages[titles[secondIdx]][row[0]] = row[secondIdx].replace(/\r/g, '');
                            }
                        }
                    }
                    return allLanguages;
                });
            };
            for (const file of files) {
                readXlsx(file)
                    .then((allLanguages) => {
                    let outputFileName = '';
                    for (const languageTitle in allLanguages) {
                        outputFileName = `${languageTitle.trim().toLowerCase()}${utils_1.default.getFileExtension(file)}`;
                        const unflattenedLanguageObj = unflatten(allLanguages[languageTitle], { object: true });
                        fs.writeFileSync(utils_1.default.documentSavePath(file, outputFileName), JSON.stringify(unflattenedLanguageObj, null, 2), 'utf-8');
                        utils_1.default.log(chalk.yellow(`Output file name for ${languageTitle} is ${outputFileName}`));
                        utils_1.default.log(chalk.grey(`Location of the created file is`));
                        utils_1.default.log(chalk.magentaBright(`${utils_1.default.documentSavePath(file, outputFileName)}\n`));
                    }
                    utils_1.default.log(chalk.green(`File conversion is successful!`));
                })
                    .catch((e) => {
                    utils_1.default.error(chalk.red(`Error: ${e}`));
                    process.exit(1);
                });
            }
        }
        else {
            let outputFile;
            if (files.length > 1) {
                const commonPrefix = utils_1.default.getCommonPathPrefix(files);
                if (commonPrefix === '') {
                    utils_1.default.error(chalk.red(`Error: No common path prefix for output file`));
                    process.exit(1);
                }
                let inputCommon = path.parse(commonPrefix);
                outputFile = path.resolve(inputCommon.dir, `${inputCommon.name}translation.xlsx`);
            }
            else {
                let inputFile = path.parse(files[0]);
                outputFile = path.resolve(inputFile.dir, `${inputFile.name}.xlsx`);
            }
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Converted');
            let keysToRow = {};
            let columnIndex = 2;
            let rowCount = 1;
            const writeToXLSX = (key, value) => {
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
            for (const JSONFile of files) {
                utils_1.default.log(chalk.yellow('Read the JSON file for column ' + utils_1.default.getFileName(JSONFile)));
                utils_1.default.log(chalk.grey('Reading ' + JSONFile));
                const sourceBuffer = await fs.promises.readFile(JSONFile);
                const sourceText = sourceBuffer.toString();
                const sourceData = JSON.parse(sourceText);
                writeToXLSX('Key', utils_1.default.getFileName(JSONFile).toUpperCase());
                const parseAndWrite = (parentKey, targetObject) => {
                    const keys = Object.keys(targetObject);
                    for (const key of keys) {
                        const element = targetObject[key];
                        if (typeof element === 'object' && element !== null) {
                            parseAndWrite(utils_1.default.writeByCheckingParent(parentKey, key), element);
                        }
                        else {
                            writeToXLSX(utils_1.default.writeByCheckingParent(parentKey, key), element);
                        }
                    }
                };
                parseAndWrite(null, sourceData);
                columnIndex += 1;
            }
            for (let i = 1; i < columnIndex; i++) {
                const col = worksheet.getColumn(i);
                col.width = 50;
                col.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
            }
            utils_1.default.log(chalk.yellow(`Location of the created file is`));
            utils_1.default.log(chalk.magentaBright(outputFile));
            await workbook.xlsx
                .writeFile(outputFile)
                .then(() => {
                utils_1.default.log(chalk.green(`File conversion is successful!\n`));
            })
                .catch((e) => {
                utils_1.default.error(chalk.red(`Error: ${e}`));
                process.exit(1);
            });
        }
    }
    catch (e) {
        utils_1.default.error(chalk.red(`Error: ${e}`));
        process.exit(1);
    }
})();
