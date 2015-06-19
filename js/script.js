

    var vid = document.getElementById('Intro');


    document.onkeydown = function(event) {
        if (event.keyCode == 80 && gameStarted) {
            if(game.paused){
                game.paused = false;
                document.getElementById('pause').style.visibility = 'hidden';
            }else if (game.paused == false){
                document.getElementById('pause').style.visibility = 'visible';
                game.paused = true;
            }
        }
        if(event.keyCode == 77){
            location.reload();
        }    
    }

    function einblenden() { 
        document.getElementById('HowToPic').style.visibility="visible"; 
        document.onkeydown = function(event){
            if(event.keyCode == 27){
                document.getElementById('HowToPic').style.visibility="hidden";
            }
        }
    }

    function levelwechsel(){
        document.getElementById('levelwechsel').style.visibility="visible";
        game.paused = true; 
        document.onkeydown = function(event){
            if(event.keyCode == 77){
                location.reload();
            }else if(event.keyCode == 38){

            }else if(event.keyCode == 37){

            }else if(event.keyCode == 39){

            }else{
                document.getElementById('levelwechsel').style.visibility="hidden";
                game.paused = false;
            }
        }
    }

    function video(){
        document.getElementById('black').style.visibility = 'visible';
        vid.style.visibility ="visible"
        vid.play();


    }

    vid.addEventListener('ended',myHandler,false);
    function myHandler(e) {
        if(!e) { e = window.event; }
        document.getElementById('black').style.visibility = 'hidden';
        vid.style.visibility = 'hidden';
    }