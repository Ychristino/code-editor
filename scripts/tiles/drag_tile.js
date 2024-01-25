import {dropTile, getElementBellow, getDropPosition, validateDrop} from './drop_tile.js';

function makeElementDraggable(tileElement) {

    const CODE_AREA = document.querySelector('#code_area');
    let x = 0;
    let y = 0;
    let mousedown = false;
    let focusedElement = null;

    // tile event mousedown
    tileElement.addEventListener('mousedown', function (e) {
        // SE ESTÁ SELECIONANDO UM CAMPO DE INPUT, NÃO EXECUTA O MOVE
        if(e.target.tagName.toLowerCase() === 'input') return ;

        mousedown = true;
        focusedElement = e.target.tagName !== 'TILE' ? e.target.closest('tile') : e.target
        x = tileElement.offsetLeft - e.clientX;
        y = tileElement.offsetTop - e.clientY;
        e.preventDefault(); // prevent browser's default drag behavior
        focusedElement.style.position = 'absolute';
    }, true);


    // tile event mouseup
    document.addEventListener('mouseup', function (e) { // Notice the change here
        if (focusedElement){

            tileElement.offsetX = e.clientX - focusedElement.getBoundingClientRect().left;
            tileElement.offsetY = e.clientY - focusedElement.getBoundingClientRect().top;

            dropTile(e.clientX, e.clientY, focusedElement)
            clearPlaceHolder();
            tileElement.classList.remove('moving');

            focusedElement = null;
            mousedown = false;

        }
    }, true);


    // element mousemove to stop
    document.addEventListener('mousemove', function (e) {
        if (mousedown) {
            let new_x = e.clientX + x;
            let new_y = e.clientY + y;

            const ELEMENT_BELLOW = getElementBellow(e.clientX, e.clientY, focusedElement);

            if (ELEMENT_BELLOW && ELEMENT_BELLOW.hasAttribute('droppable') &&
                !document.elementsFromPoint(e.clientX, e.clientY).includes(document.querySelector('div#tiles_list')) && // Previnir de setar placeholder na listagem
                validateDrop(ELEMENT_BELLOW, focusedElement))
            {
                setPlaceHolder(ELEMENT_BELLOW, focusedElement);
            }
            else if(!ELEMENT_BELLOW || (ELEMENT_BELLOW.hasAttribute('droppable') && ELEMENT_BELLOW.tagName !== 'TILEPLACEHOLDER')){
                clearPlaceHolder();
            }

            focusedElement.style.left = `${new_x}px`;
            focusedElement.style.top = `${new_y}px`;
        }
    }, true);
}

function clearPlaceHolder(){
    document.querySelectorAll('tilePlaceHolder').forEach(el=> el.remove());
}

function setPlaceHolder(elementBellow, draggedTile) {
    clearPlaceHolder();

    const DROP_POSITION = getDropPosition(elementBellow, draggedTile);

    const TILE_PLACE_HOLDER = document.createElement('tilePlaceHolder');
    TILE_PLACE_HOLDER.style.position = 'relative';
    TILE_PLACE_HOLDER.style.display = 'block';
    TILE_PLACE_HOLDER.style.height = `${draggedTile.offsetHeight}px`;
    TILE_PLACE_HOLDER.style.width = `${draggedTile.offsetWidth}px`;

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
        makeElementDraggable(CLONED_NODE);

        let mouseEvent = new MouseEvent('mousedown', {
            clientX: e.clientX,
            clientY: e.clientY
        });
        CLONED_NODE.dispatchEvent(mouseEvent);
    });
}

export {makeELementUsable, makeElementDraggable};