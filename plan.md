# Card Generator Planning Document

## Import Designs
* Import designs from SVG
* Store in a *Card Design Store*

## Import Data
* Import data from Google Sheets
* Import data from JSON paste?
* Store in a *Data Set Store*
* Count is a **Special Field** that denotes how many copies of a card to print

## Data Mapping
* Give field names in order, to map Google Sheets data into a JSON object


## Options
* Add border between cards?
* Landscape/Portrait?
* Collate Front/Back

## Save / Load
* Save to Local Storage
* Export to JSON backup
* Import from JSON

## Export/Print
* Open Printable page based on
  * Front Design
  * Back Design
  * Data Set


## Stores

### Card Designs
* Array of:
  * Design Name
  * SVG Template

### Card Data Sets
* Array of
  * Data set name
  * Field mappings
  * Data as JSON
  * Google Sheets Source
  * Google Sheets Api Key?

### Options
* Print Options
  * Border?
  * Collate/Fronts then Backs / Fronts only / Backs Only
  * Landscape/Portrait

### UI Store (do not save)
* Google API Key
* Current Page/Section