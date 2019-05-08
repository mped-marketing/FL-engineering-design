/* eslint-disable camelcase */
/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable no-constant-condition */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable linebreak-style */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  Button, Form, Input,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { connect } from 'react-redux/es';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { setForm } from '../../../appRedux/actions/form';

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    disable: false,
  };

 onChange =() => {
   this.props.form.validateFieldsAndScroll((err, values) => {
     this.props.setForm(values);
   });
 }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.setState({ disable: true });
      if (!err) {
        axios
          .post('/api/v2/option', values)
          .then((result) => {
            const {
              data: { message },
              statusText,
            } = result;
            if (result.status === 200) {
              NotificationManager.success(message, 'SUCCESS', 2000);
              setTimeout(() => {
                this.setState({ disable: false });
              }, 3000);
            } else {
              NotificationManager.error(message || statusText, 'ERROR', 2000);
              setTimeout(() => {
                this.setState({ disable: false });
              }, 2000);
            }
          })
          .catch((error) => {
            const {
              response: {
                data: { message },
              },
            } = error;
            NotificationManager.error(message, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          });
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { options } = this.props;

    const { disable } = this.state;
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
      <>
        {options.length ? (
          <Form onSubmit={this.handleSubmit} onChange={this.onChange}>
            <FormItem {...formItemLayout} label="Description">
              {getFieldDecorator('footer_description', {
                initialValue: options[0].footer_description,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Address">
              {getFieldDecorator('footer_address', { initialValue: options[0].footer_address })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="E-mail">
              {getFieldDecorator('footer_email', {
                initialValue: options[0].footer_email,
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Mobile">
              {getFieldDecorator('footer_mobile', {
                initialValue: options[0].footer_mobile,
              })(<Input type="number" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Phone" style={{ float: 'unset' }}>
              {getFieldDecorator('footer_phone', {
                initialValue: options[0].footer_phone,
              })(<Input type="number" />)}
            </FormItem>
          </Form>
        ) : (null)
}
        <NotificationContainer />
      </>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
const mapStateToProps = ({ opations }) => {
  const { opations: options } = opations;
  return {
    options,
  };
};

export default connect(mapStateToProps, { setForm })(RegistrationForm);
