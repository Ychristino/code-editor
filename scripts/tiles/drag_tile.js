import {drop_tile,get_element_bellow,get_drop_position} from './drop_tile.js';

function makeElementDraggable(tile, isNew) {

    const CODE_AREA = document.querySelector('#code_area');
    let x = 0;
    let y = 0;
    let mousedown = false;
    let currentDroppable = null;
    let focused_element = null;
    // tile event mousedown
    tile.addEventListener('mousedown', function (e) {
        mousedown = true;
        focused_element = e.target.tagName !== 'TILE' ? e.target.closest('tile') : e.target
        x = tile.offsetLeft - e.clientX;
        y = tile.offsetTop - e.clientY;
        e.preventDefault(); // prevent browser's default drag behavior
        focused_element.style.position = 'absolute';
    }, true);


    // tile event mouseup
    document.addEventListener('mouseup', function (e) { // Notice the change here
        if (focused_element){

            tile.offsetX = e.clientX - focused_element.getBoundingClientRect().left;
            tile.offsetY = e.clientY - focused_element.getBoundingClientRect().top;

            drop_tile(e.clientX, e.clientY, focused_element)
            clear_place_holder();
            tile.classList.remove('moving');
           
            isNew = false;
            focused_element = null;
            mousedown = false;
        }
    }, true);


    // element mousemove to stop
    document.addEventListener('mousemove', function (e) {
        if (mousedown) {
            let new_x = e.clientX + x;
            let new_y = e.clientY + y;

            const ELEMENT_BELLOW = get_element_bellow(e.clientX, e.clientY, focused_element);

            if (ELEMENT_BELLOW && ELEMENT_BELLOW.tagName === 'TILEBODY' &&
                !document.elementsFromPoint(e.clientX, e.clientY).includes(document.querySelector('div#tiles_list'))) // Previnir de setar placeholder na listagem
            {
                set_place_holder(ELEMENT_BELLOW, focused_element);
            }
            else if(!ELEMENT_BELLOW || (ELEMENT_BELLOW.tagName !== 'TILEBODY' && ELEMENT_BELLOW.tagName !== 'TILEPLACEHOLDER')){
                clear_place_holder();
            }

            focused_element.style.left = `${new_x}px`;
            focused_element.style.top = `${new_y}px`;
        }
    }, true);
}

function clear_place_holder(){
    document.querySelectorAll('tilePlaceHolder').forEach(el=> el.remove());
}

function set_place_holder(elementBellow, draggedTile) {
    clear_place_holder();

    const DROP_POSITION = get_drop_position(elementBellow, draggedTile);
    
    const TILE_PLACE_HOLDER = document.createElement('tilePlaceHolder');
    TILE_PLACE_HOLDER.style.position = 'relative';
    TILE_PLACE_HOLDER.style.display = 'block';
    TILE_PLACE_HOLDER.style.height = `${draggedTile.offsetHeight}px`;

    if(DROP_POSITION === null) {
        elementBellow.appendChild(TILE_PLACE_HOLDER);
    } else {
        elementBellow.insertBefore(TILE_PLACE_HOLDER, DROP_POSITION);
    }

}

function makeELementUsable(tile) {

    if (tile.tagName !== 'TILE')
        return maketileUsable(tile.parentNode);

    tile.addEventListener('mousedown', (e)=> {
        let rect = tile.getBoundingClientRect();
        let topOriginal = rect.top + window.scrollY;
        let leftOriginal = rect.left + window.scrollX;

        const CLONED_NODE = tile.cloneNode(true);
        CLONED_NODE.style.top = `${topOriginal}px`;
        CLONED_NODE.style.left = `${leftOriginal}px`;
        CLONED_NODE.classList.add('moving');
        document.querySelector('main').appendChild(CLONED_NODE);

        makeElementDraggable(CLONED_NODE, true);

        let mouseEvent = new MouseEvent('mousedown', {
            clientX: e.clientX,
            clientY: e.clientY
        });
        CLONED_NODE.dispatchEvent(mouseEvent);
    });
}

function set_topmost(element, area){
    area.childNodes.forEach(element => {
        element.style.zIndex = 0;
    });
    element.style.zIndex = 1;
}

export {makeELementUsable, makeElementDraggable, set_topmost};