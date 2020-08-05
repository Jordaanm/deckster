# Help

## Project Management
The Project represents all of the information associated with a game. Within a single project you can have multiple card designs, data sets, and composed decks of cards.

Under the project tab, you will find controls to manage the saving and loading of your project.

You can manually make backups by clicking the Export to File button, and load a Project file by clicking the Import from File button.

You can also set up autosave, which will save your project within the browser automatically, on a fixed interval, allowing you to continue work on the project without fear of accidentally closing the window and losing your progress.

>Note: There is a limit to how much data can be stored locally. If you find your Project is getting large (especially regarding images), its best to rely on manually saving to file, rather than the local autosave.

### Keyboard Shortcuts
To help with project management, several keyboard shortcuts have been made available, which you can use from any part of the application.

* Save Project Locally: `alt + S`
* Export Project to File: `alt + shift + S`
* Import Project from File: `alt + O`
* Toggle Autosave: `alt + shift + A`

## Creating a Design

Under the Designs tab, you can create card templates. These templates are written as HTML and CSS.

The design templates get combined with the data sets (see Importing Data section below) to produce the final result. To mark a section of the template for use by a field in the data set, add a `data-fieldid` attribute to the target element, giving a value of the intended data set field name.

For Example:

```html
<div class="monster-card">
  <h1 data-fieldid="monster_name">MONSTER NAME HERE</h1>
  <div className="stats">
    ...
  </div>
  <footer data-fieldid="flavor_text"></footer>
</div>
```

## Importing Data

Under the Data Sets tab, you can import and edit data sets to populate cards.

Each data set has a defined set of fields associated with it.

### Importing from Google Sheets

By clicking the Import Data button, you can import a table of data from Google Sheets by providing the Sheet ID, a valid Google API Key, and the sheet/range you wish to import.

Once the table of data is imported, you can map each column (by index) to a field in this data set, and populate the data set as a map of fields and values.

## Including Images

Under the Images tab, you can import images into the project.

You can bring in images that have been imported to the project to your card designs, by using the format `![imageName]`. When rendering the card, this text will be replaced with an `img` element containing the image with the given name. If you want to give that image element a class attribute, you can use the format `![imageName|classList]`

## Data Transformations

This feature is not yet implemented

## Rendering Decks of Cards

Under the Render Cards tab, you will find tools to produce decks of cards, ready for use.
You can create multiple configuration, each one able to handle one deck of cards.

1. Select the designs for the faces and backs of the cards.
2. Select the data set to be used with these designs
3. Map data transforms to each of the fields in the data set
4. Select a layout for card faces and backs
5. Set a scale. By default, the cards will render at 320x445px (5px per mm for a standard playing card). Increasing the scale will generate higher resolution cards.
6. Hit the Generate Cards button
7. You can select individual cards to download, or download the entire deck as a zip file. This is all handled client-side, meaning no large downloads to process.