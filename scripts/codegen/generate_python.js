import { loadJSON } from "../tiles/load_tiles.js";

const BUTTON = document.querySelector('#generate_python');
BUTTON.addEventListener('click', generateScript);
const TILES_JSON = await loadJSON();

async function generateScript(event){
    const CODE_AREA = document.querySelectorAll('div#code_area>tile');

    let python_code = '';

    CODE_AREA.forEach(tileElement=>{
        const MAIN_TILE = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );
        const MAIN_HEADER = readHeaderCodeBlock(tileElement);
        console.log(MAIN_HEADER)
        const MAIN_BODY = readBodyCodeBlock(tileElement);
        });
}

function readHeaderCodeBlock(tileElement){
    let headerInputList = tileElement.querySelectorAll(':scope > tileHeader > tileInput > tile');

    if (headerInputList.length === 0) return writeline(tileElement);
    let inputData = [];

    headerInputList.forEach((inputField, index)=>{
        inputData.push(readHeaderCodeBlock(inputField));
    });

    let formattedData = formatInput(writeline(tileElement), inputData).trim();
    return formattedData
}

function formatInput(string, inputTiles){
    // let splittedString = string.split(/{.*?}/g);
    var i = 0;
    return string.replace(/{.*?}/g, () => {
        return ' ' + inputTiles[i++] + ' ';
    });
}

function readBodyCodeBlock(tileElement){
    let bodyInputList = tileElement.querySelectorAll(':scope > tileBody > tile');

    if (bodyInputList.length === 0) return writeline(tileElement);

    bodyInputList.forEach((bodyTile, index)=>{
        console.log(''.padStart(countIndent(tileElement), '\t'), readHeaderCodeBlock(bodyTile));
        readBodyCodeBlock(bodyTile);
    });
}

function countIndent(element){
    let count = 0;

    while (element) {
        if (element.tagName === "TILEBODY") {
            count++;
        }
        element = element.parentElement;
    }
    return count;
}

function writeline(tileElement){
    let code_line = '';

    let currTileJSON = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );
    let code = currTileJSON.format.match(/<([^>]*)>|([^<]+)/g);

    code_line.padStart(countIndent(tileElement), '\t');

    code.forEach(el=>{
        switch(el){
            case '<label>':
                code_line += `${currTileJSON.python_code}`;
                break;
            case '<input>':
                code_line += '{tileInput}';
                break;
            default:
                code_line += el;
            }
    });

    code_line += currTileJSON.has_scope ? ':' : '';
    return code_line;
}