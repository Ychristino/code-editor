import {drop_tile,get_element_bellow} from './drop_tile.js';
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
        x = tile.offsetLeft - e.clientX;
        y = tile.offsetTop - e.clientY;
        e.preventDefault(); // prevent browser's default drag behavior
        focused_element = e.target.tagName !== 'TILE' ? e.target.closest('tile') : e.target
    }, true);


    // tile event mouseup
    document.addEventListener('mouseup', function (e) { // Notice the change here
        if (focused_element){
            tile.offsetX = e.clientX - focused_element.getBoundingClientRect().left;
            tile.offsetY = e.clientY - focused_element.getBoundingClientRect().top;

            drop_tile(e.clientX, e.clientY, focused_element, isNew)
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

            const ELEMENT_BELLOW = get_element_bellow(new_x, new_y, focused_element);

            if (!isNew){
                // Não precisa verificar RANGE do code_area, uma vez que ele faz o scroll
                // if (new_x >= 0 && new_x <= (CODE_AREA.offsetWidth - focused_element.offsetWidth))
                focused_element.style.left = `${new_x}px`;
                // if (new_y >= 0 && new_y <= (CODE_AREA.offsetHeight - focused_element.offsetHeight))
                focused_element.style.top = `${new_y}px`;
            }
            else{
                focused_element.style.left = `${new_x}px`;
                focused_element.style.top = `${new_y}px`;
            }
            

         }
     }, true);
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