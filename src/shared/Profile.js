import React, { Component } from 'react'
import NewPoll from './NewPoll'
import MyPolls from './MyPolls'
import { Link } from 'react-router-dom'
import AuthService from './AuthService'




class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            newPoll: false,
            showSidebar: true,
            selectedNavTag: 'dashboard'
        }
        this.clickMyPolls = this.clickMyPolls.bind(this)
        this.clickNewPoll = this.clickNewPoll.bind(this)
        this.printOutPolls = this.printOutPolls.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
        this.isActive = this.isActive.bind(this)
        this.Auth = new AuthService()
    }

    

    render(){
        const displayName = this.props.local? this.props.user.payload.username
                        : this.props.user.name
        const hideSidebar = this.state.showSidebar ? '' : 'hide-sidebar'
        const picture = this.props.user.picture || 'https://cdn2.iconfinder.com/data/icons/business-charts/512/account-512.png'
        
        return(
              
                <div className={`profile ${hideSidebar}`}>
                    
                    
                        <div className='d-flex flex-row justify-content-between sidebar-header'>
                            <h3 className='brand'>VotePlex</h3>
                            <div className='btn-sidebar' onClick={this.toggleMenu}>
                                <a></a>
                                <a></a>
                                <a></a>
                            </div>
                        </div>
                        <div className='sidebar-wrapper'> 
                        <div className='d-flex flex-row  userInfo'>
                            <img src={picture} height='30' width='30' style={{borderRadius: 50 + '%'}}/>
                            <p>{displayName}</p>
                        </div>
                        <ul className='side-nav'>
                            <li className={this.isActive('dashboard')? 'active' : ''}>
                                <a data-selectednavtag = 'dashboard'onClick={this.clickMyPolls}><i className='fa fa-dashboard'></i>Dashbord</a></li>
                            <li className={this.isActive('creat')? 'active' : ''}>
                                <a data-selectednavtag = 'creat'onClick={this.clickNewPoll}><i className='fa fa-plus'></i> Create</a></li>
                            <li><a href='/setting'><i className='fa fa-cog'></i> Setting</a></li>
                            <li><a href='/login' onClick={this.handleLogout}><i className='fa fa-sign-out'></i> Log Out</a></li>
                        </ul>    
                    </div>
                    <div className='page-content'>
                        {this.printOutPolls()}
                    </div>        
                </div>    
            )
        }

       
        handleLogout(){
            this.Auth.logout()
        }  
        

        printOutPolls () {
            const userId = this.props.local? this.props.user.payload._id
                                : this.props.user._id
            const displayName = this.props.local? this.props.user.payload.username
            : this.props.user.name
            if(this.state.newPoll){
                
                return(
                    <NewPoll userId={userId} username={displayName} newPoll={this.state.newPoll} local={this.props.local}/>
                )
            }else{
                return(
                    <MyPolls userId={userId} myPoll={!this.state.newPoll} local={this.props.local}/>
                )
            }
        }

        isActive(navTab){
            return navTab === this.state.selectedNavTag
        }

        clickMyPolls(e){
            e.preventDefault()
            const selectedNavTag = e.currentTarget.dataset.selectednavtag
            this.setState({
                newPoll: false,
                selectedNavTag
            })
        }

        clickNewPoll(e){
            e.preventDefault()
            const selectedNavTag = e.currentTarget.dataset.selectednavtag
            this.setState({
                newPoll: true,
                selectedNavTag
            })
        }

        toggleMenu(){
            this.setState({
                showSidebar: !this.state.showSidebar
            })
        }
}


export default Profile