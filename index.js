'use strict';
var exports = module.exports = {};

//require('./style.css');

//Testdata
//the rows
/*let dataRows=   [["A","Albuquerque","2019-06-14T12:00:00Z","A1"],
                  ["B","Alicante","2019-06-13T12:00:00Z","B1"],
                  ["C","Alabama","2019-06-14T12:00:00Z","C1 is very long text event name"],
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
};*/

exports.insertTable = function(obj, callback) {

//Unfortunately, some global parameters
//This counter holds next row_number
var row_length = 1;
//Holds the array marked for copy
var drag_arr = [];
//The previous selected cell
var prev_selected_cell = '';


//Create input cell
//inputValue =
//typefield = element type
//autocomplete = internal autocomplete
//disabled = input field disabled?
function input_element(id_td,id, inputValue, typefield, autocomplete, readonly){
  var td = document.createElement("td");
  td.id = id_td;
  //if column has autocomplete attach class
  if (autocomplete){
        td.classList.add("autocomplete2");
  };
  //Child element
  var input = document.createElement("input");
  input.type = typefield;
  input.id = id;
  input.value= inputValue;
  if (readonly) {
      input.setAttribute("readonly", true);
  }
  td.appendChild(input);
  return td;
}


//Create select cell
function select_element(id_td, id_select, header_name, val){
  var td = document.createElement("td");
  td.id = id_td;

  //Find the select options from the input object named obj
  var arr = obj.selectlist[header_name];
  var returnstring = '';
  if (arr != undefined) {
        for (var i in arr) {
            if (arr[i] === val) {
              returnstring += "<option value='" + arr[i] + "'selected>" + arr[i] + "</option>";
            } else {
              returnstring += "<option value='" + arr[i] + "'>" + arr[i] + "</option>";
            }
        }
    }
    var select = document.createElement("select");
    select.id = id_select;
    select.innerHTML = returnstring;
    td.appendChild(select);
    return td;
}


//Create header element
function th_element(id,textContent, textTooltip){
  var th = document.createElement("th");
  th.id = id;
  th.title = textTooltip;
  th.textContent = textContent;
  return th;
}

//Create new td element
function td_element (id,innerhtml){
    var td0 = document.createElement("td");
    td0.id = id;
    td0.innerHTML = innerhtml;
    return td0;
}

//Create the next row in the table
//Called by newBtn, copyBtn, and during table initialization
function newRow(num,input_text,id){


//Number of rows
for (var i=0;i<num;i++){
    var tr = document.createElement("tr");
    //Count column
    tr.appendChild(td_element('count_'+row_length,row_length));
    //Second to almost last column is user info
    var td;

    for (var j=0;j<obj.headers.length;j++){

      //Difference between empty row and row with input
      //If header is not defined in the row, set it to empty
      if ((input_text.length > 0)&&(typeof (input_text[i][obj.headers[j]]) != 'undefined')){
        var inp = (input_text == '') ? '' : (input_text[i][obj.headers[j]]);
      } else {
        var inp = ''
      }

      if (obj.selectlist.hasOwnProperty(obj.headers[j])) {  //Select field
         td = select_element('td_'+row_length+'_'+(j+1),'select_'+row_length+'_'+(j+1),obj.headers[j],inp);

      } else if (obj.dateFields.includes(obj.headers[j])){  //input date field
          var date = (inp == '') ? '' : inp.substring(0,10);
          td = input_element('td_'+row_length+'_'+(j+1),'input_'+row_length+'_'+(j+1),date,'date',false,false);
      } else if ((j === (obj.headers.length-1))&&(id === false)) {//last field containing ids should not be modified
          td = input_element('td_'+row_length+'_'+(j+1),'input_'+row_length+'_'+(j+1),inp,'text',true, true);
      } else if ((j === (obj.headers.length-1))&&(id === true)) {//last field - create new id
          //Get the last written id
          if (container.lastChild.cells) {
             var id_num = container.lastChild.cells[obj.headers.length].lastChild.value;
             var id_arr = id_num.split('-'); //split to get the running number
             inp = obj.id +  "-" + (parseInt(id_num.split('-')[id_arr.length-1]) + 1).toString(); //The new, calculated id value
          } else {
             inp = obj.id +  "-1";
          }
          td = input_element('td_'+row_length+'_'+(j+1),'input_'+row_length+'_'+(j+1),inp,'text',true, true);
      } else {  //ordinary input field
          td = input_element('td_'+row_length+'_'+(j+1),'input_'+row_length+'_'+(j+1),inp,'text',true, false);
      }
      tr.appendChild(td);

}

//Id columns
//tr.appendChild(td_element('id_'+row_length,obj.id+'-'+row_length));
row_length++;
container.appendChild(tr);
}
}

  //Table initialization
  //1. Create headers:
  var container_header = document.getElementById("header1");

  //a. First column is the count..
  var th0 = th_element("header_0","no",'');
  container_header.appendChild(th0);

  //b. ..the next is the user headings..
  for (var i=0;i<obj.headers.length;i++){
      var th = th_element("header_"+ i,obj.headers[i],obj.headers_tooltip[i]);
      container_header.appendChild(th);
  }

  //c. ..finally the id header
//  var th_last = th_element("header_"+obj.headers.length,"id",'');
//  container_header.appendChild(th_last);

  //2. Insert values into table body
  var container = document.getElementById("tbody1");

  //This only applies if obj.dataRows (fetched rows) is empty, otherwise omitted
  if (obj.dataRows === undefined || obj.dataRows.length === 0) {
    newRow(1,"",true);
  } else {
    //The table body
    newRow(obj.dataRows.length,obj.dataRows,false);
    //Set up autocomplete if existing
    var autocomplete = document.getElementsByClassName("autocomplete2");
  }

  //Autocompletes internal function:
  //Fetch all values from the chosen column.
  //Used as selections in the autocomplete list for that column
  function  autocomplete_col_values(col,row) {
          var arr = [];
         for (var i=1;i<row_length;i++){
            if (i === row) {continue};
            var val = document.getElementById("input_"+i+"_"+col);
            if (arr.includes(val.value) === false){
                  arr.push(val.value);
            }
         };
         return arr;
  }

  //Autocomplete function
  function autocomplete(arr,input_field){
    var currentFocus;

    input_field.addEventListener("input", function(e) {
      var a, b, i, val = this.value;

      //close any already open lists of autocompleted values
      closeAllLists(input_field);

    if (!val) { return false;}
     currentFocus = -1;
     /*create a DIV element that will contain the items (values):*/
     a = document.createElement("div");
     a.setAttribute("id", input_field.id + "autocomplete2-list");
     a.setAttribute("class", "autocomplete2-items");
     /*append the DIV element as a child of the autocomplete container:*/
     input_field.parentNode.appendChild(a);
     /*for each item in the array...*/
     for (i = 0; i < arr.length; i++) {
       /*check if the item starts with the same letters as the text field value:*/
       if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
         /*create a DIV element for each matching element:*/
         b = document.createElement("div");
         /*make the matching letters bold:*/
         b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
         b.innerHTML += arr[i].substr(val.length);
         /*insert a input field that will hold the current array item's value:*/
         b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
         /*execute a function when someone clicks on the item value (DIV element):*/
             b.addEventListener("click", function(e) {
             /*insert the value for the autocomplete text field:*/
             input_field.value =this.getElementsByTagName("input")[0].value;
             /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists(input_field);
    });
    a.appendChild(b);
  }
}
})
};


//Drag and drop - drag over event
var dragover = function(event){
      var id = event.target.id;
      //Don't copy yet, add id to drag_arr - drag_arr should only contain same values in a row
     if ((id.startsWith('td'))&&(id !== drag_arr[drag_arr.length-1])) {
       //if user have returned back (regretting), skip last cell
       if (id === drag_arr[drag_arr.length-2]) {
         //Remove selected border
         document.getElementById(drag_arr[drag_arr.length-1]).classList.remove('dragCell');
         drag_arr.pop();
       } else {  //No user regrets, continue dragging
         //Set a border so the user can see the cell is selected
         document.getElementById(id).classList.add('dragCell');
         drag_arr.push(id);

       }
     }
 };

 //Drag and drop - end of dragging
var dragend = function(event){
    //If drop_arr last value is equal to first value, skip everything.
    //The user has withdraw the action.
    var drop_value = document.getElementById(event.target.id).childNodes[0].value;
    for (var i=0;i<(drag_arr.length);i++) {
          var elem = document.getElementById(drag_arr[i]);
          elem.classList.remove('dragCell');
          if (drag_arr[drag_arr.length-1] !== event.target.id) {
             elem.childNodes[0].value = drop_value;
          }
    }
    //Reset drag_arr until next drag/drop
    drag_arr = [];
 };

 //Drag and drop - disable drop
var drop = function (event) {
   event.preventDefault();
 };

 // This function checks if an arrow key has been pressed
 // If so, it changes focus
 function checkKey(event) {
 event = event || window.event;

 var pos = document.activeElement.id.split("_");
 var row = parseInt(pos[1]);
 var col = parseInt(pos[2]);

 //Check if field use autocomplete
 if (obj.autocompletes[obj.headers[col-1]]) {
   if (obj.autocompletes[obj.headers[col-1]] == 'internal' ) {
   //If yes, fetch values
   var arr = autocomplete_col_values(col,row);
   autocomplete(arr,document.activeElement);
 } else {
   console.log("external list");
 }
 }

 if (event.keyCode == '9') {
   //Tab
   remove_select(prev_selected_cell);
   add_select(document.activeElement.parentNode.id);
 } else if (event.shiftKey && event.keyCode == 9) {
   //Shift+TAB
   remove_select(prev_selected_cell);
   add_select(document.activeElement.parentNode.id);
 }
}


 //Upon clicking in table
var click = function (event) {
   //Autocomplete - close all lists
   closeAllLists(event.target);

   var doc = document.getElementById(event.target.id);

   if (doc === null) { return };
  // if ((doc === null)||(doc.value == '')) { return };

   var elem = doc.parentElement;
   //Remove borders from the previous selected cell
   if (prev_selected_cell !== '') { remove_select(prev_selected_cell)};
   //Update to select current cell
   add_select(elem.id);

   if ((event.target.id).startsWith('input') || (event.target.id).startsWith('select')) {
       //Make it draggable
       elem.draggable = "true";
       elem.ondragstart = addEventListener('dragstart', function(event) { event.dataTransfer.setData('text/plain', doc.value); });
 }
};

//Autocomplete
function addActive(x) {
   /*a function to classify an item as "active":*/
   if (!x) return false;
   /*start by removing the "active" class on all items:*/
   removeActive(x);
   if (currentFocus >= x.length) currentFocus = 0;
   if (currentFocus < 0) currentFocus = (x.length - 1);
   /*add class "autocomplete-active":*/
   x[currentFocus].classList.add("autocomplete2-active");
 }

 //Autocomplete
 function removeActive(x) {
   /*a function to remove the "active" class from all autocomplete items:*/
   for (var i = 0; i < x.length; i++) {
     x[i].classList.remove("autocomplete-active");
   }
 }

 //Autocomplete
 function closeAllLists(input_field,elmnt) {
   /*close all autocomplete lists in the document,
   except the one passed as an argument:*/
   var x = document.getElementsByClassName("autocomplete2-items");
   for (var i = 0; i < x.length; i++) {
     if (elmnt != x[i] && elmnt != input_field) {
     x[i].parentNode.removeChild(x[i]);
   }
 }
}

//Cell selection -called by click and keyup events
//Remove old cell selection from last selected cell
function remove_select(prev_selected_cell){
   if (document.getElementById(prev_selected_cell)) {
     document.getElementById(prev_selected_cell).classList.remove('selectCell');
   }
}

//Cell selection -called by click and keyup events
//Add new cell selection to current cell
function add_select(curr_selected_cell){
    if (document.getElementById(curr_selected_cell)) {
        prev_selected_cell = curr_selected_cell;
        document.getElementById(curr_selected_cell).classList.add('selectCell');
   }
}

//SanitizeHTML from 2018 Chris Ferdinandi,
//MIT License, https://gomakethings.com
//Called from savebtn
var sanitizeHTML = function (str) {
	var temp = document.createElement('div');
	temp.textContent = str;
	return temp.innerHTML;
};

//Get the values of a row through the tr element
//Returns a double arry with table values
//Sanitizes, called by savebtn and copybtn
function get_row_values(tr) {
  var arr = [];
  for (var i=1;i<tr.childNodes.length; i++){
    var str = tr.childNodes[i].childNodes[0].value;
    //sanitize input if requested
    let temp = str;
    if (obj.sanitize === true) {temp = sanitizeHTML(str); }
    arr.push(temp);
  }
  //arr.push(tr.childNodes[col_length-1].childNodes[0].data);
  return [arr];
}

//Get the user input number of wanted new/copied rows
//Called by newBtn and copyBtn
function addRows(){
   var num = document.getElementById("addRows").value;
   return (num == "") ? 1 : num;
};

//new button pressed
var newBtn = function (event) {
    //Get number of new rows wanted
    var num = addRows();
    newRow(num,"",true);
};

// copy button pressed
var copyBtn = function (event) {
    if (prev_selected_cell == '') {
       alert("Please select a row");
    } else {    //Get the selected row
       //Get number of new rows wanted
       var num = addRows();
       //Get input values from row to be copied
       var tr = document.getElementById(prev_selected_cell).parentElement;
       var arr = get_row_values(tr);
       //Id is returned as well, remove it.
       arr[0].pop();
       var obj2 = {};
       //Need to convert array to object
       for (var k=0;k<obj.headers.length;k++){
          obj2[obj.headers[k]] = arr[0][k];
       }
       //Create requested row(s) with the values
       for (var i=0;i<num;i++){
           newRow(1,[obj2],true);
       }
    }
};

// save button pressed
var delBtn = function (event) {
    if (prev_selected_cell == '') {
       alert("Please select a row");
    } else {    //Get the selected row
       var td = (document.getElementById(prev_selected_cell));
       document.getElementById("tbody1").removeChild(td.parentElement);
    }
};

// save button pressed
var saveBtn = function (event) {
    var saveJson = [];
    var arr=[];
    container = document.getElementById("tbody1");
    //Fetch values by row, store in double array

    for (var i=1;i<row_length;i++){
        if (typeof(container.childNodes[i]) !== 'undefined'){
         var tr = get_row_values( container.childNodes[i]);
         arr.push(tr[0]);
    }}
    saveJson.push(arr);
    obj.dataRows = saveJson[0];
    callback(obj);
};

document.getElementById("tbody1").addEventListener("dragover", dragover);
document.getElementById("tbody1").addEventListener("dragend", dragend);
document.getElementById("tbody1").addEventListener("drop", drop);
document.getElementById("tbody1").addEventListener('keyup', checkKey);
document.getElementById("tbody1").addEventListener('click', click);
document.getElementById("newBtn").addEventListener('click', newBtn);
document.getElementById("copyBtn").addEventListener('click', copyBtn);
document.getElementById("delBtn").addEventListener('click', delBtn);
document.getElementById("saveBtn").addEventListener('click', saveBtn);

}
