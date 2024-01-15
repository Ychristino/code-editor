function dropTile(position_x, position_y, tileElement){
    tileElement.style.pointerEvents = 'none';
    const ELEMENT_BELLOW = getElementBellow(position_x, position_y, tileElement);
    const CODE_AREA = document.querySelector('div#code_area');
    tileElement.style.pointerEvents = 'auto';

    if (document.elementsFromPoint(position_x, position_y).includes(CODE_AREA.querySelector('span#remove_item')) ||
        document.elementsFromPoint(position_x, position_y).includes(document.querySelector('div#tiles_list'))){
        tileElement.remove();
        return false;
    }
    else if (ELEMENT_BELLOW){
        if(validateDrop(ELEMENT_BELLOW, tileElement)){
            switch (ELEMENT_BELLOW.tagName){
                case "TILEBODY":
                case "TILEPLACEHOLDER":
                    appendToTileBody(ELEMENT_BELLOW, tileElement);
                    break;
                default:
                    appendToCodeArea(position_x, position_y, tileElement, CODE_AREA);
                    break;
            }
        }
        else return false;
    }
}
function validateDrop(elementToDrop, tileElement){
    if (elementToDrop.tagName === "TILEPLACEHOLDER")
        return validateDrop(elementToDrop.parentNode, tileElement);

    switch (elementToDrop.tagName){
        case "TILEBODY":
            break;
        default:
            break;
    }
    
    return true;
}

function getDropPosition(elementToDrop, tileElement){
    let children = Array.from(elementToDrop.children);
    let insertBeforeElement = null;

    for(let i = 0; i < children.length; i++) {
        if(children[i] === tileElement) continue; 

        let rect = children[i].getBoundingClientRect();
        if(tileElement.offsetTop < rect.top + rect.height / 2) {
            insertBeforeElement = children[i];
            break;
        }
    }
    return insertBeforeElement;
}

function appendToTileBody(elementToDrop, tileElement){

    if (elementToDrop.tagName === 'TILEPLACEHOLDER'){
        elementToDrop.replaceWith(tileElement);
        tileElement.style.position = 'relative';
        tileElement.style.top = null;
        tileElement.style.left = null;
    }
    else{

        const INSERT_BEFORE = getDropPosition(elementToDrop, tileElement);
        
        // Se não encontramos um elemento para inserir antes, insira no final
        if(INSERT_BEFORE === null) {
            elementToDrop.appendChild(tileElement);
        } else {
            elementToDrop.insertBefore(tileElement, INSERT_BEFORE);
        }
        
        tileElement.style.position = 'relative';
        tileElement.style.top = null;
        tileElement.style.left = null;
    }
}


function appendToCodeArea(position_x, position_y, tileElement, codeArea){
    if(!document.elementsFromPoint(position_x, position_y).includes(codeArea)){
        tileElement.remove();
        return false;
    }
    else{
        codeArea.appendChild(tileElement);
        tileElement.style.position = 'absolute';
        let rect = codeArea.getBoundingClientRect();

        // Recalcula a posição do elemento em relação ao 'code_area'
        tileElement.style.left = `${position_x - rect.left - tileElement.offsetX}px`;
        tileElement.style.top = `${position_y - rect.top - tileElement.offsetY}px`;
        return true;
    }
}

function getElementBellow(position_x, position_y, tileElement){

    tileElement.style.pointerEvents = 'none';
    const ELEMENT_BELLOW = document.elementFromPoint(position_x, position_y);
    tileElement.style.pointerEvents = 'auto';
    return ELEMENT_BELLOW;
}
export {getElementBellow, dropTile, getDropPosition}