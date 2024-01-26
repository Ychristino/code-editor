import { loadJSON } from "../tiles/loadTiles.js";
import { readTiles } from "./readTiles.js";

const BUTTON = document.querySelector('#generate_python');
BUTTON.addEventListener('click', ()=>{
    const NEW_SCRIPT = new pythonCode()
    NEW_SCRIPT.generateScript()
});
const TILES_JSON = await loadJSON();

class pythonCode extends readTiles{

    writeElement(tileElement, inputList){
        let codeLine = '';
        let inputCount = 0;

        let currTileJSON = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );

        // PROCURA O FORMATO DO CODIGO
        let code = currTileJSON.pythonFormat.match(/<([^>]*)>|([^<]+)/g);

        code.forEach((el, index)=>{
            if (index > 0) codeLine += ' ';

            switch(el){
                case '<label>':
                    codeLine += currTileJSON.python_code
                    break;
                case '<inputTile>':
                    // SE POSSUI ESSE INPUT NA POSICAO
                    if (inputList && inputList.length > inputCount){
                        codeLine += inputList[inputCount];
                    }
                    else{
                        codeLine += '{INPUT_SOMETHING}'; 
                    }

                    inputCount++;
                    break;

                case '<inputText>':
                    let fieldValue = tileElement.querySelector('input[type=text]').value;
                    if (!fieldValue) codeLine += '{EMPTY_TEXT}';
                    else codeLine += fieldValue; 
                    break;
                default:
                    codeLine += el;
                }
        });

        codeLine += currTileJSON.has_scope ? ':' : '';
        return codeLine;
    }
}