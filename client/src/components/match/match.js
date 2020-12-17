import React from 'react';
import './match.css';
export default class Match extends React.Component{
    constructor(props){
        super(props);
        this.url='http://localhost:5000';
        this.state={
            json:false
        }
        this.months={
            '01':'January',
            '02':'February',
            '03':'March',
            '04':'April',
            '05':'May',
            '06':'June',
            '07':'July',
            '08':'August',
            '09':'September',
            '10':'October',
            '11':'November',
            '12':'December'
        }
    }
    /**
     * @date {day: 15, month: 12, year: 2020}
     * req http://127.0.0.1:5000/player_general_info_tab/desarter/ru/01.09.2020 00:00:00/06.09.2020 00:00:00
     */
    componentDidMount(){
        let name = this.props.name;
        let region = this.props.region;
        let date=this.props.date;
        let begin_date=`${this.parseDay(date.day)}.${date.month}.${date.year} 00:00:00`;
        let end_dateObj = new Date(`${date.year}-${date.month}-${this.parseDay(date.day)}`);
        end_dateObj.setDate(end_dateObj.getDate() + 6);
        console.log(end_dateObj.getDate(),end_dateObj.getFullYear());
        console.log(end_dateObj);
        let end_date=`${this.parseDay(end_dateObj.getDate())}.${end_dateObj.getMonth()+1}.${end_dateObj.getFullYear()} 00:00:00`;
        console.log(end_date);
        fetch(this.url + '/player_general_info_tab/' + `${name}/${region}/${begin_date}/${end_date}`, {
          method: 'GET'
        }).then(json => json.json()).then(json => this.setState({ json: json })).catch(err => err);
    }
    parseDay(day){
        if(day<10){
            return '0'+day;
        }
        else return day;
    }
    formDate(date){
        let dateTime=date.split(' ');
        let dateArr=dateTime[0].split('.');
        let timeArr=dateTime[1].split(':');
        console.log(dateTime);
        console.log(timeArr);
        return {
            day:dateArr[0],
            month:dateArr[1],
            year:dateArr[2],
            hour:timeArr[0],
            minute:timeArr[1]
        }
    }
    parseMonth(month){
        for(let a in this.months){
            if(a===month) return this.months[a];
        }
    }
    render(){
        let matches=[];
        let currentDate='0';
        let tmpArr=[];
        console.log(this.state.json);
        if(this.state.json){
            let json=this.state.json;
            for(let a in json){
                let date=this.formDate(json[a].date);
                if(date.day===currentDate){
                    tmpArr.push(
                    <div className="event">
                      <div className="time">{date.hour}:{date.minute}</div>
                      <div
                        className="pic"
                        style={{background: `url(http://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/${json[a].champion}.png)`,backgroundSize: '90%', backgroundPosition: 'center'}}
                      ></div>
                      <div className="name">{json[a].champion}</div>
                      <div className="name">Season {json[a].season}</div>
                      <div className="name">Role {json[a].role}</div>
                      <div className="name">Lane {json[a].lane}</div>
                    </div>
                  );
                }
                else{
                    if(tmpArr.length!=0){
                        currentDate=date.day;
                        matches.push(<div className="event-view">{tmpArr}</div>)
                        tmpArr=[];
                        matches.push(<div className="date">{date.day} {this.parseMonth(date.month)}</div>);
                          tmpArr.push(
                    <div className="event">
                      <div className="time">{date.hour}:{date.minute}</div>
                      <div
                        className="pic"
                        style={{background: `url(http://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/${json[a].champion}.png)`,backgroundSize: '90%', backgroundPosition: 'center'}}
                      ></div>
                      <div className="name">{json[a].champion}</div>
                      <div className="name">Season {json[a].season}</div>
                      <div className="name">Role {json[a].role}</div>
                      <div className="name">Lane {json[a].lane}</div>
                    </div>);
                    }
                    else{
                    matches.push(<div className="date">{date.day} {this.parseMonth(date.month)}</div>);
                    tmpArr.push(
                        <div className="event">
                          <div className="time">{date.hour}:{date.minute}</div>
                          <div
                            className="pic"
                            style={{background: `url(http://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/${json[a].champion}.png)`,backgroundSize: '90%', backgroundPosition: 'center'}}
                          ></div>
                          <div className="name">{json[a].champion}</div>
                          <div className="name">Season {json[a].season}</div>
                          <div className="name">Role {json[a].role}</div>
                          <div className="name">Lane {json[a].lane}</div>
                        </div>);
                    currentDate=date.day;
                    }
                }

               /* let date=this.formDate(json[a].date);
                console.log(currentDate,date.day,currentDate!=date.day);
                if(!currentDate||currentDate!=date.day){
                    matches.push(<div className="date">{date.day} {this.parseMonth(date.month)}</div>)
                    currentDate=date.day
                };
                matches.push(
                    <div className="event-view">
                    <div className="event">
                      <div className="time">{date.hour}:{date.minute}</div>
                      <div
                        className="pic"
                        style={{background: `url(http://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/${json[a].champion}.png)`,backgroundSize: '90%', backgroundPosition: 'center'}}
                      ></div>
                      <div className="name">{json[a].champion}</div>
                      <div className="name">Season {json[a].season}</div>
                      <div className="name">Role {json[a].role}</div>
                      <div className="name">Lane {json[a].lane}</div>
                    </div>
                  </div>
                );
               console.log(date);*/

            }
        }
        return(
        <div className="match-calendar">
        <div className="title">Palyer info</div>
        {matches}
       
      </div>
        );
    }
}