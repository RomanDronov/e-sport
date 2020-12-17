import sys, datetime
from riotwatcher import LolWatcher, ApiError

# current API key
api_key = 'RGAPI-f6878302-f5a9-4fbc-bb49-05b070ec2770'

# global LoL watcher instance
watcher = LolWatcher(api_key)

# -------------------------------------------------------------------

def watcher_error_handler(f, *args):
    output = ''
    try:
        output = f(*args)
    except ApiError as err:
        if err.response.status_code == 429:
            print('Retry in {} seconds.'.format(err.response.headers['Retry-After']))
            print('API rate limit exceeded')
        elif err.response.status_code == 400:
            print('Bad API request.')
        elif err.response.status_code == 404:
            print('Summoner with that name not found or match not found.')
        elif err.response.status_code == 403:
            print('API key is expired or wrong.')
        elif err.response.status_code == 503:
            print('Service unavailable.')
        else:
            print("Unknown API error.")
        return err.response.status_code
        #sys.exit(1)
    return output


# Player info block

def get_player_info(region, player_name):
    player_info = watcher_error_handler(
        watcher.summoner.by_name, region, player_name)
    return player_info


def get_player_champion(region, player_id, champion_id):
    player_champion = watcher_error_handler(
        watcher.champion_mastery.by_summoner_by_champion, region, player_id, champion_id)
    return player_champion


def get_player_champions(region, player_id):
    player_champions = watcher_error_handler(
        watcher.champion_mastery.by_summoner, region, player_id)
    return player_champions


def get_player_champions_score(region, player_id):
    player_champions_score = watcher_error_handler(
        watcher.champion_mastery.scores_by_summoner, region, player_id)
    return player_champions_score


def get_player_ranks(region, player_id):
    player_ranks = watcher_error_handler(
        watcher.league.by_summoner, region, player_id)
    return player_ranks


# Match info block

def get_player_matches(region, account_id,
                       queue_id=None, begin_time=None,
                       end_time=None, begin_index=None,
                       end_index=None, season=None, champion=None):
    player_matches = watcher_error_handler(
        watcher.match.matchlist_by_account, region, account_id,
        queue_id, begin_time, end_time,
        begin_index, end_index, season, champion)
    return player_matches


def get_player_current_match(region, player_id):
    player_current_match = watcher_error_handler(
        watcher.spectator.by_summoner, region, player_id)
    return player_current_match


# Clash(tournaments) info block

def get_player_clash(region, player_id):
    player_clash = watcher_error_handler(
        watcher.clash.by_summoner, region, player_id)
    return player_clash


def get_tournaments(region):
    tournaments = watcher_error_handler(
        watcher.clash.tournaments, region)
    return tournaments


# Get data adapters

def get_champions_dict(region):
    latest = watcher_error_handler(watcher.data_dragon.versions_for_region, region)['n']['champion']
    champions_data = watcher_error_handler(watcher.data_dragon.champions, latest, False, 'en_US')
    champ_dict = {}
    for key in champions_data['data']:
        row = champions_data['data'][key]
        champ_dict[row['key']] = row['id']
    return champ_dict


def get_icon_dict_version(region):
    version = watcher_error_handler(watcher.data_dragon.versions_for_region, region)['n']['profileicon']
    return version

def get_maps_dict(region):
    latest = watcher_error_handler(watcher.data_dragon.versions_for_region, region)['n']['map']
    maps_data = watcher_error_handler(watcher.data_dragon.maps, latest, 'en_US')
    maps_dict = {}
    for key in maps_data['data']:
        row = maps_data['data'][key]
        maps_dict[row['MapId']] = row['MapName']
    return maps_dict

def get_icon_url(icon_id, dict_version):
    return 'http://ddragon.leagueoflegends.com/cdn/' + dict_version + '/img/profileicon/' + str(icon_id) + '.png'

def epoch_to_date(epoch):
    date = datetime.datetime.fromtimestamp(epoch/1000).strftime("%d.%m.%Y %H:%M:%S")
    return date

def date_to_epoch(date):
    dt = datetime.datetime.strptime(date, "%d.%m.%Y %H:%M:%S")
    epoch = int(dt.strftime("%s")) * 1000
    return epoch

# -------------------------------------------------------------------

# Tables assembly

# Player general info tab

def get_player_general_info_tab(player_name, region):
    player_info = get_player_info(region, player_name)
    icon_dict_version = get_icon_dict_version(region)
    if isinstance(player_info, int) or player_info == '' or isinstance(icon_dict_version, int) or icon_dict_version == '':
        solo_league = {'tier':'-', 
                       'rank':'-', 
                       'league_points': 0, 
                       'wins': 0, 
                       'losses': 0}
        team_league = {'tier':'-', 
                       'rank':'-', 
                       'league_points': 0, 
                       'wins': 0, 
                       'losses': 0}
        info = {'player_name': '', 
                'player_region': '',
                'player_pic': '',
                'player_level': 0}
    else:
        player_ranks = get_player_ranks(region, player_info['id'])
        info = {'player_name': player_name, 'player_region': region,
                'player_pic': get_icon_url(player_info['profileIconId'], icon_dict_version),
                'player_level': player_info['summonerLevel']}
        if player_ranks == []:
            solo_league = {'tier':'-', 
                           'rank':'-', 
                           'league_points': 0, 
                           'wins': 0, 
                           'losses': 0}
            team_league = {'tier':'-', 
                           'rank':'-', 
                           'league_points': 0, 
                           'wins': 0, 
                           'losses': 0}
        elif isinstance(player_ranks, int) or player_ranks == '':
            solo_league = {'tier':'-', 
                           'rank':'-', 
                           'league_points': 0, 
                           'wins': 0, 
                           'losses': 0}
            team_league = {'tier':'-', 
                           'rank':'-', 
                           'league_points': 0, 
                           'wins': 0, 
                           'losses': 0}
        elif (player_ranks[0]['queueType'] == 'RANKED_SOLO_5x5'):
            solo_league = {'tier':player_ranks[0]['tier'], 
                           'rank':player_ranks[0]['rank'], 
                           'league_points':player_ranks[0]['leaguePoints'], 
                           'wins': player_ranks[0]['wins'], 
                           'losses': player_ranks[0]['losses']}
            team_league = {'tier':player_ranks[1]['tier'], 
                           'rank':player_ranks[1]['rank'], 
                           'league_points':player_ranks[1]['leaguePoints'], 
                           'wins': player_ranks[1]['wins'], 
                           'losses': player_ranks[1]['losses']}
        else:
            team_league = {'tier':player_ranks[0]['tier'], 
                           'rank':player_ranks[0]['rank'], 
                           'league_points':player_ranks[0]['leaguePoints'], 
                           'wins': player_ranks[0]['wins'], 
                           'losses': player_ranks[0]['losses']}
            solo_league = {'tier':player_ranks[1]['tier'], 
                           'rank':player_ranks[1]['rank'], 
                           'league_points':player_ranks[1]['leaguePoints'], 
                           'wins': player_ranks[1]['wins'], 
                           'losses': player_ranks[1]['losses']}
    player_general_info_tab = {'info':info, 
                               'solo_league':solo_league, 
                               'team_league':team_league}
    return player_general_info_tab


# Player current match tab

def get_player_current_match_tab(player_name, region):
    player_current_match_tab = {}
    player_info = get_player_info(region, player_name)
    champion_dict = get_champions_dict(region)
    maps_dict = get_maps_dict(region)
    icon_dict_version = get_icon_dict_version(region)
    if isinstance(player_info, int) or player_info == '' or isinstance(champion_dict, int) or champion_dict == '' or isinstance(maps_dict, int) or maps_dict == '' or isinstance(icon_dict_version, int) or icon_dict_version == '':
        player_current_match_tab = {}
    else:
        match_info = get_player_current_match(region, player_info['id'])
        if isinstance(match_info, int) or match_info == '':
            player_current_match_tab = {}
        else:
            participants = {}
            for i, participant in enumerate(match_info['participants']):
                participant_data = {'participant_name': participant['summonerName'],
                                    'participant_champion': champion_dict.get(str(participant['championId']), ''),
                                    'participant_icon': get_icon_url(participant['profileIconId'], icon_dict_version),
                                    'participant_bot': participant['bot']}
                participants[str('participant_'+str(i+1))] = participant_data
            player_current_match_tab = {'map':maps_dict[str(match_info['mapId'])], 'gamemode':match_info['gameMode'], 'game_type':match_info['gameType'], 'participants':participants}
        return player_current_match_tab

# Player champion info tab

def get_player_champions_tab(player_name, region):
    player_champions_tab = {}
    player_info = get_player_info(region, player_name)
    champion_dict = get_champions_dict(region)
    if isinstance(player_info, int) or player_info == '' or isinstance(champion_dict, int) or champion_dict == '':
        player_champions_tab = {}
    else:
        player_champions = get_player_champions(region, player_info['id'])
        for champion in player_champions:
            champion_data = {'champion_level':champion['championLevel'], 
                             'champion_points':champion['championPoints'], 
                             'last_time_played':epoch_to_date(champion['lastPlayTime']), 
                             'points_until_new_level':champion['championPointsUntilNextLevel'], 
                             'chest_granted':champion['chestGranted'], 
                             'tokens_earned':champion['tokensEarned']}
            player_champions_tab[champion_dict.get(str(champion['championId']), '')] = champion_data
    return player_champions_tab

# Player matches tab

def get_player_matches_tab(player_name, region, queue_id=None, begin_time=None,
                       end_time=None, begin_index=None,
                       end_index=None, season=None, champion=None):
    player_matches_tab = {}
    player_info = get_player_info(region, player_name)
    champion_dict = get_champions_dict(region)
    if isinstance(player_info, int) or player_info == '' or isinstance(champion_dict, int) or champion_dict == '':
        player_matches_tab = {}
    else:
        matches = get_player_matches(region, player_info['accountId'], queue_id, date_to_epoch(begin_time), date_to_epoch(end_time), begin_index, end_index, season, champion)
        if isinstance(matches, int) or matches == '':
            player_matches_tab = {}
        else:
            for i, match in enumerate(matches['matches']):
                player_matches_tab[str('match_' + str(i))] = {'champion':champion_dict.get(str(match['champion']), ''), 
                                         'season':match['season'],
                                         'date':epoch_to_date(match['timestamp']),
                                         'role':match['role'],
                                         'lane':match['lane']}
    return player_matches_tab
