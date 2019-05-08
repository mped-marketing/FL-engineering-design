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
  Button, Card, Form, Input,
} from 'antd';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

const FormItem = Form.Item;

class Registration extends Component {
    state = {
      title: '',
      count: '',
      disable: false,
    }

    componentDidMount = () => {
      const { match: { params: { id } } } = this.props;
      axios(`/api/v2/statistics/${id}`).then((result) => {
        const { data } = result;
        this.setState({ ...data });
      });
    }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        const { match: { params: { id } } } = this.props;
        axios
          .post(`/api/v2/statistics/${id}`, values)
          .then((result) => {
            const {
              data: { message },
            } = result;
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/statistics/view');
              this.setState({ disable: false });
            }, 3000);
          })
          .catch(async (error) => {
            const {
              data: { message },
              statusText,
            } = error.response;
            NotificationManager.error(message || statusText, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { title, count,disable } = this.state;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Card className="gx-card" title="Statistic Details">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('title', {
              initialValue: title,
              rules: [
                {
                  max: 20,
                  message: 'Max is 20 letter',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Count</span>}>
            {getFieldDecorator('count', {
              initialValue: count,
              rules: [
                {
                  required: true,
                  message: 'Please input the subtitle!',
                  whitespace: true,
                },
              ],
            })(<Input  />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {!disable
            ? (
                <Button type="primary" htmlType="submit">
              Save
                </Button>
            )
            : (
                <Button type="primary" disabled htmlType="submit">
         Save
                </Button>
            ) }
          </FormItem>
        </Form>
        <NotificationContainer />
      </Card>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
