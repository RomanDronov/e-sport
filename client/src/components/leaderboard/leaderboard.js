import React from 'react';
//import './leaderboard.css';
export default class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.url="http://localhost:5000";
    this.leadersStyle = {
      flexDirection: this.props.direction || 'column',
      display: 'flex',
      flexWrap: 'wrap'
    }
    this.state = {
      json: false
    }
  }
  componentDidMount() {
    let name = this.props.name;
    let region = this.props.region;
    fetch(this.url + '/player_champions_tab/' + `${name}/${region}`, {
      method: 'GET'
    }).then(json => json.json()).then(json => this.setState({ json: json })).catch(err => err);
  }
  render() {
    let leaderboard = [];
    if (this.state.json) {
      let json=this.state.json;
      let color = true;
      for (let a in json) {
        let leaderStyle = color ? { backgroundColor: '#EEEEEE' } : null;
        leaderboard.push(
          <div className="leader" style={leaderStyle}>
            <div className="info-block">
              <div className="name">{a}</div>
              <div className="level">Level {json[a].champion_level}</div>
              <div className="last">Last {json[a].last_time_played}</div>
              <div className="total">Total {json[a].tokens_earned}</div>
              <div className="total">Chest {json[a].chest_granted ? '👍' : '👎'}</div>
              <div className="total">Until next {json[a].points_until_new_level}</div>
            </div>
            <div className="result">{json[a].champion_points}</div>
          </div>
        );
        color = !color;
      }
    }
    return (
      <div className="leaderboard">
        <div className="title">Leaderboard</div>
        <div className="leaders" style={this.leadersStyle}>
          {leaderboard}
        </div>

      </div>
    )
  }
}