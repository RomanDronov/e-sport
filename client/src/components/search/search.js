import React from 'react';
import './search.css';
import {MainInput} from './serach-input/search-input';
export class Search extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
        <div className="search">
            <MainInput handleLeaderBoard={this.props.handleLeaderBoard} handlePlayerData={this.props.handlePlayerData} handleMatch={this.props.handleMatch}/>
        </div>);
    }
}