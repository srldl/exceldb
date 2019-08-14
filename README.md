# exceldb  

![alt text](https://github.com/srldl/edit-tabletest/blob/master/img/ecotox.jpg)

Excel-like web user interface which can be connected to a database backend. Lightweight code, vanilla javascript. 

Note: This is a first version, work in progress. See issues for errors and flaws. 


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
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.18/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/autofill/2.3.3/css/autoFill.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/keytable/2.5.0/css/keyTable.dataTables.min.css">
	<link rel="stylesheet" type="text/css" href="style.css">
  </head>
  
  <body>
     <div id="edit_table" style="width: 100%; overflow:auto;"></div>
  </body>
  
  ```
  

In your javascript file:

```
//Return json object where one array is one row
function saveToDb(jsonObj){
    console.log(jsonObj);
}


//Create object with input parameters such as
let dataRows=   [["A","Albuquerque","2019-06-14T12:00:00Z","A1"],
                  ["B","Alicante","2019-06-13T12:00:00Z","B1"],
                  ["C","Alabama","2019-06-14T12:00:00Z","C1 has very long event name"],
                  ["D","Alkekongen","2019-07-17T12:00:00Z","D1"]];

//Create object with input parameters
let obj =  {  "dataRows": dataRows,
              "headers": ["project", "subproject", "event_date","event"],
              "headers_tooltip": ["project acronym","subproject name","start date","event name"],
              "selectlist": {"project":["A","B","C","D"]},
              "autocompletes": {"subproject":"internal"},
              "dateFields":["event_date"],
              "id": "exceldb",
              "sanitize":true
};

 //Call edit-tabletest with callback handled in saveToDB
 tb.insertTable( obj, saveToDb);
  
```
  where
- dataRows: The rows from the database to display (typically previously saved rows) og just an empty double array.
- headers: Column headers 
- headers_tooltip: Text describing the column headers more thoroughly.
- selectlist: 1) Column headers where selectlist should be created and 2) the select list alternatives.
- autocompletes: Column headers where autocomplete should be offered. Options for autocomplete are unique names previously written in the same column.
- dataFields: Column headers to be interpreted as a date field.
- id: table id name. Each row id will be called table id name and a running number starting from 1,
f.ex. "exceldb-1"
- sanitize: Set to true if you want to sanitize the input content before saving. Read about the
[[sanitizing|https://gomakethings.com/preventing-cross-site-scripting-attacks-when-using-innerhtml-in-vanilla-javascript/]] used.



## Functionality
- Multiple rows can be created and copied. Use "Add rows" to add multiple new or copied rows.
- Only one row can be deleted at a time.
- Dates must be in the format of ISO6801, but since the html 5 input type="date" is used, time is always set to 12 noon f.ex.   "2019-06-14T12:00:00Z"
- Column header names must use letters A-Z, a-z, 0-9 or underscore ("_") or hyphen ("-"). Space is not allowed.
  
  
 ## Known larger issues
 Testing these days..
 
 
  
 







