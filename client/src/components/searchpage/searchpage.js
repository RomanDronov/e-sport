import React from 'react';
import './searchpage.css';
import { Search } from '../search/search';
import Leaderboard from '../leaderboard/leaderboard';
import Playerdata from '../playerdata/playerdata';
import Match from '../match/match';
export default class SearchPage extends React.Component {
    constructor(props){
        super(props);
        this.handleTitleView=this.handleTitleView.bind(this);
        this.handleLeaderBoard=this.handleLeaderBoard.bind(this);
        this.handlePlayerData=this.handlePlayerData.bind(this);
        this.handleMatch=this.handleMatch.bind(this);
        this.state={
            title:true,
            component:null
        }
    }
    handleTitleView(view){
        this.setStyle({title:view});
    }
    handleLeaderBoard(name,region){
    this.setState({component:<Leaderboard direction='row' name={name} region={region}/>,title:false});
    }
    handlePlayerData(name,region){
        this.setState({component:<Playerdata name={name} region={region}/>,title:false});
    }
    handleMatch(name,region,date){
        this.setState({component:<Match name={name} region={region} date={date}/>,title:false})
    }
    render() {
        return (
            <div className="app-search">
             {this.state.title? <div className="search-title">E-sport visualization</div>:null}
                <div className="search-box"><Search handleLeaderBoard={this.handleLeaderBoard} handlePlayerData={this.handlePlayerData} handleMatch={this.handleMatch}/></div>
                {this.state.component}
            </div>
        );
    }
}