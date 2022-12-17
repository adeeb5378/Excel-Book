let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
let activeSheetColor = "#ced6e0";
addSheetBtn.addEventListener("click",(e)=>{
    let sheet = document.createElement("div");
    sheet.setAttribute("class","sheet-folder");

    let allSheetFolder = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolder.length);

    sheet.innerHTML = `
    <div class="sheet-content">Sheet ${allSheetFolder.length + 1}</div>
    `;
    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();

    // DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
    
}) 

function handleSheetRemoval(sheet)
{
    // left/right click
    sheet.addEventListener("mousedown",(e)=>{
        // e.button -> 0(leftClick),1(scroll button),2(rightClick)
        if(e.button !== 2)
        {
            return;
        }
        let allSheetFolder = document.querySelectorAll(".sheet-folder");
        if(allSheetFolder.length === 1)
        {
            alert("You need to have atleast one sheet!!")
            return;
        }
        else
        {
            let response = confirm("Your sheet will be removed permanently, Are you sure?");
            if(response === false)
            {
                return;
            }
            let sheetIdx = Number(sheet.getAttribute("id"));
            collectedSheetDB.splice(sheetIdx,1);
            collectedGraphComponent.splice(sheetIdx,1);
            // UI
            handleSheetUIRemoval(sheet);

            // By default DB to sheet 1 (active)
            sheetDB = collectedSheetDB[0];
            graphComponentMatrix = collectedGraphComponent[0];
            handleSheetProperties();

        }
    })
}

function handleSheetUIRemoval(sheet)
{
    sheet.remove();
    let allSheetFolder = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolder.length;i++)
    {
        allSheetFolder[i].setAttribute("id",i);
        let sheetContent = allSheetFolder[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolder[i].style.backgroundColor = "transparent";
    }
    // First sheet active color
    allSheetFolder[0].style.backgroundColor = activeSheetColor;
}
function handleSheetDB(sheetIdx)
{
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
    
}
function handleSheetProperties()
{
     for(let i=0;i<rows;i++)
     {
        for(let j=0;j<cols;j++)
        {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
     }
     // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet)
{
    let allSheetFolder = document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolder.length;i++)
    {
        allSheetFolder[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}
function handleSheetActiveness(sheet)
{
    sheet.addEventListener("click",(e)=>{
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet)
    })
}
function createSheetDB()
{
    let sheetDB = [];
    for (let i = 0; i < rows; i++) {
        let sheetRow = [];
        for (let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "monospace",
                fontSize: "14",
                fontColor: "#000000",
                BGColor: "#000000",  // Just for indication purpose,
                value: "",
                formula: "",
                children: [],
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);

}

function createGraphComponentMatrix()
{
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
    
}