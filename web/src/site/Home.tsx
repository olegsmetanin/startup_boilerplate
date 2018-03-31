import * as React from 'react';
import {
  Link,
} from 'react-router-dom'
import * as Recaptcha from 'react-recaptcha';

import { sysConfig } from '../common/sysconfig'
import * as Styles from './Home.css'
import styled from 'styled-components'

console.log('!!! Styles:', Styles.qwe)


export class BaseHome extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <div>
          This Site <a href={sysConfig.restURL + "/extauth/fb/login"}>FBLogin</a>
        </div>
        <div>
          Register <Link to="/register">Register1</Link>!
			  </div>
      </div>
    )
  }

}

export const Home = styled(BaseHome)`
  color: tomato;
  border-color: tomato;
`;
