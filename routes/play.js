var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({ extended: false});
var router = express.Router();


function resetGame(grid){
        
        grid.forEach(element => {
                element = ' ';
        });
}

router.get("/ttt",function(req,res){
        res.render("index");
});

router.post("/ttt",urlEncodedParser,function(req,res){

        var date = new Date();
	var curr_date = date.getFullYear() +"-0"+ (date.getMonth() +1) + "-" + date.getDate();
	var name = req.body.name;
        res.render("ttt",{
	
		name: name,
		date: curr_date
	
	});
});

router.post("/ttt/play/",jsonParser, function(req,res){
        
        var move = req.body.move;
        var ttt_grid =[' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' '];
        console.log("move made by human : " +  move);
        if(typeof move !== 'undefined'){
 
        // var grid = req.body.grid;
        // console.log(grid[0]);
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
        // grid.forEach(function(elem){
        //         ttt_grid.push(elem);
        // });
        //add human move position
     
        var p1 = 'x';
        ttt_grid[move] = p1;
        var p2 = 'o';

	console.log(ttt_grid);

	   for(var i = 0; i < 9 ; i++){
                         if (ttt_grid[i]===p1){
				 console.log("P1 found at" + i);
                            for(var j = 0 ; j < posCpuPlay[i].length;j++){
                                    if(ttt_grid[posCpuPlay[i][j]]===' '){
                                          console.log("P2 will place O at " + posCpuPlay[i][j]);
                                         ttt_grid[posCpuPlay[i][j]] = p2;
					 break;
                                    }
                         }
			 }
	   }

	console.log(ttt_grid);

        //tic tac toe logic
           if(ttt_grid[0]=== p1 && ttt_grid[1]===p1 && ttt_grid[2]===p1 ||
                ttt_grid[3]=== p1 && ttt_grid[4]===p1 && ttt_grid[5]===p1 ||
                ttt_grid[6]=== p1 && ttt_grid[7]===p1 && ttt_grid[8]===p1 ||
                ttt_grid[0]=== p1 && ttt_grid[3]===p1 && ttt_grid[6]===p1 ||
                ttt_grid[1]=== p1 && ttt_grid[4]===p1 && ttt_grid[7]===p1 ||
                ttt_grid[2]=== p1 && ttt_grid[5]===p1 && ttt_grid[8]===p1 ||
                ttt_grid[0]=== p1 && ttt_grid[4]===p1 && ttt_grid[8]===p1 ||
                ttt_grid[6]=== p1 && ttt_grid[4]===p1 && ttt_grid[2]===p1){
                    resetGame(ttt_grid);
                    res.send({grid: ttt_grid, winner:p1});

         }
         else if(ttt_grid[0]=== p2 && ttt_grid[1]===p2 && ttt_grid[2]===p2 ||
                ttt_grid[3]=== p2 && ttt_grid[4]===p2 && ttt_grid[5]===p2 ||
                ttt_grid[6]=== p2 && ttt_grid[7]===p2 && ttt_grid[8]===p2 ||
                ttt_grid[0]=== p2 && ttt_grid[3]===p2 && ttt_grid[6]===p2 ||
                ttt_grid[1]=== p2 && ttt_grid[4]===p2 && ttt_grid[7]===p2 ||
                ttt_grid[2]=== p2 && ttt_grid[5]===p2 && ttt_grid[8]===p2 ||
                ttt_grid[0]=== p2 && ttt_grid[4]===p2 && ttt_grid[8]===p2 ||
                ttt_grid[6]=== p2 && ttt_grid[4]===p2 && ttt_grid[2]===p2){
                 
                 console.log("winner:" + p2);
                 resetGame(ttt_grid);
                 res.send({grid: ttt_grid, winner:p2});
         }else{ 
                res.send({grid: ttt_grid,winner: ' '});
         }

        }else{

            res.send({grid: ttt_grid,winner: ' '});
        }

});
module.exports = router;
