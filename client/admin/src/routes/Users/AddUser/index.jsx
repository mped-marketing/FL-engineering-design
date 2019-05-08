/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable linebreak-style */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import axios from 'axios';
import {
  Button, Card, Form, Icon, Input, Select, Tooltip, Spin, Upload, Modal,
} from 'antd';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';


const FormItem = Form.Item;
const { Option } = Select;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    loading: false,
    fileList: [],
    removedFile: [],
    fileName: '',
    previewImage: '',
    previewVisible: false,
    disable: false,
  };

  toggleLoading = () => {
    this.setState(() => ({ loading: !this.state.loading }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fileList, removedFile, fileName } = this.state;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        this.setState({ disable: true });
        if (fileList.length) {
          await this.toggleLoading();
          values.pic = fileName;
          axios.post('/api/v2/users/create', values).then(async (result) => {
            await this.toggleLoading();
            const { data: { message } } = result;
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/users/view');
              this.setState({ disable: false });
            }, 3000);
            if (removedFile.length) {
              removedFile.map(async (file) => {
                await axios.post('/api/v2/removeFile', { pic: file });
              });
            }
          }).catch(async (error) => {
            await this.toggleLoading();
            const { data: { message }, statusText } = error.response;
            NotificationManager.error(message || statusText, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          });
        } else {
          NotificationManager.error('Please Choose an image !', 'ERROR', 2000);
          setTimeout(() => {
            this.setState({ disable: false });
          }, 2000);
        }
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

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

  removeFile = (file) => {
    const { removedFile } = this.state;
    const { response: { fullName } } = file;
    removedFile.push(fullName);
    this.setState({ removedFile });
  };

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        domain => `${value}${domain}`,
      );
    }
    this.setState({ autoCompleteResult });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG && !isPNG) {
      NotificationManager.error(
        'You can only upload image files!',
        'ERROR',
        2000,
      );
    } else if (!isLt2M) {
      NotificationManager.error('Image must smaller than 2MB!', 'ERROR', 2000);
    } else {
      this.setState({ fileList });
      const { status } = file;
      if (status === 'done') {
        const {
          response: { fullName },
        } = file;
        this.setState({ fileName: fullName });
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      previewVisible, previewImage, fileList, disable,
    } = this.state;
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Card className="gx-card" title="Add User">
        <Spin spinning={this.state.loading}>

          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                Name&nbsp;
                  <Tooltip title="What do you want others to call you?">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
)}
          >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your Name!',
                    whitespace: true,
                  },
                  {
                    max: 20,
                    message: 'the name should be less than 20 letters',
                    whitespace: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="E-mail">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ],
              })(<Input id="email1" />)}
            </FormItem>
            <FormItem {...formItemLayout} label={<span>role</span>}>
              {getFieldDecorator('rule', {
                rules: [
                  {
                    required: true,
                    message: 'Please input role type!',
                    whitespace: true,
                  },
                ],
              })(
                <Select defaultValue="admin">
                  <Option value="admin">admin</Option>
                  <Option value="Data Entry">Data Entry</Option>                  
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="user profile">
              <Upload
                action="/api/v2/uploadFile"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                withCredentials
                onRemove={this.removeFile}
              >
                {fileList.length === 1 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            </FormItem>
            <FormItem {...formItemLayout} label="Password">
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
              })(<Input type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Confirm Password">
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
              })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
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
        </Spin>
        <NotificationContainer />
      </Card>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
