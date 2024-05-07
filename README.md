
<br />

![npm](https://img.shields.io/npm/v/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mksong76/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors/mksong76/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)
![npm](https://img.shields.io/npm/dm/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/mksong76/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/i18n-jsons-to-xlsx-converter?color=blue&style=flat-square)


# i18n-jsons-to-xlsx-converter CLI

<img src="https://repository-images.githubusercontent.com/386980704/45fee350-b9fb-4f33-ab05-8519f23c9af5" title="i18n JSONs to XLSX Converter Logo" width="50%" />

## About

_i18n JSONs to XLSX Converter_ is a CLI tool runs in a terminal, and helps you to convert a **JSON** file(s) to **EXCEL** sheet(s) including keys column defined as nested with dot notation, and the values column for those keys.
Also, the CLI tool converts an **EXCEL** sheet to **JSON** file(s) by considering its values columns as individual files.

## Installation

Install _i18n JSONs to XLSX Converter_ with `npm`

```bash
npm install i18n-jsons-to-xlsx-converter
```

## Usage/Examples

If you have installed _i18n JSONs to XLSX Converter_ you can use it with the command

```bash
i18n-jsons-to-xlsx-converter 'file path of the JSON or XLSX file'
```

If you haven't installed _i18n JSON to XLSX Converter_ you can use it with the command

```bash
${I18N_JSONS_TO_XLSX_CONVERTER}/convert 'file path of the JSON or XLSX file'
```
> Assume that you have it in the directory indicated by the environment variable `I18N_JSONS_TO_XLSX_CONVERTER`


_i18n JSONs to XLSX Converter_ examines and understands your XLSX files if it has multiple language value columns, then it creates one or multiple JSON files from that translation columns provided.

---

If you want to convert multiple JSON files at once, use each file paths provided

```bash
i18n-jsons-to-xlsx-converter 'filePathOne.json' 'filePathTwo.json'
```

If you have group in files, then use a list in common.

```bash
i18n-jsons-to-xlsx-converter my_service/lang/common_{en,ko,ja}.json
```

It would generate `my_service/lang/common_translation.xlsx` including columns
including upper cased file names. (eg. `COMMON_EN`, `COMMON_KO`, `COMMON_JA`)
JSON files should have same keys, so if they has different key sets, then don't
use those files in a command.

## Details

_i18n JSONs to XLSX Converter_ created for helping developers for generating an EXCEL file from their JSON file which is used for i18n translations. Also, developers can create one, or many JSON files from an EXCEL file for their project, as well.
  

#### Features

- It can convert multiple i18n **JSON** file to an **EXCEL** sheet
- It can convert an **EXCEL** sheet to **JSON** file(s) easily
- It runs in a terminal
- Well tested, and documented

#### Reason behind converting a JSON file to an XLSX sheet

A multilingual application, needs translation files in the project to support multiple languages.
Hence, developers need language files in **JSON** file format, and these **JSON** files need to have translation values for each key.  

> Assume that we have a **JSON** file name as `en.json`, and it has a content as
> 
> ```json
>     {
>       "nestedObject": {
>         "nameOfTheArea": {
>           "title": "Title",
>           "subTitle": "Subtitle",
>           "context": "Context"
>         }
>       }
>     }
> ```

Since different teams are handling the translations, and they can't work on the **JSON** files because they are not specialized on the app development, most of them can work on an **EXCEL** sheet easily.

_i18n JSONs to XLSX Converter_ CLI tool helps developers to provide an **EXCEL** sheet ready to include translations for the other teams. It can be filled as an **EXCEL** file with one, or many translation columns they want to provide, and when the translation value implementation is finished, developers can get back the sheet, and convert the **EXCEL** sheet into **JSON** format again, easily.

If the provided **EXCEL** sheet has only one translation value column, the output **JSON** file will be only one, and it will have the column title as file name. In this case it'll be `en.json`

> If the translation team fill out the values in the **EXCEL** sheet for only one language column for example `EN`, in this case the sheet needs to be in the format of
> 
> | Key | EN     |
> | :-------- | :------- |
> | `nestedObject.nameOfTheArea.title` | `Title` |
> | `nestedObject.nameOfTheArea.title` | `Subtitle` |
> | `nestedObject.nameOfTheArea.title` | `Context` |
> 

If the provided **EXCEL** sheet has multiple translation value columns, the output **JSON** files will be multiple, and they will have the column titles as file names. In this case they'll be `en.json`, `nl.json`, `de.json`, 

>
> If the translation team fill out the values in the **EXCEL** sheet for multiple language column for example `EN`, `NL`, `DE`, in this case the sheet needs to be in the format of
 > 
 > | Key | EN     | NL     | DE     |
 > | :-------- | :------- | :------- | :------- |
 > | `nestedObject.nameOfTheArea.title` | `Title` | `Titel` | `Titel` |
 > | `nestedObject.nameOfTheArea.title` | `Subtitle` | `Ondertitel` | `Untertitel` |
 > | `nestedObject.nameOfTheArea.title` | `Context` | `Context` | `Kontext` |
 > 

_i18n JSON to XLSX Converter_ will remove the manual labor for developers to create **JSON** file(s) from an **EXCEL** sheet, also will help developers to create one or more **EXCEL** sheet(s) from a **JSON** file(s) for the translation teams, easily.

  
## Author

[@mksong76](https://www.github.com/mksong76)

For support, email `lanterrt@gmail.com`

## License

[MIT](https://choosealicense.com/licenses/mit/)

  
