/* eslint-disable no-lone-blocks */
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
  Icon,
  Input,
  Select,
  Tooltip,
  Upload,
  Modal,
} from 'antd';
import axios from 'axios';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    name: '',
    email: '',
    rule: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    inputVisible: false,
    fileName: '',
    pic: '',
    removedFile: [],
    bio: '',
    disable: false,
  };

  componentDidMount = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const result = await axios(`/api/v2/user/${id}`, { params: { id } });
    const { data } = result;
    const {
      name, email, rule, pic, bio,
    } = data;
    const fileList = [];
    if (pic !== '') {
      await axios.get(`/api/v2/getFile/${pic}`).then(() => {
        fileList.push({
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFile/${pic}`,
        });
      }).catch((error) => {
      });
    }
    this.setState({
      name, email, rule, pic, fileList, bio,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {
        fileList, removedFile, fileName,
      } = this.state;
      if (!err) {
        const {
          match: {
            params: { id },
          },
        } = this.props;
        if (fileName !== '') {
          values.pic = fileName;
        }
        this.setState({ disable: true });
        if (fileList.length) {
          axios
            .post('/api/v2/updateuser', {
              data: values,
              params: { id },
            })
            .then((result) => {
              const {
                data: { message },
                statusText,
              } = result;
              if (result.status === 200) {
                this.setState({ loading: false }, () => {
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
                });
              } else {
                NotificationManager.error(message || statusText, 'ERROR', 2000);
                setTimeout(() => {
                  this.setState({ disable: false });
                }, 2000);
              }
            }).catch((error) => {
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

  removeFile = async (file) => {
    const { removedFile } = this.state;
    const { url } = file;
    if (url) {
      const urlSplit = url.split('/');
      const fileName = urlSplit[urlSplit.length - 1];
      removedFile.push(fileName);
    } else {
      const { response: { fullName } } = file;

      removedFile.push(fullName);
    }
    this.setState({ removedFile });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    const { status } = file;
    if (status === 'done') {
      const {
        response: { fullName },
      } = file;
      this.setState({ fileName: fullName });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      name, email, rule, previewVisible, fileList, pic, disable
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
      <Card className="gx-card" title="Edit User Details">
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
              initialValue: name || null,
              rules: [
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
              initialValue: email,
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>role</span>}>
            {getFieldDecorator('rule', {
              initialValue: rule || null,
            })(
              <Select defaultValue="admin">
                <Option value="admin">admin</Option>
                <Option value="Data Entry">Data Entry</Option> 
              </Select>,
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
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
              >
              <img
                alt="example"
                style={{ width: '100%' }}
                src={`/api/v2/getFile/${pic}`}
                />
            </Modal>
          </FormItem>
          <FormItem {...formItemLayout} label="Password">
            {getFieldDecorator('password')(<Input type="password" />)}
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
