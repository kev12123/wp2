

var p1 = "x";
// var grid_t = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
$(document).ready(function() {
    $(".grid-container div").each(function(pos) {

        $(this).on('click', function() {  

                        console.log($(this).text());
                        $(this).text(p1);
                        $(this).unbind("click");
                        var humanMove = pos;
                        // grid_t[humanMove] = p1;
                        pos += 1;

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
                                $('#result').text("Winner:" + data.winner);
                                if (data.winner === " " || data.winner === "o") {
                                    $(".grid-container div").each(function(i) {
                                        $(this).text(g[i]);
                                        
                                        if(g[i]==='o'){
                                             var test = "#item"+(i+1).toString();
                                            $(test).unbind();
                                        } 
                                        i+=1;
                            
                                    });
                                }

                            }
                        });


                    
                });
            });

});

