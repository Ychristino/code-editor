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

    const HEADER_RECURSION = (tileElement) =>{
        let displayList = [];
        let headerInputList = tileElement.querySelectorAll(':scope > tileHeader > tileInput > tile');
    
        if (headerInputList.length === 0)
            return displayList;
    
        headerInputList.forEach(childElement=>{
            displayList.push(childElement);
            displayList = displayList.concat(HEADER_RECURSION(childElement));
        });
        return displayList    
    };

    HEADER_RECURSION(tileElement).forEach((headerTile, index)=>{
        let currTileJSON = TILES_JSON.find(tileModel => tileModel.name == headerTile.id );

        if (currTileJSON.allow_input){
            currTileJSON.input_config.slots
        }
        console.log(writeline(HEADER_RECURSION(tileElement)));
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
                code_line += tileInput.shift();
                break;
            default:
                code_line += el;
            }
    });

    // code_line += currTileJSON.has_scope ? ':' : '';
    return code_line;
}