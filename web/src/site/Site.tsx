import * as React from 'react';
import { sysConfig } from '../common/sysconfig'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import { Home } from './Home'
import { UserRegister } from './UserRegister'

export class Site extends React.Component<{}, {}> {

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={UserRegister} />
      </Switch>
    )
  }

}

