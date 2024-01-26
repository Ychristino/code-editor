import { loadJSON } from "../tiles/loadTiles.js";

const TILES_JSON = await loadJSON();

export class readTiles{
    async generateScript(event){
        const CODE_AREA = document.querySelectorAll('div#code_area>tile');

        let generated_code = '';

        CODE_AREA.forEach(tileElement=>{
            const MAIN_TILE = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );
            const MAIN_HEADER = this.readHeaderCodeBlock(tileElement);
            console.log(MAIN_HEADER);
            const MAIN_BODY = this.readBodyCodeBlock(tileElement);
        });
    }

    readHeaderCodeBlock(tileElement){
        let headerInputList = tileElement.querySelectorAll(':scope > tileHeader > tileInput > tile');

        if (headerInputList.length === 0) return this.writeline(tileElement);
        let inputData = [];

        headerInputList.forEach((inputField, index)=>{
            inputData.push(this.readHeaderCodeBlock(inputField));
        });

        let formattedData = this.formatInput(this.writeline(tileElement), inputData).trim();
        return formattedData
    }

    formatInput(string, inputTiles){
        // let splittedString = string.split(/{.*?}/g);
        var i = 0;
        return string.replace(/{.*?}/g, () => {
            return ' ' + inputTiles[i++] + ' ';
        });
    }

    readBodyCodeBlock(tileElement){
        let bodyInputList = tileElement.querySelectorAll(':scope > tileBody > tile');
        
        if (bodyInputList.length === 0) return ''.padStart(this.countIndent(tileElement), '\t') + this.writeline(tileElement);

        bodyInputList.forEach((bodyTile, index)=>{
            console.log(''.padStart(this.countIndent(tileElement), '\t'), this.readHeaderCodeBlock(bodyTile));
            this.readBodyCodeBlock(bodyTile);
        });
    }

    countIndent(element){
        let count = 0;

        while (element) {
            if (element.tagName === "TILEBODY") {
                count++;
            }
            element = element.parentElement;
        }
        return count;
    }
}