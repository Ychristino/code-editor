import { loadJSON } from "../tiles/load_tiles.js";

const BUTTON = document.querySelector('#generate_python');
BUTTON.addEventListener('click', generateScript);
const TILES_JSON = await loadJSON();

async function generateScript(event){
    const CODE_AREA = document.querySelectorAll('div#code_area>tile');
    
    let python_code = '';

    CODE_AREA.forEach(tile=>{
        const MAIN_TILE = TILES_JSON.find(tileModel => tileModel.name == tile.id );
        // python_code += writeline(MAIN_TILE)
        const MAIN_HEADER = read_header_code_block(tile);
        console.log(MAIN_HEADER)
        // console.log(2,read_body_code_block(tile));
        
        // tile.querySelectorAll('tileHeader tile').forEach(headerElement=>{
        //     const HEADER_TILE = TILES_JSON.find(tileModel => tileModel.name == headerElement.id );
        //     python_code += writeline(HEADER_TILE, count_indent(headerElement));
        // });

        // tile.querySelectorAll('tileBody tile').forEach(bodyElement=>{
        //     const BODY_TILE = TILES_JSON.find(tileModel => tileModel.name == bodyElement.id );
        //     python_code += writeline(BODY_TILE, count_indent(bodyElement));
        // });
    });

}

function read_header_code_block(tileElement){
    // CAPTURA INPUTS
    let headerInputList = tileElement.querySelectorAll(':scope > tileHeader > tileInput > tile');

    if (headerInputList.length === 0) return writeline(tileElement);
    let inputData = [];

    headerInputList.forEach((inputField, index)=>{
        inputData.push(read_header_code_block(inputField));
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

// function read_body_code_block(tile){
//     const TILEBODY = tile.querySelectorAll('tileBody tile');
//     let tileList = [tile];

//     if (!TILEBODY.length)
//         return tile;

//     TILEBODY.forEach(bodyElement=>{
//         tileList.push(read_body_code_block(bodyElement));
//     })
    
//     return tileList;
// }

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
    let code = currTileJSON.format.match(/<[^>]+>/g);

    // code_line.padStart(count_indent(tileElement), '\t');

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