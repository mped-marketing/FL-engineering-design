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
  Button, Card, Form, Input, Icon, Upload, Modal,
} from 'antd';
import uuid from 'uuid';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

const { TextArea } = Input;
const FormItem = Form.Item;

class Registration extends Component {
  state = {
    footer_title: '',
    mobile: '',
    email: '',
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { fileList, fileName } = this.state;
      if (!err) {
        this.setState({ disable: true });
        const {
          match: {
            params: { id },
          },
        } = this.props;
        if (fileName !== '') {
          values.image = fileName;
        }
        if (fileList.length) {
          axios
            .post(`/api/v2/team/update/${id}`, values)
            .then((result) => {
              const {
                data: { message },
                statusText,
              } = result;
              if (result.status === 200) {
                NotificationManager.success(message, 'SUCCESS', 2000);
                setTimeout(() => {
                  this.props.history.push('/admin/teams/view');
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
              this.setState({ loading: false }, () => {
                const {
                  data: { message: errorMessage },
                  statusText: statusMessage,
                } = error.response;
                NotificationManager.error(errorMessage || statusMessage, 'ERROR', 2000);
                setTimeout(() => {
                  this.setState({ disable: false });
                }, 2000);
              });
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
      const {
        response: { fullName },
      } = file;

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

  componentDidMount = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    axios(`/api/v2/team/get/${id}`).then(async (result) => {
      const { data } = result;
      const {
        name,
        image,
        title,
        instagram,
        facebook,
        twitter,
        youtube,
      } = data[0];
      const fileList = [];
      await axios
        .get(`/api/v2/getFile/${image}`)
        .then(result => fileList.push({
          uid: uuid(),
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFile/${image}`,
        }))
        .catch((error) => {});
      this.setState({
        name,
        fileList,
        title,
        instagram,
        facebook,
        twitter,
        youtube,
      });
    }).catch((error) => {
      const {
        data: { message: errorMessage },
        statusText: errorText,
      } = error.response;
      NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
      setTimeout(() => {
        this.props.history.push('/admin/teams/view');
      }, 2000);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      fileList,
      previewVisible,
      pic,
      name,
      title,
      instagram,
      facebook,
      twitter,
      youtube,
      disable
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
      <Card className="gx-card" title="Teams Details">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="image">
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
          <FormItem {...formItemLayout} label={<span>name</span>}>
            {getFieldDecorator('name', {
              initialValue: name,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>title</span>}>
            {getFieldDecorator('title', {
              initialValue: title,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>facebook</span>}>
            {getFieldDecorator('facebook', {
              initialValue: facebook,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>twitter</span>}>
            {getFieldDecorator('twitter', {
              initialValue: twitter,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>youtube</span>}>
            {getFieldDecorator('youtube', {
              initialValue: youtube,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>instagram</span>}>
            {getFieldDecorator('instagram', {
              initialValue: instagram,
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
