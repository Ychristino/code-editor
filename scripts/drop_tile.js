import {set_topmost} from './drag_tile.js';

function drop_tile(position_x, position_y, tile, isNew){
    tile.style.pointerEvents = 'none';
    const ELEMENT_BELLOW = get_element_bellow(position_x, position_y, tile);
    const CODE_AREA = document.querySelector('div#code_area');
    tile.style.pointerEvents = 'auto';

    if (ELEMENT_BELLOW){
        if (document.elementsFromPoint(position_x, position_y).includes(CODE_AREA.querySelector('span#remove_item'))){
            tile.remove();
            return false;
        }

        if (isNew){ 
            append_to_code_area(position_x, position_y, tile, CODE_AREA);
        }
        else{
            if(validate_drop(ELEMENT_BELLOW, tile)){
                switch (ELEMENT_BELLOW.tagName){
                    case "TILEBODY":
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
}
function validate_drop(element_to_drop, tile){
    return true;
}

function append_to_tile_body(element_to_drop, tile){
    element_to_drop.appendChild(tile)
    tile.style.top = 0;
    tile.style.left = 0;

    // Recalcula tamanho do tilebody
    element_to_drop.style.height = `${tile.offsetHeight}px`;

    if (tile.offsetWidth > element_to_drop.offsetWidth)
        element_to_drop.style.width = `${tile.offsetWidth }px`;
}

function append_to_code_area(position_x, position_y, tile, code_area){
    if(!document.elementsFromPoint(position_x, position_y).includes(code_area)){
        tile.remove();
        return false;
    }
    else{
        code_area.appendChild(tile);
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
export {get_element_bellow, drop_tile}