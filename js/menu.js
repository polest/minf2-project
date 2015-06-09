$(document).ready(function(){

    $("#button").click(function(){

        $("#HowToPic").fadeIn(1500);

    });

});

$(document).ready(function(){
    $("#HowToPic").click(function(){
        $("#HowToPic").fadeOut(1500);
    });
});

$(document).ready(function(){

    $("#Intro").click(function(){

        $("#video").fadeIn(1500);
        $("#Black").fadeIn(1500);
    });

});


$(document).ready(function(){
	$("#video").bind('ended', function(){

		$("#video").fadeOut(2000);
		$("#Black").fadeOut(2000);

	});
});


