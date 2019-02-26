

var p1 = "x";
// var grid_t = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
$(document).ready(function() {
    $(".grid-container div").each(function(pos) {

        $(this).on('click', function() {  
                console.log($(this).text());
            if($(this).text() === "" || $(this).text()=== " "){
                        console.log($(this).text());
                        $(this).text(p1);
                        var humanMove = pos;
                        //ajax call
                        $.ajax({
                            url: '/ttt/play',
                            type: 'POST',
                            dataType: "json",
                            data: JSON.stringify({
                                // "grid": grid_t,
                                "move": humanMove
                            }),
                            contentType: "application/json",
                            success: function(data) {
                                var g = data.grid;
                                console.log(g);
                                if(data.winner === 'X' || data.winner === 'O'){
                                    $('#result').text("Winner:" + data.winner);
                                    $(".grid-container div").each(function(){
                                        $(this).text(" ");
                                    })

                                    //set winner back to blank
                                    setTimeout(function(){
                                        $('#result').text("Winner:");
                                      }, 800);

                                }else if(data.winner){
                                    $(".grid-container div").each(function(pos){
                                        $(this).text(g[pos]);
                                    })
                                }
                               
                                
                                
                            }
                        });

                    }
                    
                });

            
            });

});

