import * as React from 'react';
import {
  Link,
} from 'react-router-dom'
import * as Recaptcha from 'react-recaptcha';

import { sysConfig } from '../common/sysconfig'
import styled from 'styled-components'

// console.log('!!! Styles:', Styles.qwe)

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

export class BaseHome extends React.Component<{ className?: string;}, {}> {

  render() {
    return (
      <div className={this.props.className}>
        <div>
          <Title>Title</Title>
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
