import React, { useState, version } from 'react';
import './search-input.css';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import Fade from 'react-reveal/Fade';
import Slide from 'react-reveal/Slide';
import { Link } from 'react-router-dom';
import Select from 'react-select';
export class MainInput extends React.Component {
    constructor(props) {
        super(props);
        this.matchTabOnClick = this.matchTabOnClick.bind(this);
        this.handleLeaderClick=this.handleLeaderClick.bind(this);
        this.handlePlayerClick=this.handlePlayerClick.bind(this);
        this.handleMatchClick=this.handleMatchClick.bind(this);
        this.handleSelect=this. handleSelect.bind(this);
        this.state = {
            matchfields: false,
            collapseEffect: false,
            playerName:'',
            region:'ru',
            url:new URL('http://localhost:5000/playerdata?name=tmp&region=ru'),
            urlPath:'/playerdata?name=tmp&region=RU',
            date:null,
            matchIsOpened:false
            
        };
        this.handlePlayerNameChange=this.handlePlayerNameChange.bind(this);
        this.setSelectedDay=this.setSelectedDay.bind(this);
        this.options = [
            { value: "us", label: "US" },
            { value: "ru", label: "Russia" },
            { value: "ru", label: "Japan" },
            { value: "ru", label: "China" },
            { value: "ru", label: "Europe" },
            { value: "ru", label: "CEMEA" },
            { value: "ru", label: "Oceania" },

        ]
    }
    matchTabOnClick() {
        this.setState({
            matchfields: true,
            collapseEffect: true,
            matchIsOpened:true
        })
    }
    handlePlayerNameChange(event){
        this.setState({playerName:event.target.value});
        this.handleLinkChange(event.target.value);
    }
    handleLeaderClick(event){
        this.props.handleLeaderBoard(this.state.playerName,this.state.region);
    };
    setSelectedDay(value){
        console.log(value);
        this.setState({
            date:value
        });
    }
    handleLinkChange(playerName){
        let currentUrl=this.state.url;
        let currentUrlSearchParams=currentUrl.searchParams;
        let name=playerName||currentUrlSearchParams.get('name');
        let region=currentUrlSearchParams.get('region');
        console.log(this.state.urlPath);
        this.setState({url:new URL(`https://${currentUrl.hostname}:${currentUrl.port}${currentUrl.pathname}?name=${name}&region=${region}`),urlPath:`${currentUrl.pathname}?name=${name}&region=${region}`})
    }
    handlePlayerClick(){
        this.props.handlePlayerData(this.state.playerName,this.state.region);
        console.log(this.state.playerName,this.state.region);
        console.log('player click');
    }
    handleMatchClick(){
        this.props.handleMatch(this.state.playerName,this.state.region,this.state.date);
        console.log('macth click');
    }
    handleSelect(value){
        console.log(value);
        this.setState({region:value.value});
    }
    render() {
        let matchfields = [];
        if (this.state.matchfields) {
            matchfields.push(<Slide right><div className="player-name" style={{ borderLeft: '2px solid #333333', borderRadius: 0 }}></div></Slide>);
            matchfields.push(<Slide right><DatePicker onChange={this.setSelectedDay} value={this.state.date}/></Slide>)
        }
        return (<div className="main-input">
            <div className="main-data-input inputs">
                <Slide right ><div className='player-name'><input type="text" placeholder="Player name" onChange={this.handlePlayerNameChange}/></div></Slide>
                <Slide right><div className="player-region"><Select className="player-region-select" classNamePrefix="player-region-select" options={this.options} defaultInputValue={'US'} onChange={this.handleSelect}/></div></Slide>
                {matchfields}
                <div class="search-button" onClick={this.state.matchIsOpened?this.handleMatchClick:this.handlePlayerClick}>
                    Search</div>
            </div>
            <div className="main-data-input">
                <div className="search-tabs">
                    <div className="name" onClick={this.matchTabOnClick}>
                        <span>🎮 </span><span>Match</span>
                        </div></div>
                <div className="search-tabs"><div className="name">
                        <span>💻 </span><div className="title">E-match</div>
                        </div>
                    </div>
                    <div className="search-tabs" onClick={this.handleLeaderClick}><div className="name">
                        <span>🏆 </span><div className="title">Champions</div>
                        </div>
                    </div>
            </div>
        </div>);
    }
}