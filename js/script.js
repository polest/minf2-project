


    var vid = document.getElementById('Intro');
    var vids = document.getElementById('shitboy');

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
        }else if(event.keyCode == 38 && levelFinished){

        }else if(event.keyCode == 37 && levelFinished){

        }else if(event.keyCode == 39 && levelFinished){

        }else if(event.keyCode == 13 && levelFinished){
            document.getElementById('levelwechsel').style.visibility="hidden";
            game.paused = false;            
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
    }

    function endeBild(){
        document.getElementById('ende').style.visibility="visible";
        game.paused = true;
    }

    function video(){
        
        document.getElementById('black').style.visibility = 'visible';
        vid.style.visibility ="visible"
        introSoundStop();
        vid.play();
        setTimeout(
  function() 
  {
    introSoundPlay();
  }, 47000);



    }

      function shitboysvideo(){
        document.getElementById('black').style.visibility = 'visible';
        vids.style.visibility ="visible";
        vids.play();
        game.paused = true;
        setTimeout(
  function() 
  {
    vids.style.visibility ="hidden";
    document.getElementById('black').style.visibility = 'hidden';
    game.paused = false;

  }, 5000);
      }



    function bgSound1Stop(){
       document.getElementById('BgSound1').pause();
    }
    function bgSound1Play(){
       document.getElementById('BgSound1').play();
    }


    function bossSoundPlay(){
       document.getElementById('BossSound').play();
    }
    function bossSoundStop(){
       document.getElementById('BossSound').pause();
    }

    function gameWinPlay(){
       document.getElementById('gameWin').play();
    }
    function gameWinStop(){
       document.getElementById('gameWin').pause();
    }




    function bgSound2Stop(){
       document.getElementById('BgSound2').pause();
    }
    function bgSound2Play(){
       document.getElementById('BgSound2').play();
    }
     function introSoundStop(){
       document.getElementById('introSound').pause();
    }
    function introSoundPlay(){
       document.getElementById('introSound').play();
    }

      function winSound(){
       document.getElementById('win').play();
    }

    vid.addEventListener('ended',myHandler,false);
    function myHandler(e) {
        if(!e) { e = window.event; }
        document.getElementById('black').style.visibility = 'hidden';
        vid.style.visibility = 'hidden';
    }

