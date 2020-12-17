import json, os, API_script, datetime

# functions

def provide_data(input_data, request_type):
    clean_old_data()
    output = find_data(input_data, request_type)
    if output == {}:
        data_file = {'requests':[]}
        if os.path.isfile('./database.json'):
            with open('./database.json') as f:
                data_file = json.load(f)
        current_time = datetime.datetime.now()
        data_block = {'request_type':request_type,
                        'input_data':input_data,
                        'request_time':current_time.strftime('%d.%m.%Y %H:%M:%S'),
                        'data':request_data(input_data, request_type)}
        data_file['requests'].append(data_block)
        with open('database.json', 'w', encoding='utf-8') as json_file:
            json.dump(data_file, json_file, ensure_ascii=False, indent=4)
        return data_block['data']
    else:
        return output

def find_data(input_data, request_type):
    if os.path.isfile('./database.json'):
        with open('./database.json') as f:
            data_file = json.load(f)
        for x in data_file['requests']:
            if x['request_type'] == request_type and x['input_data'] == input_data:
                return x['data']
    return {}

def clean_old_data():
    if os.path.isfile('./database.json'):
        with open('./database.json') as f:
            data_file = json.load(f)
        to_clean = []
        for x in data_file['requests']:
            if (datetime.datetime.now() - datetime.datetime.strptime(x['request_time'], "%d.%m.%Y %H:%M:%S")).total_seconds() / 60 > 10:
                to_clean.append(x)
        for x in to_clean:
            data_file['requests'].remove(x)
        with open('database.json', 'w', encoding='utf-8') as json_file:
            json.dump(data_file, json_file, ensure_ascii=False, indent=4)

def request_data(input_data, request_type):
    if request_type == 'player_general_info_tab':
        return API_script.get_player_general_info_tab(input_data['player_name'], input_data['region'])
    elif request_type == 'player_current_match_tab':
        return API_script.get_player_current_match_tab(input_data['player_name'], input_data['region'])
    elif request_type == 'player_champions_tab':
        return API_script.get_player_champions_tab(input_data['player_name'], input_data['region'])
    elif request_type == 'player_matches_tab':
        return API_script.get_player_matches_tab(input_data['player_name'], input_data['region'], 
                                                     None, input_data['begin_time'], input_data['end_time'])
    else:
        return {}
