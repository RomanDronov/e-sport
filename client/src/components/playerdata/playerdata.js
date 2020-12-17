import React from 'react';
import './playerdata.css';
export default class PlayerData extends React.Component {
    constructor(props) {
        super(props);
        //this.url=this.props.url;
        this.url='http://localhost:5000'
        this.state={
            json:false
        }
    }
    componentDidMount() {
        let urlStr=window.location.href;
        let url=new URL(urlStr);
        let urlSearchParams=url.searchParams;
        let name=this.props.name;
        let region=this.props.region;
        alert(this.url+'/player_general_info_tab/'+`${name}/${region}`);
        fetch(this.url+'/player_general_info_tab/'+`${name}/${region}`,{
            method:'GET'
        }).then(json=>json.json()).then(json=>this.setState({json:json})).catch(err=>err);
    }
    render() {
        let data=[];
        if(this.state.json){
            console.log(this.state.json);
            let playerData=this.state.json;
            data.push(<div className="profile-badge">
            <div className="league-solo">
                <div className="title">Solo</div>
                <div className="tier">
                    <div className="component-name">Tier</div>
                    <div className="data">{playerData.solo_league.tier}</div>
                </div>
                <div className="points">
                    <div className="component-name">Points</div>
                    <div className="data">{playerData.solo_league.league_points}</div>
                </div>
                <div className="points">
                    <div className="component-name">Rank</div>
                    <div className="data">{playerData.solo_league.rank}</div>
                </div>
                <div className="results">
                    <div className="wins">🏆 {playerData.solo_league.wins}</div>
                    <div className="wins">❌ {playerData.solo_league.losses}</div>
                </div>
            </div>
            <div className="player-info">
                <div className="player-row">
                    <div className="player-region">Russia</div>
                    <div className="player-icon">
                        <div className="icon" style={{ backgroundImage: `url(${playerData.info.player_pic})` }}></div>
                    </div>
        <div className="player-level">Level {playerData.info.player_level}</div>
                </div>
        <div className="player-name">{playerData.info.player_name}</div>
            </div>
            <div className="league-solo">
                <div className="title">Team</div>
                <div className="tier">
                    <div className="component-name">Tier</div>
                    <div className="data">{playerData.team_league.tier}</div>
                </div>
                <div className="points">
                    <div className="component-name">Points</div>
                    <div className="data">{playerData.team_league.league_points}</div>
                </div>
                <div className="points">
                    <div className="component-name">Rank</div>
                    <div className="data">{playerData.team_league.rank}</div>
                </div>
                <div className="results">
                    <div className="wins">🏆 {playerData.team_league.wins}</div>
                    <div className="wins">❌ {playerData.team_league.losses}</div>
                </div>
            </div>
        </div>);
        }
        return (
            <div className="app">
                {data}
            </div>
        );
    }
}