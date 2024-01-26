import { loadJSON } from "../tiles/loadTiles.js";

const TILES_JSON = await loadJSON();

export class readTiles{
    async generateScript(event){
        const CODE_AREA = document.querySelectorAll('div#code_area>tile');

        let generated_code = '';

        CODE_AREA.forEach(tileElement=>{
            const MAIN_TILE = TILES_JSON.find(tileModel => tileModel.name == tileElement.id );
            const MAIN_HEADER = this.readHeaderCodeBlock(tileElement);
            const MAIN_BODY = this.readBodyCodeBlock(tileElement, 1);
            
            // console.log(MAIN_BODY)

            MAIN_BODY.forEach((line, index)=>{
                console.log(line);
            });
        });
    }

    readHeaderCodeBlock(tileElement){
        let inputList = [];

        // ENCONTRA OS SLOTS DISPONIVEIS PARA UM TILE
        let headerInputList = tileElement.querySelectorAll(':scope > tileHeader > tileInput');

        // SE NÃO POSSUI SLOT PARA INPUT
        if (headerInputList.length === 0){
            return this.writeElement(tileElement);
        }

        // PERCORRE OS INPUTS
        headerInputList.forEach((inputSlot, index)=>{
            
            // VERIFICA SE EXISTE UM TILE DENTRO
            const TILE_INSIDE = inputSlot.querySelector('tile');

            // PERCORRE ATÉ O TILE MAIS INTERNO
            if (TILE_INSIDE) inputList.push(this.readHeaderCodeBlock(TILE_INSIDE));
        });

        return this.writeElement(tileElement, inputList)
    }

    readBodyCodeBlock(tileElement, indentation){
        let lineList = [];

        // MAPEIA OS TILES DO BODY
        let bodyInputList = tileElement.querySelectorAll(':scope > tileBody > tile');

        bodyInputList.forEach((bodyTile, index)=>{
            // LE O HEADER DO TILE
            lineList.push(this.writeLine(this.readHeaderCodeBlock(bodyTile), indentation));

            // VERIFICA SE POSSUI ELEMENTOS MAIS INTERNOS
            let innerTiles = this.readBodyCodeBlock(bodyTile, indentation);
            
            // PRA CADA ELEMENTO INTERNO ADICIONA NA LISTA
            innerTiles.forEach(tile=>{
                lineList.push(this.writeLine(tile, indentation));
            });

        });

        return lineList
    }

    writeLine(line, indent){
        return ''.padStart(indent, '\t') + line;
    }
}