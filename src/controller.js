export default class Controller{
    constructor(game,view){
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;
        this.name = '';

        document.addEventListener('keydown',this.handleKeyDown.bind(this));
        document.addEventListener('keyup',this.handleKeyUp.bind(this));

        this.view.renderCreateName()
        // this.view.renderStartScreen();

    }

    update(){
         this.game.movePieseDown();
        this.updateView();
    }

    play(){
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
    }

    pause(){
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
    }

    reset(){
        this.name= '';


        const currentURL = window.location.href;
        const updatedURL = currentURL.replace(/\?data=[^&]*&?/, ''); 
        window.location.href = updatedURL; 

        
        this.game.reset();
        this.play();
    }

    updateView(){
        const state = this.game.getState();
        console.log(state);
        if(this.name=''){
            this.view.renderCreateName();
        }
        else if(state.isGameOver){
            this.view.renderEndScreen(state);
        }else if(!this.isPlaying){
            this.view.renderPauseScreen();
        }else{
            this.view.renderMainScreen(state);
        }
    }

    startTimer(){
        const speed = 1000 - this.game.getState().level * 100;
            if(!this.intervalId){
               this.intervalId = setInterval(() => {
               this.update();
            },speed > 0 ? speed : 100); 
        }
    }

    stopTimer(){
        if(this.intervalId){
            clearInterval(this.intervalId); 
            this.intervalId = null;
        }
       
    }

    handleKeyDown(event){
        const state = this.game.getState();

        switch(event.keyCode){
            case 13: //enter
                if(state.isGameOver){
                    this.reset();
                }else if(this.isPlaying){
                    this.pause();
                }else{
                    this.play();
                }
                break;
            case 37: //left arrow
                this.game.movePieseLeft();
                this.updateView();
                break;
            case 38: //up arrow
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39: //right arrow
                this.game.movePieseRight();
                this.updateView();
                break;
            case 40: //down arrow
                this.stopTimer();
                this.game.movePieseDown();
                this.updateView();
                break;
        }
    }
    handleKeyUp(event){
        switch(event.keyCode){
            case 40: //down arrow
                this.startTimer();
                break;
        }
    }
}