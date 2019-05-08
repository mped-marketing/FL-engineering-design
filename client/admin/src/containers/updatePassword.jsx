/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  message,
  notification,
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
import socket from 'socket.io-client';
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

class Reset extends React.Component {
  state = {};

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { match: { params: { hash } } } = this.props;
        if (hash) {
          axios.post('/api/v2/updatePassword', {
            data: values,
            params: { hash },
          }).then((result) => {
            const { data: { message: successMessage } } = result;
            NotificationManager.success(successMessage, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/signin');
            }, 3000);
          }).catch((error) => {
            const {
              data: { message: errorMessage },
              statusText: errorText,
            } = error.response;
            NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
          });
        } else {
          this.props.history.push('/admin');
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div className="form-body without-side">
        <div className="row">
          <div className="img-holder">
            <div className="info-holder">
              <img src={bg} alt="qweq" />
            </div>
          </div>
          <div className="form-holder">
            <div className="form-content">
              <div className="form-items">
                <h3>New Password</h3>
                <Form
                  onSubmit={this.handleSubmit}
                  className="gx-signin-form gx-form-row0"
                >
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                        {
                          validator: this.validateToNextPassword,
                        },
                      ],
                    })(<Input type="password" placeholder="Password" />)}
                  </FormItem>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('confirm', {
                      rules: [
                        {
                          required: true,
                          message: 'Please confirm your password!',
                        },
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} placeholder="Confirm Password" />,
                    )}
                  </FormItem>
                  <FormItem>
                    <Button
                      type="primary"
                      className="gx-mb-0"
                      htmlType="submit"
                    >Reset
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

const RegistrationForm = Form.create()(Reset);
export default RegistrationForm;
