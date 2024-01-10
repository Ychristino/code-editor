import {makeELementUsable} from './drag_tile.js';

function get_tile_list(tile_type){
    let element = document.querySelector(`tileGroup#${tile_type}`);

    if (!element){
        const LIST = document.querySelector('div#tiles_list');
        const NEW_GROUP = document.createElement('tileGroup');
        NEW_GROUP.id = tile_type;
        LIST.appendChild(NEW_GROUP);
        return NEW_GROUP;
    }
    return element;
}

function display_list(json_list) {

    json_list.forEach(element => {
        const TILE_LIST = get_tile_list(element.tile_type);
        const TILE_ITEM = document.createElement('tileItem');
        const ITEM = create_tile(element)

        TILE_ITEM.appendChild(ITEM);
        TILE_LIST.appendChild(TILE_ITEM);

        TILE_ITEM.style.height = `${ITEM.offsetHeight}px`;
    });
}

function create_tile_header(jsonNode){
    const HEADER = document.createElement('tileHeader');

    let html_output = '';

    if (jsonNode.allow_input){

        if (jsonNode.input_config.slots){
            let header_display = jsonNode.format.match(/<[^>]+>/g);

            header_display.forEach(el=>{
                switch(el){
                    case '<label>':
                        html_output += `<p>${jsonNode.label}</p>`;
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
    const TILE_BODY = document.createElement('tileBody');
    return TILE_BODY;
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

    makeELementUsable(ITEM)
    // ITEM.addEventListener('click', (e)=> makeELementUsable(e.target))
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
