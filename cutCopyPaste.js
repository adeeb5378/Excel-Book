let ctrlKey;
document.addEventListener("keydown",(e)=>{
    ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup",(e)=>{
    ctrlKey = e.ctrlKey;
 });

for(let i=0;i<rows;i++)
{
    for(let j=0;j<cols;j++)
    {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell)
    }

}
let rangeStorage = [];
function handleSelectedCells(cell)
{
    cell.addEventListener("click",(e)=>{
        // Select cells range work 
        if(!ctrlKey)
        {
            return;
        }
        if(rangeStorage.length >= 2)
        {
            // If we want to reselect then 
            // we should not return 
            // return;
            defaultSlectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);
    })
}
function defaultSlectedCellsUI()
{
     for(let i=0;i<rangeStorage.length;i++)
     {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
     }
}
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let copyData =[];
copyBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length < 2)
    {
        return;
    }
    copyData = [];

    let sr = rangeStorage[0][0];
    let sc = rangeStorage[0][1];

    let er = rangeStorage[1][0];
    let ec = rangeStorage[1][1];
    for(let i=sr;i<=er;i++)
    {
        let copyRow = [];
        for(let j=sc;j<=ec;j++)
        {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    // Set UI as previous
    defaultSlectedCellsUI();
});

cutBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length < 2)
    {
        return;
    }
    let sr = rangeStorage[0][0];
    let sc = rangeStorage[0][1];

    let er = rangeStorage[1][0];
    let ec = rangeStorage[1][1];

    // Remove data from UI and DB
    for(let i=sr;i<=er;i++)
    {
        for(let j=sc;j<=ec;j++)
        {
            let cellProp = sheetDB[i][j];

            // Set default value
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGColor = "#000000";
            cellProp.alignment = "left";

            // UI
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click(); 
        }
    }
    // Set UI as previous
    defaultSlectedCellsUI();
    
})




pasteBtn.addEventListener("click",(e)=>{
    // Paste cells data work

    if(rangeStorage < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // Target
    let address = addressBar.value;
    let [stRow,stCol]  = decodeRIDCIDFromAddress(address);

    // r -> refers copy data row
    // c -> refers copy data col
    for(let i=stRow,r=0;i<=stRow+rowDiff;i++,r++)
    {
        for(let j=stCol,c=0;j<=stCol+colDiff;j++,c++)
        {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell) continue;

            // DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;


            // UI
            cell.click();
            
        }
    }

    
})

