# exceldb  

![alt text](https://github.com/srldl/edit-tabletest/blob/master/img/ecotox.jpg)

The database version of an excel sheet. Excel-like web user interface which can be connected to a database backend. Lightweight code, vanilla javascript. 

Note: This is a second version, and replaces [edit-tabletest]( https://github.com/srldl/edit-tabletest). 
See issues for errors and flaws as code is tested.
  


## Install

Download and install:

```
npm i github.com/srldl/exceldb
```

## Use


In your html file:
  
  ```
  <head>
  ....
	<link rel="stylesheet" type="text/css" href="style.css">
  </head>
  
  <body>
     <div class="exceldb" style="width: 100%; overflow:auto; float:left; overflow-y:auto; height:85%;">
      
        <button type="button" id="newBtn" >New</button>
        <button type="button" id="copyBtn">Copy</button>
        Add rows: <input type="text" name="addRows" id="addRows" size=2 maxlength=2>
        <button type="button" id="delBtn">Delete</button>
        <button type="button" id="saveBtn">Save</button>

        <table id="edit_table">
          <thead>
             <tr id="header1">
             </tr>
          </thead>
          <tbody id="tbody1">
          </tbody>
        </table>
     </div>

  </body>
  
  ```
The html code is extensive which leave greater flexibility if you want to modify the ui. To include the style.css either copy it directly in the html header as shown, or use transforms for bundling such as [browseriy-css](https://www.npmjs.com/package/browserify-css) (if you use [browserify](http://browserify.org/) ).

If you wish to remove the scrollbars, change them in the first div style, although it is not recommended.

In your javascript file:

```

//Testdata
let dataRows=   [["A","Albuquerque","2019-06-14T12:00:00Z","A1"],
                  ["B","Alicante","2019-06-13T12:00:00Z","B1"],
                  ["C","Alabama","2019-06-14T12:00:00Z","C1 is very loooong text"],
                  ["D","Alkekongen","2019-07-17T12:00:00Z","D1"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date","event"],
              "headers_tooltip": ["project acronym max 5 letters","subproject name","start date","event name"],
              "selectlist": {"project":["A","B","C","D"]},
              "autocompletes": {"subproject":"internal"},
              "dateFields":["event_date"],
              "id": "exceldb",
              "sanitize":true
};


//Require exceldb npm library
let tb = require('@srldl/exceldb/index.js');
 
//Return json object where one array is one row
//Save to database or whatever you wish to do with the return object
//saveDB code should precede calling tb.insertTable so saveDb is known.
function saveDb(jsonObj){
    console.log(jsonObj);
}
  
 //Call edit-tabletest with callback handled in saveDB
 tb.insertTable(obj,saveDb);

  
```
  where
- dataRows: The rows from the database to display (previously saved rows)
- headers: Column headers 
- headers_tooltip: Header field elaborations if you need to explain the header further.
- selectlist: 1) Column headers where the selectlist should be created and 2) the select list alternatives.
- autocompletes: Column headers where autocomplete should be offered. Autocomplete alternatives are unique strings previously written in the same column.
- dataFields: Column headers to be interpreted as a date field.
- id: table id name. Each row id will be called table id name and a running number starting from 1, f.ex. "exceltable-1". If you delete a row, that row id will cease to exist.
- sanitize: Set to true if you wish to sanitize your input. False otherwise.

## Functionality
- Multiple rows can be created and copied. Use "Add rows" to add multiple new or copied rows.
- Only one row can be deleted at a time.
- Dates must be in the format of ISO6801, but since the html 5 input type="date" is used, time is always set to 12 noon f.ex.   "2019-06-14T12:00:00Z"
- Column header names must use letters a-z, 0-9 or underscore ("_") or hyphen ("-"). Space is not allowed.
  
  
 ## Known larger issues
 - autocomplete goes behind the horizontal slider bar for the last rows.
 
 Also, please see issues.
 
  
 








