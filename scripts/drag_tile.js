import {check_element_below} from './drop_tile.js';

function makeElementDraggable(tile) {

    let code_area = document.querySelector('#code'),
        x = 0,
        y = 0,
        mousedown = false;

    let currentDroppable = null;


     // tile event mousedown
     tile.addEventListener('mousedown', function (e) {
         // set mouse state to true
         mousedown = true;
         // set_topmost(tile, code_area);
         // subtract offset
         x = tile.offsetLeft - e.clientX;
         y = tile.offsetTop - e.clientY;
         e.preventDefault(); // prevent browser's default drag behavior
     }, true);


     // tile event mouseup
     document.addEventListener('mouseup', function (e) { // Notice the change here
         // set mouse state to false
         mousedown = false;

        let elemBelow = check_element_below(e.clientX, e.clientY, tile);
        if (elemBelow){
            let droppableBelow = elemBelow.closest('tile_body');
            if (droppableBelow && droppableBelow !== tile.querySelector('tile_body')) {
                let new_element = tile.cloneNode(true);
                new_element.style = '';

                droppableBelow.appendChild(new_element);
                droppableBelow.style.border = 'none';
                tile.remove();

            }
        }
     }, true);


    // element mousemove to stop
    code_area.addEventListener('mousemove', function (e) {
        // Is mouse pressed?
        if (mousedown) {
            let new_x = e.clientX + x;
            let new_y = e.clientY + y;

            let elemBelow = check_element_below(e.clientX, e.clientY, tile);
            // document.elementsFromPoint(e.clientX, e.clientY).forEach(element=>{
            //     if (element !== tile)
            //         element.style.zIndex = 2;
            //     else
            //         tile.style.zIndex = 1;
            // })

            // let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

            set_topmost(tile, code_area);

            if (elemBelow){
                let droppableBelow = elemBelow.closest('tile_body');
                if (currentDroppable != droppableBelow) {
                    if (currentDroppable) {
                        // the logic to process "flying out" of the droppable (remove highlight)
                        currentDroppable.style.border = 'none';
                    }
                    currentDroppable = droppableBelow;
                    if (currentDroppable && currentDroppable !== tile.querySelector('tile_body')) {
                        // the logic to process "flying in" of the droppable
                        currentDroppable.style.border = 'solid 3px red';
                    }
                }
            }

            if (new_x >= 0 && new_x <= (code_area.offsetWidth - tile.offsetWidth))
                tile.style.left = e.clientX + x + 'px';

            if (new_y >= 0 && new_y <= (code_area.offsetHeight - tile.offsetHeight))
                tile.style.top = e.clientY + y + 'px';
         }
     }, true);
}

function makeELementUsable(element) {

    if (element.tagName !== 'TILE')
        return makeELementUsable(element.parentNode);

    let new_element = element.cloneNode(true);
    new_element.style.position = 'absolute';
    new_element.classList.add('draggable');
    new_element.classList.add('iteractive');
    new_element.draggable = true;

    makeElementDraggable(new_element)
    document.querySelector("#code").appendChild(new_element);
}

function set_topmost(element, area){
    area.childNodes.forEach(element => {
        element.style.zIndex = 0;
    });
    element.style.zIndex = 1;
}
export {makeELementUsable, makeElementDraggable, set_topmost};