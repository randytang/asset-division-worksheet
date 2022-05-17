

let marketValCol = [2,9,16,23,30,37,44];
let debtCol = [3,10,17,24,31,38,45];
let equityCol = [4,11,18,25,32,39,46]
let plaintiffCol = [5,12,19,26,33,40,47];
let defendantCol = [6,13,20,27,34,41,48];
function colInArray(gridCellX) {
    if (marketValCol.includes(gridCellX)) {
        return 'market';
    } else if (debtCol.includes(gridCellX)) {
        return 'debt';
    } else if (equityCol.includes(gridCellX)) {
        return 'equity';
    } else if (plaintiffCol.includes(gridCellX)) {
        return 'plaintiff';
    } else if (defendantCol.includes(gridCellX)) {
        return 'defendant';
    } else {
        return null;
    }
}
const columnsMap = {
    'market' : [marketValCol, '#market_value_total input'],
    'debt' : [debtCol, '#debt_total input'],
    'equity' : [equityCol, '#equity_total input'],
    'plaintiff' : [plaintiffCol, '#plaintiff_total input'],
    'defendant' : [defendantCol, '#defendant_total input']
}

const columnNames = [
    'market',
    'debt',
    'equity',
    'plaintiff',
    'defendant'
];


var bodyElement = document.querySelector('body');
var gridCell_1 = document.querySelector('#row1_column1');

const priceFormat = new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
var setOfGridCells = document.querySelectorAll('.main .grid_cell');
setOfGridCells.forEach(function(gridCell, gridKey, array) {
    for (var i=0; i <= 4; i++) {
        var inputElmt = document.createElement('input');
        inputElmt.addEventListener('keydown', tableNavigation);

        if (!(((gridKey + 1) % 7 == 0) || ((gridKey + 1) % 7 == 1))) {
            inputElmt.setAttribute('class', 'price_formatted');
        } else if ((gridKey + 1) % 7 == 0) {
            inputElmt.addEventListener('input', calculateRow);
            inputElmt.addEventListener('focusout', calculateRow);
        }
        gridCell.append(inputElmt);
    }
})

function checkSubtotals() {
    var totalsCells = document.querySelectorAll('.runningTotalInputCell input');
    var updatedListofTables = document.querySelectorAll('div[class*="table"]');
    for (var j = 0; j < updatedListofTables.length; j++) {
        var subtotalClass = updatedListofTables[j].classList[0];
        subtotalClass = "." + subtotalClass + " .subtotals_row input";
        var subtotalInputCells = document.querySelectorAll(subtotalClass);
        for (var k = 0; k < subtotalInputCells.length; k++) {
            var currentTotalInput = totalsCells[k];
            var currentSubtotalInput = subtotalInputCells[k];
            currentTotalInput.lastValue += currentSubtotalInput.lastValue;
            currentTotalInput.value = priceFormat.format(currentTotalInput.lastValue);
        }
    }

}

function zeroOutSubtotals() {
    var listOfSubtotalCells = document.querySelectorAll('.subtotals_row input');
    for (var i = 0; i < listOfSubtotalCells.length; i++) {
        listOfSubtotalCells[i].lastValue = 0;
    }
}
zeroOutSubtotals();

function zeroOutTotals() {
    var listOfTotalInputCells = document.querySelectorAll('.runningTotalInputCell input');
    for (var i = 0; i < listOfTotalInputCells.length; i++) {
        listOfTotalInputCells[i].lastValue = 0;
    }
}
zeroOutTotals();

function cellNavigation2 (evt) {
    var currentCellID = evt.target.id;
    var rowPattern = /row(\d*)/;
    var colPattern = /column(\d*)/;
    var col = colPattern.exec(currentCellID);
    var colNumber = Number(col[1]);
    var rowArray = rowPattern.exec(currentCellID);
    var row = rowArray[0];
    var rowNumber = Number(rowArray[1]);
    var getNextCell;
    var nextRow;
    var nextColumn;
    var newID;

    var parentTableClassName = evt.target.parentNode.parentNode.classList[0];
    // parentTableClassName = "." + parentTableClassName;

    if (evt.code == 'ArrowDown') {
        nextRow = rowNumber + 1;
        nextRow = "row" + nextRow;
        newID = "#" + parentTableClassName + "_" + col[0] + "_" + nextRow;
        // newID = parentTableClassName + " " + newID;
        getNextCell = document.querySelector(newID);
    } else if (evt.code == 'ArrowUp') {
        nextRow = rowNumber - 1;
        nextRow = "row" + nextRow;
        newID = "#" + parentTableClassName + "_" + col[0] + "_" + nextRow;
        // newID = parentTableClassName + " " + newID;
        getNextCell = document.querySelector(newID);
    } else if (evt.code == 'ArrowRight') {
        nextColumn = colNumber + 1;
        // nextColumn = "#column" + nextColumn + "_" + row;
        nextColumn = "#" + parentTableClassName + "_column" + nextColumn + "_" + row;
        getNextCell = document.querySelector(nextColumn);
    } else if (evt.code == 'ArrowLeft') {
        nextColumn = colNumber - 1;
        // nextColumn = "#column" + nextColumn + "_" + row;
        nextColumn = "#" + parentTableClassName + "_column" + nextColumn + "_" + row;
        // nextColumn = parentTableClassName + " " + nextColumn;
        getNextCell = document.querySelector(nextColumn);
    } else {

    } 

    if (!(getNextCell == null)) {
        getNextCell.focus();
    } else {

    }
}
var listOfTables = document.querySelectorAll('div[class*="table"]');

function createInputElementsForTable() {
    var updatedListofTables = document.querySelectorAll('div[class*="table"]');
    for (var currentTable of updatedListofTables) {
        var tableClassName = currentTable.classList[0];
        var getColumns = document.querySelectorAll('.' + tableClassName +   ' .columns');

        for (var columnNumber = 0; columnNumber < getColumns.length; columnNumber++) {
            for (var rowNumber = 1; rowNumber <= 35; rowNumber++) {
                var inputElmnt = document.createElement('input');
                var columnByOne = columnNumber + 1;
                // var idString = "column" + columnByOne + "_row" + rowNumber;
                var idString = tableClassName + "_" + "column" + columnByOne + "_row" + rowNumber;
                inputElmnt.setAttribute('id', idString);
                inputElmnt.setAttribute('lastValue', null);
                inputElmnt.setAttribute('value', '');
                inputElmnt.addEventListener('keydown', cellNavigation2);
                if (columnNumber >= 3 && columnNumber <= 5 ) {
                    inputElmnt.setAttribute('readonly', "");
                    inputElmnt.setAttribute('style', 'background-color: white')
                }
                getColumns[columnNumber].append(inputElmnt);
            }
        }
    }
}

createInputElementsForTable();

// function setReadonlySecondTable() {
//     var readonlyInputElements = document.querySelectorAll('.table #equity_column input, .table #plaintiff_column input, .table #defendant_column input');
//     for (var i = 0; i < readonlyInputElements.length; i++) {
//         readonlyInputElements[i].setAttribute('style', "background-color:white;");
//         readonlyInputElements[i].setAttribute('readonly', "");
//     }
// }

// setReadonlySecondTable();

var formattedColumnIDs = ['fair_market_value_column', 'debt_column', 'equity_column', 'plaintiff_column', 'defendant_column'];
var readonlyColumnIDs = ['equity_column', 'plaintiff_column', 'defendant_column'];

function createInputElementsForTableNew(tableElmt) {
        var tableClassName = tableElmt.classList[0];
        var getColumns = document.querySelectorAll('.' + tableClassName +   ' .columns');

        for (var columnNumber = 0; columnNumber < getColumns.length; columnNumber++) {
            for (var rowNumber = 1; rowNumber <= 35; rowNumber++) {
                var inputElmnt = document.createElement('input');
                var columnByOne = columnNumber + 1;
                // var idString = "column" + columnByOne + "_row" + rowNumber;
                var idString = tableClassName + "_" + "column" + columnByOne + "_row" + rowNumber;
                inputElmnt.setAttribute('id', idString);
                inputElmnt.setAttribute('lastValue', null);
                inputElmnt.setAttribute('value', '');
                inputElmnt.setAttribute('autocomplete', "off");
                
                if (formattedColumnIDs.includes(getColumns[columnNumber].id)) {
                    applyPriceFormatting(inputElmnt);
                } 
                if (readonlyColumnIDs.includes(getColumns[columnNumber].id)) {
                    inputElmnt.setAttribute('style', "background-color:white;");
                }
                inputElmnt.addEventListener('keydown', cellNavigation2);
                inputElmnt.addEventListener('input', calculateRowNew);
                getColumns[columnNumber].append(inputElmnt);
            }
        }
}

var mainInputElmnts = document.querySelectorAll('.main .grid_cell input');

var inputElmntIndex = 0;
var everyFifthInputIndex = 1;
var firstPass = false;   
for (var gridCellIndex = 0; gridCellIndex < setOfGridCells.length; gridCellIndex++) {
    for (var inner_grid_row = everyFifthInputIndex; inner_grid_row < (everyFifthInputIndex + 5); inner_grid_row++) {
        mainInputElmnts[inputElmntIndex].setAttribute('id', ("grid_cell_" + (gridCellIndex + 1) + "_row_" + inner_grid_row));
        inputElmntIndex++;
    }

    if (gridCellIndex > 1) {
        firstPass = true;
    }

    if (((gridCellIndex + 1) % 7 == 0) && firstPass) {
        everyFifthInputIndex += 5;
    }


}


var runningTotalInputCells = document.querySelectorAll('.runningTotalInputCell input');
for (var i = 0; i < runningTotalInputCells.length; i++) {
    runningTotalInputCells[i].lastValue = null;
}

var priceFormattedElmnts = document.querySelectorAll('.price_formatted');
for (var i = 0; i < priceFormattedElmnts.length; i++) {
    var inputElement = priceFormattedElmnts[i];
    inputElement['firstChange'] = false;
    inputElement['lastValue'] = null;  
    inputElement.addEventListener('focusin', function(e) {
        if (this.lastValue != null) {
            e.target.value = this.lastValue;
        }
    })
    inputElement.addEventListener('input', function(e) {
        this.lastValue = e.target.value;
    })
    inputElement.addEventListener('focusout', function(e) {
        if (this.lastValue) {
            e.target.value = priceFormat.format(this.lastValue); 
        }
    })

    inputElement.addEventListener('focusout', calculateRow);
    inputElement.addEventListener('focusout', updateTotalNew);
}

function tableNavigation (keyEvnt) {
    switch (keyEvnt.code) {
        case 'ArrowUp':
            var topElmtToFind = "#" + upElmnt(keyEvnt);
            var topElmnt = document.querySelector(topElmtToFind);
            topElmnt.focus();
            break;
        case 'ArrowDown':
            var bottomElmtToFind = "#" + belowElmnt(keyEvnt);
            var bottomElmnt = document.querySelector(bottomElmtToFind);
            bottomElmnt.focus();
            break;
        case 'ArrowLeft':
            var leftElmnt = "#" + left_or_rightElmnt(keyEvnt, 'ArrowLeft');
            leftElmnt = document.querySelector(leftElmnt);
            leftElmnt.focus();
            break;
        case 'ArrowRight':
            var rightElmnt = "#" + left_or_rightElmnt(keyEvnt, 'ArrowRight');
            rightElmnt = document.querySelector(rightElmnt);
            rightElmnt.focus();
            break;
    }
}
    

function upElmnt(evnt) {
    var oldId = evnt.target.id;
    var rowRE = /row_(\d*)/;
    var currentRow = rowRE.exec(oldId);
    currentRow = currentRow[1];
    currentRow = Number(currentRow);
    if (currentRow == 1) {
        var canMoveUp = false;
        return oldId;
    } else if (currentRow % 5 == 1) { 
        var colRE = /_(\d*)_/;
        let match =  colRE.exec(oldId)
        var currentCol = match[1]; 
        currentCol = Number(currentCol);
        currentCol -= 7;
        currentCol = "_" + currentCol + "_";
        oldId = oldId.replace(colRE, currentCol);
    }
    currentRow = currentRow - 1;
    currentRow = "row_" + currentRow;
    var newId = oldId.replace(rowRE, currentRow);
    return newId;
}



function belowElmnt(evnt) {
    var oldId = evnt.target.id;
    var rowRE = /row_(\d*)/;
    var currentRow = rowRE.exec(oldId);
    currentRow = currentRow[1];
    currentRow = Number(currentRow);

    if (currentRow % 5 == 0) {
        var colRE = /_(\d*)_/;
        let match =  colRE.exec(oldId)
        var currentCol = match[1]; 
        currentCol = Number(currentCol);
        currentCol += 7;
        currentCol = "_" + currentCol + "_";
        oldId = oldId.replace(colRE, currentCol);
    }
    currentRow = currentRow + 1;
    currentRow = "row_" + currentRow;
    var newId = oldId.replace(rowRE, currentRow);
    return newId;
}

function left_or_rightElmnt(evnt, direction) {
    var oldId = evnt.target.id;
    var colRE = /_(\d*)_/;
    var currentCol = colRE.exec(oldId);
    currentCol = currentCol[1];
    currentCol = Number(currentCol);

    if (direction == "ArrowRight") {
        currentCol = currentCol + 1;
    } else if (direction == "ArrowLeft") {
        currentCol = currentCol - 1;
    }
    currentCol = String(currentCol);
    var re = /_\d*_/;
    currentCol = "_" + currentCol + "_";
    var newId = oldId.replace(re, currentCol);
    return newId;
}



function calculateRow(evnt) {
    var currentID = evnt.target.id;
    var rowRE = /row_(\d*)/;
    var rowMatch = rowRE.exec(currentID);
    var currentRow = rowMatch[0];
    var attributeSelect = 'input[id$="x"]';
    attributeSelect = attributeSelect.replace("x", currentRow);
    var inputElmntsInRow = document.querySelectorAll(attributeSelect);
    var debtInputCell = inputElmntsInRow[2];
    var equityInputCell = inputElmntsInRow[3];
    var fairMarketValue = Number(inputElmntsInRow[1].lastValue);
    var equityInputCalc = fairMarketValue - Number(debtInputCell.lastValue);
    if (!(equityInputCalc == 0)) {
        equityInputCell.lastValue = equityInputCalc;
        equityInputCell.value = priceFormat.format(equityInputCell.lastValue);
    } else if (equityInputCalc == 0) {
        if (!(equityInputCell.lastValue == null)) {
            equityInputCell.lastValue = equityInputCalc;
            equityInputCell.value = priceFormat.format(equityInputCell.lastValue);
        } else {
            equityInputCell.value = '';
        }
    }

    if (inputElmntsInRow[6].value) {
        var percentToP = Number(inputElmntsInRow[6].value) / 100;
        var plaintiffAlloc = equityInputCalc * percentToP;
        var defendantAlloc = equityInputCalc - plaintiffAlloc;
        var plaintiffCell = inputElmntsInRow[4];
        var defendantCell = inputElmntsInRow[5];
        plaintiffCell.lastValue = plaintiffAlloc;
        defendantCell.lastValue = defendantAlloc;
        plaintiffCell.value = priceFormat.format(plaintiffAlloc);
        defendantCell.value = priceFormat.format(defendantAlloc);
    } else {
        var plaintiffCell = inputElmntsInRow[4];
        var defendantCell = inputElmntsInRow[5];
        plaintiffCell.lastValue = 0;
        defendantCell.lastValue = 0;
        plaintiffCell.value = '';
        defendantCell.value = '';
    }

    updateTotalNew();
}

function getInputElmtsForColumn(nameOfColumn) {
    var gridCellsForQuery = columnsMap[nameOfColumn][0];
    var inputElmntsInCol = [];
    var idSelectorPattern = 'input[id*="x"]';
    for (var i=0; i < gridCellsForQuery.length; i++) {
        var gridCellVal = "_" + gridCellsForQuery[i] + "_"; 
        var idSelector = idSelectorPattern.replace("x", gridCellVal);
        var elmntsInGridCell = document.querySelectorAll(idSelector);
        for (var j=0; j < elmntsInGridCell.length; j++) {
            inputElmntsInCol.push(elmntsInGridCell[j]);
        }
    }
    return inputElmntsInCol;
}

var readOnlyInputElmts = [];
var readOnlyColumns = ['equity', 'plaintiff', 'defendant'];
for (var i = 0; i < readOnlyColumns.length; i++) {
    var currentColumnInputs = getInputElmtsForColumn(readOnlyColumns[i]);
    for (var j = 0; j < currentColumnInputs.length; j++) {
        readOnlyInputElmts.push(currentColumnInputs[j]);
    }
}

for (var i = 0; i < readOnlyInputElmts.length; i++) {
    readOnlyInputElmts[i].classList.add("readonly"); 
    readOnlyInputElmts[i].setAttribute("readonly", "");
}

function runTotalForColumnNew(nameOfColumn) {
    var gridCellsForQuery = columnsMap[nameOfColumn][0];
    var inputElmntsInCol = [];
    var idSelectorPattern = 'input[id*="x"]';
    for (var i=0; i < gridCellsForQuery.length; i++) {
        var gridCellVal = "_" + gridCellsForQuery[i] + "_"; 
        var idSelector = idSelectorPattern.replace("x", gridCellVal);
        var elmntsInGridCell = document.querySelectorAll(idSelector);
        for (var j=0; j < elmntsInGridCell.length; j++) {
            inputElmntsInCol.push(elmntsInGridCell[j]);
        }
    }
    var runningTotal = new Number(0);
    for (var i=0; i<inputElmntsInCol.length; i++) {
        var currentElmnt = inputElmntsInCol[i];
        if (currentElmnt.lastValue) {
            var toAdd = Number(currentElmnt.lastValue);
            runningTotal += toAdd;
        }
    }
    var totalAndIDname= [runningTotal, columnsMap[nameOfColumn][1]];
    return totalAndIDname;
}


function updateTotalNew(evnt) {
    for (var i = 0; i < columnNames.length; i++) {
        var currentCol = columnNames[i];
        var totalAndCol = runTotalForColumnNew(currentCol);
        var runningTotal = totalAndCol[0];
        var gridCellID = totalAndCol[1];
        var fmtdValue = priceFormat.format(runningTotal);
        var colRunningTotal = document.querySelector(gridCellID);
        colRunningTotal.lastValue = runningTotal;
        colRunningTotal.value = fmtdValue;

    }
    checkSubtotals();
    calculateFinalPercentages();
}

function calculateFinalPercentages() {
    var plaintiffTotalCell = document.querySelector('#plaintiff_total input');
    var defendantTotalCell = document.querySelector('#defendant_total input');
    var plaintiffPercentageCell = document.querySelector('input[name="plaintiffPercentage"]');
    var defendantPercentageCell = document.querySelector('input[name="defendantPercentage"]');
   if (!(plaintiffTotalCell.lastValue == null)) {
        var equityTotalCell = document.querySelector('#equity_total input');
        if (((equityTotalCell.lastValue == 0 || equityTotalCell.lastValue == null)) 
            || ((plaintiffTotalCell.lastValue == 0 
                || plaintiffTotalCell.lastValue == null) 
                    && ((defendantTotalCell.lastValue == 0) || 
                        defendantTotalCell.lastValue == null))) {
            plaintiffPercentageCell.value = '';
            defendantPercentageCell.value = '';
        } else {
            var plaintiffPercentage = (plaintiffTotalCell.lastValue / equityTotalCell.lastValue ) * 100;
            var defendantPercentage = 100 - plaintiffPercentage;
            plaintiffPercentageCell.value = plaintiffPercentage.toFixed(2);
            defendantPercentageCell.value = defendantPercentage.toFixed(2);

        }
   }
}


function mirrorInput(evt) {
    var whatKey = evt.target.value;
    // var sharedID = evt.target.id;
    // var sharedClass = evt.target.class;
    var sharedClass = evt.target.classList[0];
    // sharedID = "#" + sharedID;
    sharedClass = "." + sharedClass;
    // var targetInputElmts = document.querySelectorAll(sharedID);
    var targetInputElmts = document.querySelectorAll(sharedClass);
    for (const inputElmnt of targetInputElmts){
        inputElmnt.value = whatKey;
    }
}

var headingInputElmnts = document.querySelectorAll('.headings input'); 
for (var inputElmt of headingInputElmnts) {
    inputElmt['lastValue'] = null;
    inputElmt.addEventListener('input', mirrorInput);
}

function applyPriceFormatting(iptElt) {
    iptElt.addEventListener('focusin', function(e) {
        if (this.lastValue == null || this.lastValue == '') {
            e.target.value = '';
        } else {
            e.target.value = this.lastValue;
        }
    });
    iptElt.addEventListener('input', function(e) {
        this.lastValue = e.target.value;
    });
    iptElt.addEventListener('focusout', function(e) {
            if (this.lastValue) {
            this.value = priceFormat.format(this.lastValue);
        }

    })
}

var formattedElmts = document.querySelectorAll('#fair_market_value_column input, #debt_column input, #equity_column input, #plaintiff_column input, #defendant_column input');
for (var inputElt of formattedElmts) {
    applyPriceFormatting(inputElt);
}

function calculateRowNew(evt) {
    var currentRowID = evt.target.id;
    var rowPattern = /row(\d*)/;
    var rowY = rowPattern.exec(currentRowID);
    rowY = rowY[0];
    var whichTable = evt.target.parentNode.parentNode.classList[0];
    whichTable = '.' + whichTable;
    rowY = whichTable + " input[id$=\'" + rowY + "\']";
    var currentRowCells = document.querySelectorAll(rowY);
    
    var fairMarketValCell = currentRowCells[1];
    var debtCell = currentRowCells[2];
    var equityCell = currentRowCells[3];
    var plaintiffCell = currentRowCells[4];
    var defendantCell = currentRowCells[5];
    var percentToPCell = currentRowCells[6];

    if ((fairMarketValCell.lastValue || debtCell.lastValue) && (!(percentToPCell.value == ''))) {
        if (fairMarketValCell.lastValue == undefined) {
            fairMarketValCell.lastValue = 0; 
        }
        if (debtCell.lastValue == undefined) {
            debtCell.lastValue = 0;
        }
        var equity = Number(fairMarketValCell.lastValue) - Number(debtCell.lastValue);
        equityCell.lastValue = equity;
        equityCell.value = priceFormat.format(equity);
        var plaintiffAlloc = (percentToPCell.value / 100) * equity;
        plaintiffCell.lastValue = plaintiffAlloc;
        plaintiffCell.value = priceFormat.format(plaintiffAlloc);
        var defendantAlloc = equity - plaintiffAlloc;
        defendantCell.lastValue = defendantAlloc;
        defendantCell.value = priceFormat.format(defendantAlloc);
    } else if ((fairMarketValCell.lastValue || debtCell.lastValue) && percentToPCell.value == '') {
        if (fairMarketValCell.lastValue == undefined) {
            fairMarketValCell.lastValue = 0;
        }
        if (debtCell.lastValue == undefined) {
            debtCell.lastValue = 0;
        }
        plaintiffCell.lastValue = 0;
        plaintiffCell.value = '';
        defendantCell.lastValue = 0;
        defendantCell.value = '';
        var equity = Number(fairMarketValCell.lastValue) - Number(debtCell.lastValue);
        equityCell.lastValue = equity;
        equityCell.value = priceFormat.format(equity);
    }
    topLevelTotal(evt); 
}

var nonAssetColumnInputs = document.querySelectorAll('#fair_market_value_column input, #debt_column input, #equity_column input, #plaintiff_column input, #defendant_column input, #percentToP_column');
for (var inputCell of nonAssetColumnInputs) {
    inputCell.addEventListener('input', calculateRowNew); 
}

function totalUpcells(listOfCells) {
    var runningTotal = 0;
    for (var currentCell of listOfCells) {
        if (currentCell.lastValue) {
           runningTotal += Number(currentCell.lastValue);
        }
    }
    return runningTotal;
}


function getColumnsToTotal(tableElmnt) {
    var whichTable = tableElmnt;
    var tableChildren = whichTable.children;
    var tableClassName = "." + tableElmnt.classList[0];
    var columnsToTotal = [];
    for (var i=8; i <= 12; i++) {
        var cellID = tableChildren[i].id;
        var selectorString = tableClassName + " #" + cellID;    
        var cellToAdd = document.querySelector(selectorString);
        columnsToTotal.push(cellToAdd);
    }
    return columnsToTotal;
}

function getTotalInputCells(tableNode) {
    var tableChildren = tableNode.children; 
    var tableClassName = "." + tableNode.classList[0];
    var totalInputCells = [];
    for (var i = 15; i <= 19; i++) {
        var cellID = tableChildren[i].id;
        cellID = '#' + cellID + " input";
        var selectorString = tableClassName + " " + cellID; 
        var cellToAdd = document.querySelector(selectorString)
        totalInputCells.push(cellToAdd);
    }
    return totalInputCells;
}

function runTotals(parentTable) {
    var listOfColumns = getColumnsToTotal(parentTable);
    var listOfTotalInputCells = getTotalInputCells(parentTable);
    for (var i = 0; i < listOfColumns.length; i++) {
        var currentColumn = listOfColumns[i];
        var currentTotalInputCell = listOfTotalInputCells[i];
        var selectorForInputCells = '.' + parentTable.classList[0] + " #" + currentColumn.id + " input";
        var inputCells = document.querySelectorAll(selectorForInputCells);
        var totalForThisColumn = totalUpcells(inputCells);
        currentTotalInputCell.lastValue = totalForThisColumn;
        currentTotalInputCell.value = priceFormat.format(totalForThisColumn);
    }
}

function topLevelTotal(evt) {
    var parentTable = evt.target.parentNode.parentNode;
    var tableClass= parentTable.classList[0]; 
    tableClass = "." + tableClass;
    runTotals(parentTable);
    updateTotalNew();
}

var tableCount = 3;
function createAdditionalTable() {
    for (var i = 0; i < 4; i++) {
        var container = document.querySelector('.non_notes_container');
        var breakElmnt = document.createElement('br');
        container.appendChild(breakElmnt);
    }

    var tableHeading = document.createElement('div');
    tableHeading.setAttribute('id', 'asset_division_schedule_heading');
    var h1TableHeading = document.createElement('h1');
    h1TableHeading.innerText = 'ASSET DIVISION SCHEDULE (Table ' + tableCount + ')';
    tableHeading.appendChild(h1TableHeading);
    container.appendChild(tableHeading);

    var tableElmt = document.createElement('div');
    var tableClass = "table";
    tableClass += tableCount;
    tableElmt.setAttribute('class', tableClass);
    container.appendChild(tableElmt);
    var firstHeadingCell = document.createElement('div');
    firstHeadingCell.setAttribute('class', 'headings');
    var h1Assets = document.createElement('h1');
    h1Assets.innerText = 'ASSETS';
    firstHeadingCell.appendChild(h1Assets);
    tableElmt.appendChild(firstHeadingCell);

    var secondHeadingCell = document.createElement('div');
    secondHeadingCell.setAttribute('class', 'headings');
    var h1FairMarketvalue = document.createElement('h1');
    h1FairMarketvalue.innerText = 'FAIR MARKET VALUE';
    secondHeadingCell.appendChild(h1FairMarketvalue)
    tableElmt.appendChild(secondHeadingCell);

    var thirdHeadingCell = document.createElement('div');
    thirdHeadingCell.setAttribute('class', 'headings');
    var h1Debt = document.createElement('h1');
    h1Debt.innerText = 'DEBT';
    thirdHeadingCell.appendChild(h1Debt);
    tableElmt.appendChild(thirdHeadingCell);

    var fourthHeadingCell = document.createElement('div');
    fourthHeadingCell.setAttribute('class', 'headings');
    var h1Equity = document.createElement('h1');
    h1Equity.innerText = 'EQUITY';
    fourthHeadingCell.appendChild(h1Equity);
    tableElmt.appendChild(fourthHeadingCell);

    var fifthHeadingCell = document.createElement('div');
    fifthHeadingCell.setAttribute('class', 'headings');
    var inputPlaintiff = document.createElement('input');
    inputPlaintiff.setAttribute('id', tableClass + '_plaintiff_heading_input');
    inputPlaintiff.setAttribute('class', 'mirrored_input_plaintiff')
    inputPlaintiff.setAttribute('type', 'text');
    inputPlaintiff.setAttribute('autocomplete', "off");
    fifthHeadingCell.appendChild(inputPlaintiff);
    tableElmt.appendChild(fifthHeadingCell);

    var sixthHeadingCell = document.createElement('div');
    sixthHeadingCell.setAttribute('class', 'headings');
    var inputDefendant = document.createElement('input');
    inputDefendant.setAttribute('id', tableClass + '_defendant_heading_input');
    inputDefendant.setAttribute('class', 'mirrored_input_defendant')
    inputDefendant.setAttribute('type', 'text');
    inputDefendant.setAttribute('autocomplete', "off");
    sixthHeadingCell.appendChild(inputDefendant);
    tableElmt.appendChild(sixthHeadingCell);

    var seventhHeadingCell = document.createElement('div');
    seventhHeadingCell.setAttribute('class', 'headings percentToP_column');
    var h1Percent = document.createElement('h1');
    h1Percent.innerText = '% TO P';
    seventhHeadingCell.appendChild(h1Percent);
    tableElmt.appendChild(seventhHeadingCell);

    createColumnDivs(tableElmt);

    createSubtotalsRow(tableElmt);

    createInputElementsForTableNew(tableElmt);

    tableCount++;
}

// helper function for createAdditonalTable()
function createColumnDivs(tableElmt) {
    var idStrings = ['asset_column', 'fair_market_value_column', 'debt_column', 'equity_column', 'plaintiff_column', 'defendant_column', 'percentToP_column'];
    for (var i = 0; i < 7; i++) {
        var divElmt = document.createElement('div');
        divElmt.setAttribute('class', 'columns');
        divElmt.setAttribute('id', idStrings[i])
        tableElmt.appendChild(divElmt);
    }
}

// helper function for createAdditonalTable()
function createSubtotalsRow(tableElmt) {
    var idStrings = ['subtotalColumn', 'market_value_total', 'debt_total', 'equity_total', 'plaintiff_total', 'defendant_total'];
    var childElmts = [];
    var inputIDStrings = ['_market_value_subtotal', '_debt_subtotal', '_equity_subtotal', '_plaintiff_subtotal', '_defendant_subtotal'];

    var labelElmt = document.createElement('label');
    labelElmt.innerText = 'SUBTOTALS (Table ' + tableCount + ')';
    childElmts.push(labelElmt);

    for (var j = 0; j < 5; j++) {
        var inputElmt = document.createElement('input');
        var idString = "table" + tableCount + inputIDStrings[j];
        inputElmt.setAttribute('id', idString);
        inputElmt.setAttribute('type', 'text');
        inputElmt.setAttribute('placeholder', '0.00');
        inputElmt.setAttribute('autocomplete', "off");
        inputElmt.setAttribute('readonly', "");
        inputElmt.lastValue = 0;
        childElmts.push(inputElmt);
    }


    for (var i = 0; i < 7; i++) {
        var divElmt = document.createElement('div');
        divElmt.setAttribute('class', 'subtotals_row');
        if (idStrings[i] !== undefined) {
            divElmt.setAttribute('id', idStrings[i]);
            if (childElmts[i] !== undefined) {
                divElmt.appendChild(childElmts[i]);
            } else {};
        } else {};
        tableElmt.appendChild(divElmt);
    }
}


function disableAutocomplete() {
    var inputElmts = document.querySelectorAll('input');
    for (var i = 0; i < inputElmts.length; i++) {
        inputElmts[i].setAttribute('autocomplete', "off");
    }
}

disableAutocomplete();

createAdditionalTable();

var labelCount;

function addNote(noteText) {
    // var textField = document.querySelector('input[size]');


    var removeBtn = document.createElement('button');
    removeBtn.setAttribute('id', 'remove' + noteCount);
    removeBtn.innerText = 'Remove';
    removeBtn.addEventListener('click', function(e) {
        labelAndNoteDiv.remove();
        noteCount--;
        var labelElements = document.querySelectorAll('label[class*="note"]');
        for (var i = 0; i < labelElements.length; i++) {
            var currentLabel = labelElements[i];
            labelCount = i + 1;
            currentLabel.innerText = labelCount + '.';
        }
    });

    var editBtn = document.createElement('button');
    editBtn.setAttribute('id', 'edit' + noteCount);
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', function(e) {
        var textField = document.querySelector('input[size]');
        textField.value = noteText;
        labelAndNoteDiv.remove();
        var labelElements = document.querySelectorAll('label[class*="note"]');
        for (var i = 0; i < labelElements.length; i++) {
            var currentLabel = labelElements[i];
            labelCount = i + 1;
            currentLabel.innerText = labelCount + '.';
        }
    })

    var labelElements = document.querySelectorAll('label[class*="note"]');
    labelCount = labelElements.length + 1;

    var notes_container = document.querySelector('.notes_container');
    var labelAndNoteDiv = document.createElement('div');
    labelAndNoteDiv.setAttribute('class', 'labelNoteDiv');
    var noteCountLabel = document.createElement('label');
    noteCountLabel.setAttribute('class', 'noteLabel');
    // noteCountLabel.innerText = noteCount + '.';
    noteCountLabel.innerText = labelCount + '.';
    var newNote = document.createElement('p');
    // newNote.setAttribute('id', 'note' + noteCount)
    newNote.setAttribute('id', 'note' + labelCount)
    newNote.innerText = noteText;
    labelAndNoteDiv.appendChild(noteCountLabel);
    labelAndNoteDiv.appendChild(newNote);


    labelAndNoteDiv.appendChild(removeBtn);
    labelAndNoteDiv.appendChild(editBtn);

    notes_container.appendChild(labelAndNoteDiv);
    // noteCount++;
    // evt.target.value = '';
    // textField.value = '';
}


var noteCount = 1;
var notesContainer = document.querySelector('.notes_container');
var noteDiv = document.createElement('div')
noteDiv.setAttribute('class', 'noteContainer');

var textField = document.createElement('input');
textField.setAttribute('placeholder', 'Type note then press "Enter" when finished.');
textField.setAttribute('size', 150);
textField.addEventListener('keydown', function(evt) {
    if (evt.code == 'Enter') {
        // var notes_container = document.querySelector('.notes_container');
        // var labelAndNoteDiv = document.createElement('div');
        // labelAndNoteDiv.setAttribute('class', 'labelNoteDiv');
        // var noteCountLabel = document.createElement('label');
        // noteCountLabel.setAttribute('class', 'noteLabel');
        // noteCountLabel.innerText = noteCount + '.';
        // var newNote = document.createElement('p');
        // newNote.innerText = evt.target.value;
        // labelAndNoteDiv.appendChild(noteCountLabel);
        // labelAndNoteDiv.appendChild(newNote);
        // notes_container.appendChild(labelAndNoteDiv);
        // noteCount++;
        // evt.target.value = '';
        var textField = document.querySelector('input[size]');
        addNote(evt.target.value);
        textField.value = '';
        
    }
})
noteDiv.appendChild(textField);
notesContainer.appendChild(noteDiv);


var fileSystemAccessSupported = '';

if (window.showOpenFilePicker) {
    fileSystemAccessSupported = true;
} else {
    fileSystemAccessSupported = false;
}



function createSnapshot() {
    var state = {};
    var inputElementsToSave = document.querySelectorAll('input[id]');
    for (var i=0; i < inputElementsToSave.length; i++) {
        var currentElement = inputElementsToSave[i];
        var innerObj = {};
        if (currentElement.value && currentElement.lastValue) {
            var value = currentElement['value'];
            var lastValue = currentElement['lastValue'];
            innerObj['value'] = value;
            innerObj['lastValue'] = lastValue;
            state[currentElement.id] = innerObj;
        } else if (currentElement.value) {
            var value = currentElement['value'];
            innerObj['value'] = value;
            state[currentElement.id] = innerObj;
        } else if (currentElement.lastValue) {
            var lastValue = currentElement['lastValue'];
            innerObj['lastValue'] = lastValue;
            state[currentElement.id] = innerObj;
        }
    }

    var paraElmts = document.querySelectorAll('p');
    for (var i=0; i < paraElmts.length; i++) {
        var currentPara = paraElmts[i];
        state[currentPara.id] = currentPara.innerText;
    }
    return state;
}

async function openSaveFileDialog(evt) {
    var opts = { types: [{accept: {'application/json': ['.json']}}]};
    var saveHandle = await window.showSaveFilePicker(opts);
    var writeable = await saveHandle.createWritable();
    var snapshot = createSnapshot();
    var blobbedSnapshot = new Blob([JSON.stringify(snapshot)], {type: 'application/json'});
    await writeable.write(blobbedSnapshot)
    await writeable.close();
}

function saveFile(evt) {
    var snapshot = createSnapshot();
    var blobbedSnapshot = new Blob([JSON.stringify(snapshot)], {type: 'application/json'});
    evt.target.href = URL.createObjectURL(blobbedSnapshot);
}

function restorePropertyAndValue(prop, propValue) {
    if (!prop.includes('note')) {
        var idString = prop;
        idString = "#" + idString;
        var targetElement = document.querySelector(idString);
        for (const innerProp in propValue) {
            targetElement[innerProp] = propValue[innerProp];
        }
    } else {
        addNote(propValue);
    }
}

function loadFile(jsonText) {
    for (const property in jsonText) {
        restorePropertyAndValue(property, jsonText[property]);
    }
}

async function showOpenFileDialog(evt) {
    const pickerOpts = {types: [{accept: {'application/json': ['.json']}}]};
    var [loadHandle] = await window.showOpenFilePicker(pickerOpts);
    var file = await loadHandle.getFile();
    var fileText = await file.text();
    var parsedJSONFile = JSON.parse(fileText);
    loadFile(parsedJSONFile);
}


if (fileSystemAccessSupported) {
    var bodyElement = document.querySelector('body');
    var saveButton = document.createElement('button');
    saveButton.setAttribute('id', 'saveBtn');
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', openSaveFileDialog);
    bodyElement.appendChild(saveButton);

    var loadButton = document.createElement('button');
    loadButton.setAttribute('id', 'loadBtn');
    loadButton.addEventListener('click', showOpenFileDialog);
    loadButton.innerText = 'Load';
    bodyElement.appendChild(loadButton);

} else {
    var bodyElement = document.querySelector('body');
    var saveLink = document.createElement('a');
    saveLink.setAttribute('download', 'snapshot.json');
    saveLink.setAttribute('href', "");
    saveLink.innerText = 'Save';
    saveLink.addEventListener('click', saveFile);
    bodyElement.appendChild(saveLink);

    var loadElmt = document.createElement('input');
    loadElmt.setAttribute('type', 'file');
    // loadElmt.setAttribute('id', 'loadLink');
    loadElmt.setAttribute('accept', "application/json");
    loadElmt.setAttribute('style', 'display:none');
    loadElmt.addEventListener('change', async function(e) {
        // var file = await e.target.files[0];
        var file = await e.target.files[0];
        var fileText = await file.text();
        var parsedJSON = JSON.parse(fileText);
        loadFile(parsedJSON);
    })

    var loadButton = document.createElement('button');
    loadButton.setAttribute('id', 'aliasLoadBtn');
    loadButton.innerText = 'Load';
    loadButton.addEventListener('click', function(e) {
        loadElmt.click();
    });
    bodyElement.appendChild(loadButton);

}