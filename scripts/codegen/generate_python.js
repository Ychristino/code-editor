import { loadJSON } from "../tiles/load_tiles.js";

const BUTTON = document.querySelector('#generate_python');
BUTTON.addEventListener('click', generateScript);

async function generateScript(event){
    const CODE_AREA = document.querySelectorAll('div#code_area>tile');
    const TILES_JSON = await loadJSON();
    let python_code = '';

    CODE_AREA.forEach(tile=>{
        const MAIN_TILE = TILES_JSON.find(tileModel => tileModel.name == tile.id );
        python_code += writeline(MAIN_TILE)

        tile.querySelectorAll('tileHeader>tile').forEach(headerElement=>{
            const HEADER_TILE = TILES_JSON.find(tileModel => tileModel.name == headerElement.id );
            python_code += writeline(HEADER_TILE, count_indent(headerElement));
        });

        tile.querySelectorAll('tileBody tile').forEach(bodyElement=>{
            const BODY_TILE = TILES_JSON.find(tileModel => tileModel.name == bodyElement.id );
            python_code += writeline(BODY_TILE, count_indent(bodyElement));
        });
    });

    console.log(python_code)
}

function count_indent(element){
    let count = 0;

    while (element) {
        if (element.tagName === "TILEBODY") {
            count++;
        }
        element = element.parentElement;
    }
    return count;
}

function writeline(tileJson, indent){
    let code = tileJson.format.match(/<[^>]+>/g);
    let code_line = '\n';
    for (let tab_indent = 0; tab_indent < indent; tab_indent++) {
        code_line += '\t';
    }

    code.forEach(el=>{
        switch(el){
            case '<label>':
                code_line += `${tileJson.python_code}`;
                break;
            case '<input>':
                // html_output += '<input></input>';
                break;
            default:
                code_line += el;
        }
    })

    if (tileJson.has_scope)
        code_line += ':';

    return code_line;
}