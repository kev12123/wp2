//tiac-tac-toe board
var serve_grid = [ ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' ];

//limiting possible moves a cpu can make 
var posCpuPlay ={
    0 : [1,3,4],
    1 : [0,2,3,4,5],
    2 : [1,4,5],
    3 : [0,1,4,6,7],
    4 : [0,1,2,3,5,6,7,8],
    5 : [1,2,4,7,8],
    6 : [3,4,7],
    7 : [3,4,5,6,8],
    8 : [4,5,7]
};


function resetGame(){
    for(var i = 0 ; i < serve_grid.length ; i++){
        serve_grid[i] = ' ';
    }
}

function cpuMove(humanMove,p2){
      for(var i = 0 ; i < serve_grid.length ; i++){  
            if(serve_grid[i]===" " && i !=humanMove){
                serve_grid[i] = p2;
                break;
            }
      }

}
 
function checkWinner(player){

    if (serve_grid[0] === player && serve_grid[1] === player && serve_grid[2] === player ||
        serve_grid[3] === player && serve_grid[4] === player && serve_grid[5] === player ||
        serve_grid[6] === player && serve_grid[7] === player && serve_grid[8] === player ||
        serve_grid[0] === player && serve_grid[3] === player && serve_grid[6] === player ||
        serve_grid[1] === player && serve_grid[4] === player && serve_grid[7] === player ||
        serve_grid[2] === player && serve_grid[5] === player && serve_grid[8] === player ||
        serve_grid[0] === player && serve_grid[4] === player && serve_grid[8] === player ||
        serve_grid[6] === player && serve_grid[4] === player && serve_grid[2] === player){
         
        return true;
  }
  else{

        return false;
  }

}

function checkTie(p1,p2){
     tie = true;
    for(var i = 0 ; i < serve_grid.length; i++){
        if(serve_grid[i]===" "){
            return false;
        }
    }

    return true;
}


module.exports = {
    serve_grid,
    resetGame,
    cpuMove,
    checkWinner,
    checkTie
}