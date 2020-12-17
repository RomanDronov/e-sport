from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import database_script

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins":"*"}})

class player_general_info_tab(Resource):
    def get(self, player_name, region):
        data = database_script.provide_data({'region':region, 'player_name':player_name}, "player_general_info_tab")
        return data

class player_current_match_tab(Resource):
    def get(self, player_name, region):
        data = database_script.provide_data({'region':region, 'player_name':player_name}, "player_current_match_tab")
        return data

class player_champions_tab(Resource):
    def get(self, player_name, region):
        data = database_script.provide_data({'region':region, 'player_name':player_name}, "player_champions_tab")
        return data

class player_matches_tab(Resource):
    def get(self, player_name, region, begin_time, end_time):
        data = database_script.provide_data({'region':region, 'player_name':player_name, 'begin_time':begin_time, 'end_time':end_time}, "player_matches_tab")
        return data

api.add_resource(player_general_info_tab, "/player_general_info_tab/<string:player_name>/<string:region>")
api.add_resource(player_current_match_tab, "/player_current_match_tab/<string:player_name>/<string:region>")
api.add_resource(player_champions_tab, "/player_champions_tab/<string:player_name>/<string:region>")
api.add_resource(player_matches_tab, "/player_general_info_tab/<string:player_name>/<string:region>/<string:begin_time>/<string:end_time>")

if __name__ == "__main__":
    app.run(host='0.0.0.0')
