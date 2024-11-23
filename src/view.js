const inputElement = document.getElementById("dataInput");
export default class View{
    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red',

    };
    constructor(element, width, height, rows, columns){
         this.element = element;
         this.width = width;
         this.height = height;

         this.canvas = document.createElement('canvas');
         this.canvas.width = this.width;
         this.canvas.height = this.height;
         this.context = this.canvas.getContext('2d');

         this.playfiedBorderWidth = 4;
         this.playfiedX = this.playfiedBorderWidth;
         this.playfiedY = this.playfiedBorderWidth;
         this.playfiedWidth = this.width * 2 / 3;
         this.playfiedHeight = this.height;
         this.playfiedInnerWidth = this.playfiedWidth - this.playfiedBorderWidth * 2;
         this.playfiedInnerHeight = this.playfiedHeight - this.playfiedBorderWidth * 2;
         

         this.blockWidth = this.playfiedInnerWidth/columns;
         this.blockHeight = this.playfiedInnerHeight/rows;

         this.panelX = this.playfiedWidth + 10;
         this.panelY = 0;
         this.panelWidth = this.width/3;
         this.panelHeight = this.height; 

         this.element.appendChild(this.canvas);
    }

    renderMainScreen(state){
        this.clearScreen();
        this.renderPlayfied(state);
        this.renderPanel(state);

        inputElement.style.display = "none";
    }

    renderCreateName()
    {

        const currentValue = inputElement.value; 

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to acces name', this.width/2,this.height/2);

        inputElement.style.display = "block";
        const queryString = window.location.search; 
        const urlParams = new URLSearchParams(queryString); 
        const dataValue = urlParams.get('data'); 
        inputElement.value = dataValue;
    }

    renderStartScreen(){
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width/2,this.height/2);

    }
    renderPauseScreen(){
        this.context.fillStyle = 'rgba(0,0,0,0.75)';
        this.context.fillRect(0,0,this.width,this.height);

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width/2,this.height/2);

        inputElement.style.display = "none";
    }
    renderEndScreen({ score, name }){
        this.clearScreen();

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width/2,this.height/2 - 96);
        this.context.fillText(`Name: ${name}`, this.width/2,this.height/2 - 48);
        this.context.fillText(`Score: ${score}`, this.width/2,this.height/2);
        this.context.fillText('Press ENTER to Restart', this.width/2,this.height/2 + 48);

        inputElement.style.display = "none";
    }

    clearScreen(){
        this.context.clearRect(0,0, this.width,this.height);
    }

    renderPlayfied({ playfied }){
        for (let y = 0; y < playfied.length; y++) {
            const line = playfied[y];
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                if (block) {
                    this.renderBlock
                    (this.playfiedX + (x * this.blockWidth),
                    this.playfiedY + (y * this.blockHeight),
                    this.blockWidth,    
                    this.blockHeight,
                    View.colors[block]
                );
                }
            }
        }
        this.context.strokeStyle = 'white';
        this.context.lineWidth = this.playfiedBorderWidth;
        this.context.strokeRect(0,0,this.playfiedWidth,this.playfiedHeight)
    }

    renderPanel({level,score,lines,name,nextPiece }){
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';

        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 48);
        this.context.fillText(`Name: `, this.panelX, this.panelY + 72);
        this.context.fillText(`${name}`, this.panelX, this.panelY + 92);
        
        this.context.fillText('Next:', this.panelX, this.panelY + 140);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
           for (let x = 0; x < nextPiece.blocks[y].length; x++) {
            const block = nextPiece.blocks[y][x];

            if (block){
                this.renderBlock(
                    this.panelX + (x*this.blockWidth * 0.5),
                    this.panelY + 144 + (y*this.blockHeight * 0.5),
                    this.blockWidth * 0.5,
                    this.blockHeight * 0.5,
                    View.colors[block]
                );
            }
           }
        }
      
    }

    renderBlock(x,y,width,height,color){
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;

        this.context.fillRect(x , y , width, height);
        this.context.strokeRect(x , y , width, height);
    }

}