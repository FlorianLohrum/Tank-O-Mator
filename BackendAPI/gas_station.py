import requests
import requests_cache

# TankkönigAPI / WeatherAPi. Keys der APIs
MY_API_KEY = ["8f190f73-3db7-b9a3-fadc-49cbcb0adb61" , "20bfe76c98c69a4824b781a57d28433c"]

#Diese Funktion cached alle anfragen auf die APIs. Somit werden wiederholende Anfragen efizienter angegeben.
#Die funktion speiuchert vergangene Anfragen in einer automatisch generierten splite Datenbank.
requests_cache.install_cache(cache_name='cache', backend='sqlite', expire_after=300)

def main(location, radius):

    #Erfragen der GroDaten mit dem Eingegebenen Ortsnamen und in json parsen.
    response = getGeoLocation(location)
    json = response.json()

    #Überprüfen ob Anfrage ohne Probeleme lief.
    if response.status_code != 200 or len(json) == 0:
        return exeptionHandling("GeoLocationAPI Error - Überprüfen Sie Ihren Standort")
    #Location Daten in Array ordnen
    geoLocation = [json[0]['lat'], json[0]['lon']]

    #EErfragen der Tankstellen Daten mit den Geodaten und dem eingegebenen Radius und in json parsen.
    response = getGasstationData(geoLocation, radius)
    json = response.json()

    #Überprüfen ob Anfrage ohne Probeleme lief.
    if response.status_code != 200:
        return exeptionHandling("TankkönigAPI Error")
    #rückgabe aller gefundenen Daten. Diese werden nocheinmal in eine neue Strucktur gebracht.
    return orderData(json, location)

#Die Funktion erstellt im fall eines Fehlers eine Error Json welche zurückgegeben wird.
def exeptionHandling(description):
    json = [{
     'status': 'error',
     'statuscode': 500,
     'description': f"{description}"
    }]
    return json;

#Alle abgefragten Daten werden in eine Rückgabejson geordnet.
def orderData(json, location):
    if len(json['stations']) == 0:
        stationJson = stationJson = [{
        'status': 'error',
        'statuscode': 404,
        'description': "Keine Tankstelle gefunden!",
        'location': location,
        'stations': []
        }]
    else:
        stationJson = [{
        'status': json['status'],
        'location': location,
        'stations': []
        }]
        try:
            for station in json['stations']:
                st = {
                    'Name': station["name"],
                    'Brand': station["brand"],
                    'City' : str(station["postCode"])+ " " + str(station["place"]),
                    'Adress': str(station["street"]) + " " + str(station["houseNumber"]),
                    'Gasprices': {'Super': str(station["e5"]),'E10': str(station["e10"]),'Diesel': str(station["diesel"])},
                    'isOpen': station["isOpen"]
                }

                stationJson[0]['stations'].append(st)
        except:
            pass
    return stationJson

# erstellt die Anfrage an die TankKönig API und gibt die Daten der Anfragen zurück
def getGasstationData(geoLocation, radius):
    params = {
        "lat": geoLocation[0],
        "lng": geoLocation[1],
        "rad": radius,
        "type": "all",
        "sort": "dist",
        "apikey": MY_API_KEY[0]
    }
    #Aufruf der ausgelagerten Funktion.
    response = request("https://creativecommons.tankerkoenig.de/json/list.php", params)
    print("Station cached: ")
    print(response.from_cache)
    return response

# erstellt die Anfrage an die OpenWeather API und gibt die Daten der Anfragen zurück
def getGeoLocation(location):
    params = {
        "q": location.lower(),
        "limit": 1,
        "appid": MY_API_KEY[1]
    }
    #Aufruf der ausgelagerten Funktion.
    response = request("http://api.openweathermap.org/geo/1.0/direct", params)
    print("Location cached: ")
    print(response.from_cache)
    return response
    
#ausgelagerte Funktion. Hier findet die ANfrage an die Fremd API statt.
def request(theUrl, params):
    session=requests.session()
    #keep_alive muss auf false sein damit sich die session automatisch beendet.
    #Wird das nicht gemacht blockiert die API bei mehreren aktiven Session dieser IP.
    session.keep_alive = False
    response = requests.get(theUrl, params)
    return response

if __name__ == "__main__":
    print(main("Berlin", 5))
    





