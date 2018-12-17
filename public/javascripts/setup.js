function StatusBar(){
    this.setStatus = function(status){
        document.getElementById("statusbar").innerHTML = status;
    };
}
function GameState(sb, socket){
    this.playerType = null;
    this.sb = sb;
    this.position = 0;
    this.winner = false;
    this.setPlayerType = function(p){
        this.playerType = p;
    }
    this.vines = [{
        start: 2, 
        end: 50
    },{
        start: 5,
        end: 26
    },{
        start: 19,
        end: 69
    },{
        start: 35,
        end: 54
    },{
        start: 62,
        end: 94
    },{
        start: 67,
        end: 97
    }];
    this.dragons = [{
        start: 33, 
        end: 0
    },{
        start: 24,
        end: 4
    },{
        start: 46,
        end: 18
    },{
        start: 86,
        end: 56
    },{
        start: 90,
        end: 60
    },{
        start: 98,
        end: 78
    }
    ]
    var dice_sound = new Audio("images/dice.wav" );
    var step_sound = new Audio("images/step.wav");
    var win_sound = new Audio("images/trumpet.wav");
    var monster = new Audio("images/monster.wav");
    var yay = new Audio("images/yay.ogg");
    this.makeMove = function(){
            var roll = Math.ceil(Math.random()* 6);
            console.log("You rolled: ", roll);
            dice_sound.playbackRate= 2;
            dice_sound.play();
            document.getElementById("result").innerHTML ='<div>You Rolled: '+ roll+'</div>';
            for(var i =0; i<=this.vines.length;i++){
                if(i===this.vines.length){
                    this.position += roll;
                    break;
                }
                if(this.position + roll=== this.vines[i].start){

                    this.sb.setStatus(Status["promptVine"]);
                    yay.play();
                    this.position=this.vines[i].end;
                    break;
                }if(this.position + roll=== this.dragons[i].start){
                    this.sb.setStatus(Status["promptDragon"]);
                    monster.play();
                    this.position=this.dragons[i].end;
                    break;
                }
            }
            
        this.move = true;
    }
}


(function setup(){
    var win_sound = new Audio("images/trumpet.wav");
    var lose_sound = new Audio("images/lose_sound.wav");
    var waiting = new Audio("images/waiting.wav");
    waiting.volume = 0.10;
    waiting.loop = true;
    var socket = new WebSocket("ws://localhost:3000");
    var players = {};
    var whoWon = null;
    players["A"] = 0;
    players["B"] = 0;
    gameBoard(players["A"],players["B"]);
   
    var sb = new StatusBar();
    var gs = new GameState(sb, socket);

    socket.onmessage = function (event) {
        let outgoingMsg = null;
        let incomingMsg = JSON.parse(event.data);
 
        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            console.log(screen.width +" "+ window.fullScreen);
            if(screen.width<1366 || screen.height<768){
                alert("Your Screen size may be too small!");
            }else if(window.fullScreen==false){
                alert("Please go to fullscreen mode for the optimal gameplay!");
            }
            waiting.play();
            gs.setPlayerType(incomingMsg.data);
        
            if (gs.playerType == "B") {
                document.getElementById("player").innerHTML = '<img src="../images/playerb.png" id="playerType"><div id=type>Knight B</div>'
                sb.setStatus(Status["prompt"]);
                console.log(gs.playerType);
                outgoingMsg = Messages.O_MAKE_A_MOVE;
                socket.send(JSON.stringify(outgoingMsg));
            }
            else {
                document.getElementById("player").innerHTML = '<img src="../images/playera.png" id="playerType"><div id=type>Knight A</div>'
                sb.setStatus(Status["waiting"]); 
                console.log("waiting..");
                
                 
            }
        }

        if(incomingMsg.type == Messages.T_MAKE_A_MOVE){
            console.log("Message comes!");
            sb.setStatus(Status["makeMove"])
            document.getElementById("playerType").innerHTML= '<style>#playerType{border-radius:50%; border:yellow solid;}</style>'
            if(gs.playerType=="A"){
                players["B"]= incomingMsg.data;
            }else{
                players["A"] = incomingMsg.data;
            }
            gameBoard(players["A"],players["B"]); //rendering #1
            console.log(gs.playerType); 
            var dice = document.getElementById("die");
            
            dice.addEventListener("click", function singleClick(){
                    gs.makeMove();
                    dice.removeEventListener("click", singleClick, false);
                    players[gs.playerType] = gs.position;
                    console.log(players["A"] + " " + players["B"]);
                    gameBoard(players["A"],players["B"]); //rendering #2
                    document.getElementById("playerType").innerHTML= '<style>#playerType{border-radius:50%; border:darkblue solid;}</style>'
                    if(gs.position>=99){
                        whoWon = gs.playerType;
                    }
                    if(whoWon==null){
                        outgoingMsg = Messages.O_MAKE_A_MOVE;
                        outgoingMsg.data = gs.position;
                        socket.send(JSON.stringify(outgoingMsg));
                    }else{
                        let finalMsg = Messages.O_GAME_WON_BY;
                        finalMsg.data = whoWon;
                        socket.send(JSON.stringify(finalMsg));
                        
                    }
            });

            
            
        }
        if(incomingMsg.type == Messages.T_GAME_OVER){
            let alertString;
            whoWon = incomingMsg.data;
            if(incomingMsg.data === "A"){
                players["A"] = 99;
            }else{
                players["B"] = 99;
            }
            gameBoard(players["A"],players["B"]); 
            console.log("Game won by: "+incomingMsg.data)
            if( incomingMsg.data == gs.playerType){
                win_sound.play();
                alertString = Status["gameWon"];
            }
            else {
                lose_sound.play();
                alertString = Status["gameLost"];
            }
            alertString += Status["playAgain"];
            sb.setStatus(alertString);
        }

    };

    socket.onopen = function(){
        socket.send("{}");
    };
    
    //server sends a close event only if the game was aborted from some side
    socket.onclose = function(){
        "close!"
        if(whoWon==null){
            sb.setStatus(Status["aborted"]);
        }
    };

    socket.onerror = function(){  
    };
})(); //execute immediately