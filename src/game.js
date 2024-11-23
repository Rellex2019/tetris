const inputElement = document.getElementById("dataInput");
const queryString = window.location.search; 
const urlParams = new URLSearchParams(queryString); 
const currentValue = urlParams.get('data'); 

export default class Game{
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200,
    };
    
    constructor(){
        this.reset();
    }

    get level(){
        return Math.floor(this.lines * 0.1);
    }

    getState(){
        const playfied = this.createPlayField();
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y < this.playfied.length; y++) {
            playfied[y] = [];
            for (let x = 0; x < this.playfied[y].length; x++) {
                playfied[y][x] = this.playfied[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if(blocks[y][x]){
                    playfied[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }

        return{
            score: this.score,
            level: this.level,
            lines: this.lines,
            name: currentValue,
            nextPiece: this.nextPiece,
            playfied,
            isGameOver: this.topOut
        };
    }

    reset(){
    this.score = 0;
    this.lines = 0;
    this.name = '';
    this.topOut = false;
    this.playfied = this.createPlayField();  
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
    }

    createPlayField(){
        const playfied = [];

        for (let y = 0; y < 20; y++) {
            playfied[y] = [];
            for (let x = 0; x < 10; x++) {
                playfied[y][x] = 0;
            }
        }
        return playfied;
    }

    createPiece(){
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const piece = {};

        switch(type){
            case 'I':
                piece.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
                break;
            case 'J':
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]
                ]
                break;
            case 'L':
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ]
                break;
            case 'O':
                piece.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ]
                break;
            case 'S':
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ]
                break;
            case 'T':
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ]
                break;
            case 'Z':
                piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ]
                break;
            default:
                throw new Error('Неизвестный тип фигур');

        }
        piece.x = Math.floor((10 - piece.blocks[0].length)/2);
        piece.y = -1;

        return piece;
    }

    movePieseLeft(){
       this.activePiece.x -= 1;
       if (this.hasCollision()){
        this.activePiece.x +=1;
       }
    }
    movePieseRight(){
        this.activePiece.x += 1;
        if (this.hasCollision()){
            this.activePiece.x -=1;
            
           }
     }
    movePieseDown(){
        if(this.topOut) return;

        this.activePiece.y += 1;
        if (this.hasCollision()){
        this.activePiece.y -=1;
        this.lockPiese();
        const clearedLines = this.clearLines();
        this.updateScore(clearedLines);
        this.updatePieces();
       }
       if(this.hasCollision()){
        this.topOut = true;
       }
    }
    
    rotatePiece(){
        const blocks = this.activePiece.blocks;
        const length = blocks.length;
        const temp = [];
        for (let i = 0; i < length; i++) {
            temp[i]=new Array(length).fill(0);
        }
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < length; x++) {
               temp[x][y]= blocks[length - 1 - y][x];
                
            }
        }
        this.activePiece.blocks = temp;

        if(this.hasCollision()){
            this.activePiece.blocks = blocks;
        }
    }

    hasCollision(){
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y<blocks.length; y++){
            for (let x = 0; x < blocks[y].length; x++) {
                if(
                    blocks[y][x] &&
                     ((this.playfied[pieceY + y] === undefined || this.playfied[pieceY + y][pieceX + x] === undefined) ||
                    this.playfied[pieceY +y][pieceX +x])
                    ){
                    return true;
                }
            }
        }
        return false;
    }

    lockPiese(){
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y<this.activePiece.blocks.length; y++){
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfied[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    clearLines(){
        const rows = 20;
        const columns = 10;
        let lines = [];
        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if(this.playfied[y][x]){
                    numberOfBlocks +=1;
                }
            }
            if(numberOfBlocks === 0){
                break;
            }else if (numberOfBlocks < columns){
                continue;
            } else if (numberOfBlocks === columns){
                lines.unshift(y);
            }
        }
        for(let index of lines){
            this.playfied.splice(index,1);
            this.playfied.unshift(new Array(columns).fill(0));
        }
        return lines.length;
    }

    updateScore(clearedLines){
        if(clearedLines>0){
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
            console.log(this.score,this.lines,this.level);
        }
    }

    updatePieces(){
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}