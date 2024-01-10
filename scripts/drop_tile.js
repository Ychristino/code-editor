import {set_topmost} from './drag_tile.js';

function drop_tile(position_x, position_y, tile){
    tile.style.pointerEvents = 'none';
    const ELEMENT_BELLOW = get_element_bellow(position_x, position_y, tile);
    const CODE_AREA = document.querySelector('div#code_area');
    tile.style.pointerEvents = 'auto';

    if (document.elementsFromPoint(position_x, position_y).includes(CODE_AREA.querySelector('span#remove_item')) ||
        document.elementsFromPoint(position_x, position_y).includes(document.querySelector('div#tiles_list'))){
        tile.remove();
        return false;
    }
    else if (ELEMENT_BELLOW){
        if(validate_drop(ELEMENT_BELLOW, tile)){
            switch (ELEMENT_BELLOW.tagName){
                case "TILEBODY":
                case "TILEPLACEHOLDER":
                    append_to_tile_body(ELEMENT_BELLOW, tile);
                    break;
                default:
                    append_to_code_area(position_x, position_y, tile, CODE_AREA);
                    break;
            }
        }
        else return false;
    }
}
function validate_drop(element_to_drop, tile){
    return true;
}

function get_drop_position(element_to_drop, tile){
    let children = Array.from(element_to_drop.children);
    let insertBeforeElement = null;

    for(let i = 0; i < children.length; i++) {
        if(children[i] === tile) continue; 

        let rect = children[i].getBoundingClientRect();
        if(tile.offsetTop < rect.top + rect.height / 2) {
            insertBeforeElement = children[i];
            break;
        }
    }
    return insertBeforeElement;
}

function append_to_tile_body(element_to_drop, tile){
    console.log(element_to_drop)
    if (element_to_drop.tagName === 'TILEPLACEHOLDER'){
        element_to_drop.replaceWith(tile);
        tile.style.position = 'relative';
        tile.style.top = null;
        tile.style.left = null;
    }
    else{

        const INSERT_BEFORE = get_drop_position(element_to_drop, tile);
        
        // Se não encontramos um elemento para inserir antes, insira no final
        if(INSERT_BEFORE === null) {
            element_to_drop.appendChild(tile);
        } else {
            element_to_drop.insertBefore(tile, INSERT_BEFORE);
        }
        
        tile.style.position = 'relative';
        tile.style.top = null;
        tile.style.left = null;
    }
}


function append_to_code_area(position_x, position_y, tile, code_area){
    if(!document.elementsFromPoint(position_x, position_y).includes(code_area)){
        tile.remove();
        return false;
    }
    else{
        code_area.appendChild(tile);
        tile.style.position = 'absolute';
        let rect = code_area.getBoundingClientRect();

        // Recalcula a posição do elemento em relação ao 'code_area'
        tile.style.left = `${position_x - rect.left - tile.offsetX}px`;
        tile.style.top = `${position_y - rect.top - tile.offsetY}px`;
        return true;
    }
}

function get_element_bellow(position_x, position_y, tile){

    tile.style.pointerEvents = 'none';
    const ELEMENT_BELLOW = document.elementFromPoint(position_x, position_y);
    tile.style.pointerEvents = 'auto';
    return ELEMENT_BELLOW;
}
export {get_element_bellow, drop_tile, get_drop_position}