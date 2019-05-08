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
  Form, Input,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { connect } from 'react-redux/es';
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
        {
  options.length ? (
    <Form onSubmit={this.handleSubmit} onChange={this.onChange}>

      <FormItem {...formItemLayout} label={<span>address</span>}>
        {getFieldDecorator('address', { initialValue: options[0].address })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Mobile">
        {getFieldDecorator('mobile', {
          initialValue: options[0].mobile,
        })(<Input type="number" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Phone">
        {getFieldDecorator('phone', {
          initialValue: options[0].phone,
        })(<Input type="number" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Tel">
        {getFieldDecorator('tel', {
          initialValue: options[0].tel,
        })(<Input type="number" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Fax">
        {getFieldDecorator('fax', {
          initialValue: options[0].fax,
        })(<Input type="number" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="E-mail">
        {getFieldDecorator('email', {
          initialValue: options[0].email,
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>Latitude</span>}>
        {getFieldDecorator('latitude', {
          initialValue: options[0].latitude,
        })(<Input type="number" />)}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>Longitude</span>} style={{ float: 'unset' }}>
        {getFieldDecorator('longitude', {
          initialValue: options[0].longitude,
        })(<Input type="number" />)}
      </FormItem>
    </Form>
  ) : null}

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
