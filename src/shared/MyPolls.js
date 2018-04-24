import React, { Component } from 'react'
import GoogleChart from './GoogleChart'


class MyPolls extends Component {
    constructor(props){
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleShowPoll = this.handleShowPoll.bind(this)
        this.state = {
            myPoll : [],
            showPoll: null
        }
    }

    componentDidMount(){
        const userId = this.props.userId
        const local = this.props.local
        fetch('/api/mypoll',{
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId,
                local
            })
        }).then((res) => res.json()).then((data)=>{
            this.setState({
                myPoll: data.myPoll
            })
        })
    }

    eachPoll(){
        if(this.state.myPoll.length === 0 ){
            return(
                <h1>No polls yet! Click "+" to launch your own poll.</h1>
            )
        }else{
            return this.state.myPoll.map((poll) => {
            
                return (
                    <div className='d-flex flex-row justify-content-between each-poll'>
                        <h3 className='poll-name'>{poll.name}</h3>
                        <div className='d-flex flex-row justify-content-between btns'>
                            <button className='present' onClick={this.handleShowPoll} data-showpoll={poll.name}><i className='fa fa-caret-square-o-right'></i> Present</button>
                            <button className='delete' onClick={this.handleDelete} data-poll={poll.name}><i className='fa fa-times-circle'></i> Delete</button>
                        </div>
                    </div>    
                )
            })
        }
        
    }
   
    render() {
        if(this.state.showPoll && !this.props.myPoll){
            return(
                <GoogleChart pollName = {this.state.showPoll.name} options = {this.state.showPoll.options}/>  
            )
        }else{
            return(
                <div className='dashboard'>
                    <h1 className='title'>Dashboard</h1>
                    <div className='polls'>{this.eachPoll()}</div>
                </div>   
            )
        }
        
    }

    handleDelete(e){
        const deletedPoll = e.currentTarget.dataset.poll
        const userId = this.props.userId
        const local = this.props.local
        fetch('/api/deleteMyPoll',{
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId,
                deletedPoll,
                local
            })
        }).then((res) => res.json()).then((data) => {
            this.setState({
                myPoll: data.myPoll
            })
        })
    }

    handleShowPoll(e){
        const pollName = e.currentTarget.dataset.showpoll
        this.props.myPoll = false
        const showPoll = this.state.myPoll.find((poll) => {
            return poll.name === pollName
        })
        this.setState({
            showPoll
        })
    }
}





export default MyPolls