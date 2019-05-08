import React from 'react';
import {
  Button, Checkbox, Form, Icon, Input, message, notification,
} from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Jwt from 'jwt-decode';
import './style.css';

import {
  hideMessage,
  showAuthLoader,
  userSignIn,
  setUserRole,
} from 'appRedux/actions/Auth';
import axios from 'axios';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from 'components/CircularProgress/index';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import bg from './images/graphic3.svg';
import { getNotifications } from '../appRedux/actions/Notifications';

const FormItem = Form.Item;


class Login extends React.Component {
state ={
}

componentDidUpdate() {
  if (this.props.showMessage) {
    setTimeout(() => {
      this.props.hideMessage();
    }, 100);
  }

  if (this.props.authUser && this.props.role) {
    this.props.history.push('/admin');
  }
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.showAuthLoader();
        this.props.userSignIn(values);
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { showMessage, loader, alertMessage } = this.props;
    return (
      <div className="form-body without-side">
        <div className="row">
          <div className="img-holder">
            <div className="bg" />
            <div className="info-holder">
              <img src={bg} alt="qweq" />
            </div>
          </div>
          <div className="form-holder">
            <div className="form-content">
              <div className="form-items">
                <h3>Login to account</h3>
                <p>Access to the most powerfull tool in the entire design and web industry.</p>
                <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">
                  <FormItem>
                    {getFieldDecorator('email', {
                      rules: [{
                        required: true, type: 'email', message: 'The input is not valid E-mail!',
                      }],
                    })(
                      <div><Input placeholder="Email" /></div>,
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Input type="password" placeholder="Password" />,
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" className="gx-mb-0" htmlType="submit">
                      <IntlMessages id="app.userAuth.signIn" />
                    </Button>
                    <Link to="/admin/resetpassword">Forget password?</Link>
                  </FormItem>
                </Form>
              </div>
              {showMessage
                ? NotificationManager.error(alertMessage, 'ERROR', 2000) : null}
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

const loginWithForm = Form.create()(Login);
const mapStateToProps = ({ auth }) => {
  const {
    loader, alertMessage, showMessage, authUser, role,
  } = auth;
  return {
    loader, alertMessage, showMessage, authUser, role,
  };
};

export default connect(mapStateToProps, {
  userSignIn,
  hideMessage,
  showAuthLoader,
  getNotifications,
})(loginWithForm);
