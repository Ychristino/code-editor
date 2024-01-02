import {makeELementUsable, makeElementDraggable} from './drag_tile.js';

function display_list(json_list) {
    const TILES_LIST = document.getElementById('tiles_list');

    json_list.forEach(element => {
        const ITEM = create_tile(element)
        TILES_LIST.appendChild(ITEM);
    });
}
function create_tile_header(jsonNode){
    const HEADER = document.createElement('tile_header');

    let html_output = '';

    if (jsonNode.allow_input){

        if (jsonNode.input_config.slots){
            let header_display = jsonNode.format.match(/<[^>]+>/g);

            header_display.forEach(el=>{
                switch(el){
                    case '<label>':
                        html_output += jsonNode.label;
                        break;
                    case '<input>':
                        html_output += '<input></input>';
                        break;
                    default:
                        html_output += el;
                }
            })
            HEADER.innerHTML = html_output;
        }
    }
    else{
        HEADER.innerHTML = jsonNode.label;
    }
    return HEADER;
}

function create_tile_body(jsonNode){
    return document.createElement('tile_body');
}

function create_tile(jsonNode){
    const ITEM = document.createElement('tile');
    ITEM.id = jsonNode.name;
    ITEM.classList.add(jsonNode.tile_type);

    const HEADER = create_tile_header(jsonNode);
    const BODY = create_tile_body(jsonNode);

    ITEM.appendChild(HEADER);

    if (jsonNode.has_scope){
        ITEM.appendChild(BODY)
    }

    ITEM.addEventListener('click', (e)=> makeELementUsable(e.target))
    return ITEM;
}
async function loadJSON() {
    try {
        const response = await fetch('http://localhost:8000/tiles.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar o JSON:', error);
    }
}

async function main() {
    const TILES_JSON = await loadJSON();
    if (TILES_JSON) {
        display_list(TILES_JSON);
    }
}

main();
