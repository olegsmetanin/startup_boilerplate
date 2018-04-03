import * as React from 'react';
import {sysConfig} from '../common/sysconfig';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';



import * as Recaptcha from 'react-recaptcha';

interface UserRegisterProps {
  onSubmit: (value) => Promise<void>;
}

interface UserRegisterState {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export class UserRegister extends React.Component<
  UserRegisterProps,
  UserRegisterState
> {
  sitekey = sysConfig.recaptchaKey;

  recaptchaInstance = null;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
    };
  }

  handleChangeUserName = e => {
    this.setState({username: e.target.value});
  };

  handleChangeEmailName = e => {
    this.setState({email: e.target.value});
  };

  handleChangeFirstName = e => {
    this.setState({firstname: e.target.value});
  };

  handleChangeLastName = e => {
    this.setState({lastname: e.target.value});
  };

  handleRecaptchaLoaded = () => {
    console.log('Recaptcha loaded');
  };

  handleRecaptchaVerify = response => {
    console.log(response);
  };

  handleRecaptchaExpired = () => {
    console.log(`Recaptcha expired`);
  };

  // handle reset
  handleRecaptchaReset = () => {
    this.recaptchaInstance.reset();
  };

  handleOnSubmit = () => {
    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <div className={'qwe'}>
        <div>
        </div>
        <div className={'qwe'}>
          <div>
            User name:
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleChangeUserName}
            />
          </div>
          <div>
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleChangeEmailName}
            />
          </div>
          <div>
            <input
              type="text"
              value={this.state.firstname}
              onChange={this.handleChangeFirstName}
            />
          </div>
          <div>
            <input
              type="text"
              value={this.state.lastname}
              onChange={this.handleChangeLastName}
            />
          </div>
          <div>
            <Recaptcha
              ref={e => (this.recaptchaInstance = e)}
              sitekey={this.sitekey}
              size="compact"
              render="explicit"
              verifyCallback={this.handleRecaptchaVerify}
              onloadCallback={this.handleRecaptchaLoaded}
              expiredCallback={this.handleRecaptchaExpired}
            />
            <button onClick={this.handleRecaptchaReset}>Reset</button>
          </div>
          <div>
            <button onClick={this.handleOnSubmit}>Send</button>
          </div>
        </div>
        <div>
        </div>
      </div>
    );
  }
}

