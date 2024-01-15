import {makeELementUsable} from './drag_tile.js';

function getTileList(tileType){
    let element = document.querySelector(`tileGroup#${tileType}`);

    if (!element){
        const LIST = document.querySelector('div#tiles_list');
        const NEW_GROUP = document.createElement('tileGroup');
        NEW_GROUP.id = tileType;
        LIST.appendChild(NEW_GROUP);
        return NEW_GROUP;
    }
    return element;
}

function displayList(jsonList) {

    jsonList.forEach(element => {
        const TILE_LIST = getTileList(element.tile_type);
        const TILE_ITEM = document.createElement('tileItem');
        const ITEM = createTile(element)

        TILE_ITEM.appendChild(ITEM);
        TILE_LIST.appendChild(TILE_ITEM);

        TILE_ITEM.style.height = `${ITEM.offsetHeight}px`;
    });
}

function createTileHeader(jsonNode){
    const HEADER = document.createElement('tileHeader');

    let html_output = '';

    if (jsonNode.allow_input){

        if (jsonNode.input_config.slots){
            let headerDisplay = jsonNode.label.match(/<([^>]*)>|([^<]+)/g).filter(Boolean);

            headerDisplay.forEach(el=>{
                switch(el){
                    case '<label>':
                        html_output += `<p>${jsonNode.label}</p>`;
                        break;
                    case '<input>':
                        html_output += '<tileInput droppable></tileInput>';
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

function createTileBody(jsonNode){
    const TILE_BODY = document.createElement('tileBody');
    TILE_BODY.setAttribute('droppable', '');
    return TILE_BODY;
}

function createToolTip(jsonNode){
    const DIV_TOOLTIP = document.createElement('tileTooltip');
    const TEXT_TOOLTIP = document.createElement('tooltipText');

    TEXT_TOOLTIP.innerText = jsonNode.tooltip;
    DIV_TOOLTIP.appendChild(TEXT_TOOLTIP);

    return DIV_TOOLTIP;
}

function createTile(jsonNode){
    const ITEM = document.createElement('tile');
    ITEM.id = jsonNode.name;
    ITEM.classList.add(jsonNode.tile_type);

    const HEADER = createTileHeader(jsonNode);
    const BODY = createTileBody(jsonNode);

    ITEM.appendChild(HEADER);

    if (jsonNode.has_scope){
        ITEM.appendChild(BODY)
    }

    // if (jsonNode.tooltip){
    //     ITEM.appendChild(createToolTip(jsonNode));
    // }

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
        displayList(TILES_JSON);
    }
}

main();

export {loadJSON};