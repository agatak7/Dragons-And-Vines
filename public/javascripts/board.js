function gameBoard(posA, posB){
    const board = [];
    const width = 10;
    const height = 10;
    this.player = null;
    
    var players = [{
        name: "Knight A",
        id: "A",
        position: posA, 
        color: "blue", 
        image: '<img src="../images/playera.png" width=80 height=75></img>',
        num_rolls:0
    },{
        name: "Knight B",
        id: "B",
        position: posB, 
        color: "red",
        image:'<img src="../images/playerb.png" width=80 height=75></img>',
        num_rolls:0
    }];
    const vines = [{
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
    const dragons = [{
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
    let position = 0;
    const boardSize = 60; 

    for(var y = height; y > 0; y--){
        let row =[];
        
        board.push(row);
        for(var x =0; x< width; x++){
            row.push({y, x, occupied:null, position});
            position++;

        }
    }

    function renderBRD(){
        let brdHTML = ``;
        let i=0;
        let j=0;
        board.forEach(row=>{
            row.forEach(square=>{
                if(square.position!=99){
                for(var i=0; i<vines.length;i++){
                    if(vines[i].start===square.position || vines[i].end=== square.position){
                        brdHTML +=  `<div class=square style="top:${square.y * boardSize}px; left:${square.x * boardSize}px; background-color:paleturquoise"><small> ${square.position +1}</small></div>`
                        break;
                    }
                    else if(dragons[i].start===square.position || dragons[i].end=== square.position){
                        brdHTML +=  `<div class=square style="top:${square.y * boardSize}px; left:${square.x * boardSize}px; background-color:orangered"><small> ${square.position +1}</small></div>`
                        break;
                    }else{
                        brdHTML +=  `<div class=square style="top:${square.y * boardSize}px; left:${square.x * boardSize}px"><small> ${square.position +1}</small></div>`
                    }
                }}else{
                    brdHTML +=  `<div class=square style="top:${square.y * boardSize}px; left:${square.x * boardSize}px"><small> ${square.position +1}</small><img id=castle src="images/castle.png" width=50 height=40></img></div>`
                }
                
            });
        });

        players.forEach(player=>{
            let square = null;
            board.forEach(row=>{
                row.forEach(square=>{
                    if(player.position===square.position){
                        console.log("player "+player.name+ "/ "+player.position+" is on this square "+ square.position);
                        brdHTML +=`<div class=square-p style="top:${square.y * boardSize}px; left:${square.x * boardSize}px"><small> ${square.position +1}</small></div>`+`<div class=player style="top:${square.y * boardSize-5}px; left:${square.x * boardSize-5}px"><center>${player.image}</center></div>`
                        
                    }
                });
            });
        })
        document.getElementById("board").innerHTML = brdHTML;
    }
    renderBRD();
    

}