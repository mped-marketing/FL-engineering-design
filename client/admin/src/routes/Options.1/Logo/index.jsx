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
  Upload,
  Modal,
  Icon,
  Input,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    logo: '',
    copyrighrs: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
    inputVisible: false,
    fileName: '',
    pic: 'noPic.jpg',
    removedFile: [],
    disable: false,

  };


componentDidMount = async () => {
  const res = await axios.get('/api/v2/getoptions');
  const { data } = res;
  const {
    logo: pic, copyrights, email, address,
  } = data[0];
  const fileList = [];
  await axios.get(`/api/v2/getFile/${pic}`).then(() => {
    fileList.push({
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: `/api/v2/getFile/${pic}`,
    });
  }).catch((error) => {
  });
  this.setState({
    pic, copyrights, fileList, email, address,
  });
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { fileList, fileName } = this.state;
      this.setState({ disable: true });

      if (!err) {
        if (fileName !== '') {
          values.logo = fileName;
        }
        if (fileList.length) {
          axios.post('/api/v2/option', values).then((result) => {
            const {
              data: { message },
              statusText,
            } = result;
            if (result.status === 200) {
              NotificationManager.success(message, 'SUCCESS', 2000);
              setTimeout(() => {
                this.props.history.push('/admin/options/main');
                this.setState({ disable: false });
              }, 3000);
            } else {
              NotificationManager.error(message || statusText, 'ERROR', 2000);
              setTimeout(() => {
                this.setState({ disable: false });
              }, 2000);
            }
          }).catch((error) => {
            const { response: { data: { message } } } = error;
            NotificationManager.error(message, 'ERROR', 2000);
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
      fileList, previewVisible, pic, email, address, copyrights, disable,
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
      <Card className="gx-card" title="Main">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Logo">
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
          <FormItem {...formItemLayout} label={<span>address</span>}>
            {getFieldDecorator('address', { initialValue: address })(<Input />)}
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
          <FormItem {...formItemLayout} label={<span>Copyrights</span>}>
            {getFieldDecorator('copyrights', {
              initialValue: copyrights,
              rules: [{ max: 70, message: 'Only 70 Letter is allowed !' }],
            })(<Input />)}
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
