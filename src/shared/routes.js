import Home from './Home'
import SignUp from './SignUp'
import LogIn from './LogIn'
import Vote from './Vote'
import Setting from './Setting'


const routes = [
    {
        path: '/',
        exact: true,
        component: Home
    },
    {
        path: '/login',
        exact: true,
        component: LogIn
    },
    {
        path: '/:username/:pollname',
        exact: true,
        component: Vote
    },
    {
        path:'/setting',
        exact: true,
        component: Setting
    }

]


export default routes