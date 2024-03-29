import {makeELementUsable} from './dragTile.js';

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
        let headerDisplay = jsonNode.label.match(/<([^>]*)>|([^<]+)/g).filter(Boolean);
        headerDisplay.forEach(el=>{
            let created_element;

            switch(el){
                case '<label>':
                    created_element = document.createElement('p');
                    created_element.innerText = jsonNode.label
                    break;
                case '<inputTile>':
                    created_element = document.createElement('tileInput');
                    created_element.setAttribute('droppable', '');
                    break;
                case '<inputText>':
                    created_element = document.createElement('input');
                    created_element.setAttribute('type', 'text');
                    break;
                default:
                    created_element = document.createElement('span');
                    created_element.innerHTML = el;
            }
            HEADER.appendChild(created_element);
        })
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