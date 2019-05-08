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
  Button, Card, Form, Input, Tooltip,
  Tag,
  Icon,
} from 'antd';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    serviceTitle: '', serviceSub: '', disable: false, tags_services: [],
  };

  componentWillMount() {
    axios.get('/api/v2/getTitle').then((result) => {
      const { data } = result;
      const { servicetitle, servicesub, tags_services } = data[0];
      this.setState(() => ({ serviceTitle: servicetitle, serviceSub: servicesub, tags_services }));
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          tags_services,
        } = this.state;
        this.setState({ disable: true });
        values.tags_services = tags_services;

        axios
          .post('/api/v2/titles/update', values)
          .then((result) => {
            const {
              data: { message },
            } = result;
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/services/viewServices');
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

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleClose = (removedTag) => {
    const tags_services = this.state.tags_services.filter(tag => tag !== removedTag);
    this.setState({ tags_services });
  };

  saveInputRef = input => (this.input = input);

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { tags_services } = state;
    if (tags_services) {
      if (inputValue && tags_services.indexOf(inputValue) === -1) {
        tags_services = [...tags_services, inputValue];
      }
    } else {
      tags_services = [inputValue];
    }

    this.setState({
      tags_services,
      inputVisible: false,
      inputValue: '',
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
    const {
      serviceTitle, serviceSub, disable, inputVisible,
      inputValue,
      tags_services,
    } = this.state;
    return (
      <Card className="gx-card" title="Settings">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('servicetitle', {
              initialValue: serviceTitle,
              rules: [
                {
                  required: true,
                  message: 'Please input the title!',
                  whitespace: true,
                },
                {
                  max: 20,
                  message: 'Max is 20 letter',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>subtitle</span>}>
            {getFieldDecorator('servicesub', {
              initialValue: serviceSub,

              rules: [
                {
                  required: true,
                  message: 'Please input the subtitle!',
                  whitespace: true,
                },
              ],
            })(<TextArea />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Keywords Meta">
            <div>
              {tags_services
                ? tags_services.map((tag) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag
                      key={tag}
                      closable
                      afterClose={() => this.handleClose(tag)}
                      >
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  );
                })
                : null}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 100 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  onClick={this.showInput}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <Icon type="plus" />
                 New Keywords Meta
                </Tag>
              )}
            </div>
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
