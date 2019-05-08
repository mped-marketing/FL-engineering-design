/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React from 'react';
import {
  Button, Form, Input,
} from 'antd';
import { Link } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import bg from './images/graphic3.svg';

const FormItem = Form.Item;


class Reset extends React.Component {
state ={}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post('/api/v2/resetPassword', values).then((result) => {
          const { data: { message } } = result;
          NotificationManager.success(message, 'SUCCESS', 2000);
          setTimeout(() => {
            this.props.history.push('/admin/signin');
          }, 3000);
        }).catch((error) => {
          const {
            data: { message: errorMessage },
            statusText: errorText,
          } = error.response;
          NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
          setTimeout(() => {
            this.props.history.push('/admin/resetpassword');
          }, 2000);
        });
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
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
                <h3>Reset Password</h3>
                <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">
                  <FormItem>
                    {getFieldDecorator('email', {
                      rules: [{
                        required: true, type: 'email', message: 'The input is not valid E-mail!',
                      }],
                    })(
                      <Input placeholder="Email" />,
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" className="gx-mb-0" htmlType="submit">
                      Send To Email
                    </Button>
                    <Link to="/admin/signin">Sign In</Link>
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
