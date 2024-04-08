"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const { red, yellow } = require('chalk');
const error = console.error;
const log = console.log;
const info = console.info;
const warn = console.warn;
const documentSavePath = (filePath, outputFileName) => {
    const destinationPath = path.dirname(filePath);
    return path.resolve(destinationPath, outputFileName);
};
const getFileName = (filePath) => {
    return path.parse(filePath).name;
};
const isJSON = (sourceFileType) => sourceFileType === 'json';
const isXLSX = (sourceFileType) => sourceFileType === 'xlsx';
const getSourceFileType = (filePath) => {
    return path.extname(filePath).substring(1).toLowerCase();
};
const getFileExtension = (filePath) => {
    const sourceFileType = getSourceFileType(filePath);
    return !isXLSX(sourceFileType) ? '.xlsx' : '.json';
};
const parseErrorMessage = (message) => {
    return warn(red(message));
};
const createProcessMessageByType = (filePath, sourceFileType, isMultipleJSONFilesValid = false) => {
    return info(yellow(sourceFileType === 'xlsx'
        ? `\nProcessing! \nConverting XLSX to JSON for the file \n${filePath}\n`
        : `\nProcessing! \nConverting JSON to XLSX for the file${isMultipleJSONFilesValid ? 's' : ''} \n${filePath}\n`));
};
const addKeyConnectors = (arr) => {
    return arr.join('.');
};
const writeByCheckingParent = (parentKey, key) => {
    let writeKey = '';
    parentKey !== null ? (writeKey = addKeyConnectors([parentKey, key])) : (writeKey = key);
    return writeKey;
};
const createPathByCheckingSpaceCharacter = (path) => {
    if (path.length === 1) {
        return path[0];
    }
    else {
        let concatenatedPath = '';
        for (const [index, pathPieceSeparatedWithSpace] of path.entries()) {
            if (index === 0) {
                concatenatedPath += pathPieceSeparatedWithSpace;
            }
            else {
                concatenatedPath += ` ${pathPieceSeparatedWithSpace}`;
            }
        }
        return concatenatedPath;
    }
};
const checkForMultipleJSONFileErrors = (filePath, process) => {
    const multipleJSON = filePath.split(',');
    if (multipleJSON.length > 1) {
        const isMultiplePathCorrect = multipleJSON.every((jsonFilePathName) => jsonFilePathName.includes('.json'));
        if (!isMultiplePathCorrect) {
            const isOneJSONPath = multipleJSON.some((jsonFilePathName) => jsonFilePathName.includes('.json'));
            if (isOneJSONPath) {
                error(red('One of the multiple path entries of the JSON file path is wrong.'));
                process.exit(1);
            }
            else if (!isOneJSONPath) {
                error(red('Multiple file conversion only works for JSON files.'));
                process.exit(1);
            }
        }
    }
};
const isMultipleJSONFilePathsValid = (filePath) => {
    const multipleJSON = filePath.split(',');
    return multipleJSON.length > 1 && multipleJSON.every((jsonFilePathName) => jsonFilePathName.includes('.json'));
};
const getJSONFilePaths = (filePath) => {
    return filePath.split(',').map((JSONFilePath) => JSONFilePath.trim());
};
const getCommonPathPrefix = (paths) => {
    return paths.reduce((p1, p2) => {
        for (let i = p1.length; i > 0; i--) {
            const part = p1.substring(0, i);
            if (p2.startsWith(part)) {
                return part;
            }
        }
        return '';
    });
};
exports.default = {
    log,
    warn,
    info,
    error,
    documentSavePath,
    getFileName,
    getCommonPathPrefix,
    getFileExtension,
    isJSON,
    isXLSX,
    getSourceFileType,
    parseErrorMessage,
    createProcessMessageByType,
    addKeyConnectors,
    writeByCheckingParent,
    createPathByCheckingSpaceCharacter,
    isMultipleJSONFilePathsValid,
    checkForMultipleJSONFileErrors,
    getJSONFilePaths,
};
