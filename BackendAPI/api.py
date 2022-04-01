from urllib import response
import flask
from gas_station import main as gasStationMain
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)
app.config["Debug"] = True


@app.route('/', methods=['GET'])
def default():
    return jsonify([{'status': 200}])

@app.route('/api/gasStation', methods=['GET'])
def gasStations():
    return jsonify(gasStationMain(request.args['location'], request.args['radius']))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
