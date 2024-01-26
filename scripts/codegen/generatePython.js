import { loadJSON } from "../tiles/loadTiles.js";
import { readTiles } from "./readTiles.js";

const BUTTON = document.querySelector('#generate_python');
BUTTON.addEventListener('click', ()=>{
    const NEW_SCRIPT = new pythonCode()
    NEW_SCRIPT.generateScript()
});
const TILES_JSON = await loadJSON();


class pythonCode extends readTiles{
    writeline(tileElement){
        let code_line = '';
        let textInputCount = 0;
        let tileInputCount = 0;
        let currTileJSON = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );
        let code = currTileJSON.format.match(/<([^>]*)>|([^<]+)/g);

        code.forEach(el=>{
            switch(el){
                case '<label>':
                    code_line += `${currTileJSON.python_code}`;
                    break;
                case '<inputTile>':
                    code_line += '{tileInput}';
                    break;
                case '<inputText>':
                    let inputSlot = tileElement.querySelectorAll('input[type=text]')[textInputCount];
                    if (!inputSlot.value) code_line = '{textValue}'
                    else code_line += `${inputSlot.value}`;
                    textInputCount++;
                    break;
                default:
                    code_line += el;
                }
        });

        code_line += currTileJSON.has_scope ? ':' : '';
        return code_line;
    }
}