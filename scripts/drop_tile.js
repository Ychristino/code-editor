import {set_topmost} from './drag_tile.js';

function add_item(e){

}

function check_element_below(x_position, y_position, clicked_element){

    document.elementsFromPoint(x_position, y_position).forEach(element=>{
        if (element !== clicked_element)
            element.style.zIndex = 2;
        else
            clicked_element.style.zIndex = 1;
    })

    return document.elementFromPoint(x_position,y_position);

}

export {add_item, check_element_below}