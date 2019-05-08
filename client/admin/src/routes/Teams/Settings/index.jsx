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
  Button,
  Card,
  Form,
  Input,
} from 'antd';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    teamtitle: '',
    teamsub: '',
    teamdesc: '',
    disable: false,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        axios
          .post('/api/v2/titles/update', values)
          .then((result) => {
            const {
              data: { message },
            } = result;
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/teams/settings');
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

  componentDidMount = () => {
    axios.get('/api/v2/getTitle').then((result) => {
      const { data } = result;
      const { teamtitle, teamsub, teamdesc } = data[0];
      this.setState(() => ({ teamtitle, teamsub, teamdesc }));
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { teamtitle, teamsub, teamdesc,disable } = this.state;
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
      <Card className="gx-card" title="Options">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('teamtitle', {
              initialValue: teamtitle,
              rules: [
                {
                  required: true,
                  message: 'Please input the title!',
                  whitespace: true,
                }, {
                  max: 20,
                  message: 'Max is 20 letter',

                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>subtitle</span>}>
            {getFieldDecorator('teamsub', {
              initialValue: teamsub,
              rules: [
                {
                  required: true,
                  message: 'Please input the subtitle!',
                  whitespace: true,
                },
              ],
            })(<TextArea />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('teamdesc', {
              initialValue: teamdesc,
            })(<TextArea />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
          {!disable
            ? (
                <Button type="primary" htmlType="submit">
              Submit
                </Button>
            )
            : (
                <Button type="primary" disabled htmlType="submit">
         Submit
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
