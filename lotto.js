var lottozahlen = new Array(6);
var hoechsteLottozahl= new Array(6);


function zieheZahl(){
	var zahl= Math.floor((Math.random() *49+1));
	return zahl;
}
document.write(zieheZahl()+" ");


function zieheReihe(){
	var b=0;
	for (var i=1; i<=6; i++){
			lottozahlen[i]=zieheZahl();

	for (var j=1; j<=6; j++){
		if(lottozahlen[i]>b){
			b=lottozahlen[i];
			hoechsteLottozahl[j]=b;
			document.write(hoechsteLottozahl[j]+ " ")

		}
	}
	}



}
document.write("Lottozahlen: ");
zieheReihe();