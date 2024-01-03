function makeElementDraggable(tile) {

     let code_area = document.querySelector('#code'),
         x = 0,
         y = 0,
         mousedown = false;

     // tile event mousedown
     tile.addEventListener('mousedown', function (e) {
         // set mouse state to true
         mousedown = true;
         set_topmost(tile, code_area);
         // subtract offset
         x = tile.offsetLeft - e.clientX;
         y = tile.offsetTop - e.clientY;
         e.preventDefault(); // prevent browser's default drag behavior
     }, true);

     // tile event mouseup
     document.addEventListener('mouseup', function (e) { // Notice the change here
         // set mouse state to false
         mousedown = false;
     }, true);

     // element mousemove to stop
     code_area.addEventListener('mousemove', function (e) {
         // Is mouse pressed?
         if (mousedown) {
            let new_x = e.clientX + x;
            let new_y = e.clientY + y;

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
    
    // let body = new_element.querySelector('tile_body');
    // body.addEventListener('drop', (event)=> {
    //     event.preventDefault()
    //     console.log('dropou')

    // })
    // body.addEventListener('dragover', (event)=> {
    //     event.preventDefault()
    //     console.log('over')
    // });
}

function set_topmost(element, area){
    area.childNodes.forEach(element => {
        element.style.zIndex = 0;
    });
    element.style.zIndex = 1;
}
export {makeELementUsable, makeElementDraggable};