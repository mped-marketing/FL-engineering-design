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
import uuid from 'uuid';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';

import {
  Button,
  Card,
  Form,
  Select,

} from 'antd';
import axios from 'axios';

import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

const { Option } = Select;

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    fileList: [],
    previewVisible: false,
    previewImage: '',
    tags: [],
    options: [],
    inputVisible: false,
    categories: [],
    fileName: '',
    content: '',
    selected: [],
    heroLength: '',
    inputValue: '',
    breaking: false,
    previewIcon: '',
  };

  componentWillMount() {
    axios.get('/api/v2/features/getAll').then((result) => {
      const { data } = result;
      const selected = [];
      data.map((element) => {
        if (element.homepage === true) {
          selected.push(element);
        }
      });
      this.setState(() => ({ options: data, selected }));
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post('/api/v2/features/updateHomepage', values).then((result) => {
          const {
            data: { message },
          } = result;
          NotificationManager.success(
            message,
            'SUCCESS',
            2000,
          );
        }).catch(async (error) => {
          const {
            data: { message },
            statusText,
          } = error.response;
          NotificationManager.error(message || statusText, 'ERROR', 2000);
        });
      }
    });
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { options, selected } = this.state;
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
      <Card className="gx-card" title=" Feature">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>First Feature</span>}>
            {getFieldDecorator('first', { initialValue: selected.length ? selected[0] ? selected[0].id : '0' : '0' })(
              <Select
                showSearch
                placeholder="Select the First Feature to be appear in Home Page"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
                <Option key="0" value="0">Empty</Option>
                {options.length ? options.map(option => (

                  <Option key={uuid()} value={option.id}>{option.title}</Option>
                )) : null}
              </Select>,
            )
            }

          </FormItem>
          <FormItem {...formItemLayout} label={<span>Second Feature</span>}>
            {getFieldDecorator('second', { initialValue: selected.length ? selected[1] ? selected[1].id : '0' : '0' })(

              <Select
                showSearch
                placeholder="Select the Second Feature to be appear in Home Page"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
  >
                <Option key="0" value="0">Empty</Option>

                {options.length ? options.map(option => (

                  <Option key={uuid()} value={option.id}>{option.title}</Option>
                )) : null}

              </Select>,
            )
        }
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
             Update
            </Button>
          </FormItem>
        </Form>
        <NotificationContainer />
      </Card>
    );
  }
}
const mapStateToProps = ({ auth }) => {
  const { authUser, url, role } = auth;
  return {
    authUser,
    url,
    role,
  };
};

const RegistrationForm = Form.create()(Registration);
export default connect(mapStateToProps)(RegistrationForm);
