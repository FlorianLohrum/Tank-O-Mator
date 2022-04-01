//Funktion welche das Akkordion dynamisch erstellt
//var configFile = require('../assets/config.json');
var data;

function createAccordion(spritArt){
  document.getElementById("loading").classList.remove("d-none");
  
  

  //API Anfrage nach den Daten
  let request = new XMLHttpRequest();
  let hostIp = "10.50.15.51";

  request.open('GET','http://'+hostIp+':1273/api/gasStation?location='+document.getElementById("ortRow").value+'&radius='+document.getElementById("radiusRow").value);
  request.send();
  request.onload = () => {
    if(request.status == 200){
      console.log(JSON.parse(request.response)[0]['status']);

      if(JSON.parse(request.response)[0]['status'] == "error"){
        document.getElementById("errorText").innerHTML ="";
        document.getElementById("errorText").innerHTML +="\n "+JSON.parse(request.response)[0]['description']
        document.getElementById("noGasStation").classList.remove("d-none");
        document.getElementById("loading").classList.add("d-none");
      }
      else{
        createData(JSON.parse(request.response), spritArt);
      }
    
    }
    else{
      console.log(`error ${request.status} ${request.statusText}`);
    }
  }
}

  //Erstellen der einzelnen Elemente, für jede gefundene Tankstelle
function createData(data, spritArt){

  //Beide If-Anfragen um zu schauen, ob Elemente angezeigt werden, falls ja, mach diese unsichtbar
  if(!document.getElementById("loading").classList.add("d-none")){
    document.getElementById("loading").classList.add("d-none");
  }
 
  if(!document.getElementById("noGasStation").classList.contains("d-none")){
    document.getElementById("noGasStation").classList.add("d-none");
  }

  //Herrausfinden welche Tankstelle den geringsten Preis besitzt
  var minIndex = 0;
  var minPrice = 100;

  for(var i = 0; i < data[0]['stations'].length; i++){
    if(minPrice > data[0]['stations'][i]['Gasprices'][spritArt]){
      minIndex = i;
      minPrice = data[0]['stations'][i]['Gasprices'][spritArt];
    }
  }

  //Erstellung der einzelnen Akkordion-Elemente mit den nötigen Informationen
  var currentTime = new Date();
  var accordion = document.getElementById("accordion");
 
  for(var i = 0; i < data[0]['stations'].length; i++ ){

    //Anfangsinitalisierung für die Farbwerte
    var priceColor ="";
    if(i == minIndex || data[0]['stations'][i]['Gasprices'][spritArt] == data[0]['stations'][minIndex]['Gasprices'][spritArt] ){
      priceColor="text-success";
    }
    var isOpen;
    if(data[0]['stations'][i]['isOpen']){
      isOpen = "Geöffnet";
      color = "text-success"
    }
    else{
      isOpen = "Geschlossen";
      color ="text-danger"
    }

    //Spritpreise
    var gasprice = data[0]['stations'][i]['Gasprices'][spritArt];
    var gaspriceSuper = data[0]['stations'][i]['Gasprices']["Super"];
    var gaspriceDiesel = data[0]['stations'][i]['Gasprices']["Diesel"];
    var gaspriceE10 = data[0]['stations'][i]['Gasprices']["E10"];

    accordion.innerHTML +=
      "<div class=\"accordion-item w-75 bg-dark text-light\">" +
       "<div class=\"accordion-button d-grid bg-dark text-light text-center\" data-bs-toggle=\"collapse\" role=\"button\"  data-bs-target=\"#collapse"+i+"\" aria-expanded=\"false\" aria-controls=\"collapse"+i+"\" id=\"heading"+i+"\">"+
          "<div class=\"row \">"+
          "<div class=\"container col text-start ps-5\"><i class=\"fas fa-gas-pump\"></i> "+data[0]['stations'][i]['Name']+"</div>"+
          "<div class=\"container col\"><i class=\"fas fa-history\"></i> "+currentTime.getHours() +":"+ (currentTime.getMinutes()<10?'0':'') + currentTime.getMinutes() +" Uhr</div>"+
          "<div class=\"container col\"><i class=\"fas fa-burn\"></i> "+spritArt+"</div>"+
          "<div class=\"container col "+priceColor+"\"><i class=\"fa-solid fa-euro-sign\"></i>"+ gasprice.substring(0,gasprice.length -1)+"<sup>" + gasprice.substring(gasprice.length - 1, gasprice.length) + "</sup></div>"+
          "</div>" +
      "</div>"+
      "<div id=\"collapse"+i+"\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading"+i+"\" data-bs-parent=\"#accordion\">"+
    
      "<div class=\"accordion-body \">"+    
      "<div class=\"d-grid text-center border-info \">"+
          "<div class=\"row h6 text-muted\">"+
          "<div class=\"container col\"><i class=\"fas fa-building\"></i> Marke</div>"+
          "<div class=\"container col\"><i class=\"fas fa-clock\"></i> Geöffnet?</div>"+
          "<div class=\"container col\"><i class=\"fas fa-road\"></i> Adresse</div>"+
      "</div>" +
      "<div class=\"row  mb-4\">"+
         "<div class=\"container col\">"+data[0]['stations'][i]['Brand']+"</div>"+
         "<div class=\"container col " +color+ "\">" + isOpen+ "</div>"+
         "<div class=\"container col\">"+data[0]['stations'][i]['City'] + "<br>" + data[0]['stations'][i]['Adress'] + "</div>"+
      "</div>" +
        
     "<div class=\"row h6 text-muted mb-2\">"+
        "<div class=\"container col\"><i class=\"fas fa-burn\"></i> E10</div>"+
        "<div class=\"container col\"><i class=\"fas fa-burn\"></i> Super</div>"+
        "<div class=\"container col\"><i class=\"fas fa-burn\"></i> Diesel</div>"+
      "</div>"+
      "<div class=\"row\">"+
        "<div class=\"container col\"> "+gaspriceE10.substring(0,gaspriceE10.length -1)+"<sup>" + gaspriceE10.substring(gaspriceE10.length - 1, gaspriceE10.length)+"</sup> €</div>"+
        "<div class=\"container col\"> "+gaspriceSuper.substring(0,gaspriceSuper.length -1)+"<sup>" + gaspriceSuper.substring(gaspriceSuper.length - 1, gaspriceSuper.length)+"</sup> €</div>"+
        "<div class=\"container col\"> "+gaspriceDiesel.substring(0,gaspriceDiesel.length -1)+"<sup>" + gaspriceDiesel.substring(gaspriceDiesel.length - 1, gaspriceDiesel.length)+"</sup> €</div>"+
      "</div>"    +
     " </div>"+
      "</div>"+
      "</div>"+
      "</div>";
    }
}
