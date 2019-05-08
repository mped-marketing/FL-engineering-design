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
  Button, Card, Form, Input, Upload, Modal, Icon,
} from 'antd';
import uuid from 'uuid';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    testimonialstitle: '',
    testimonialssub: '',
    testimonialscall: '',
    background: '',
    content: '',
    fileList: [],
    fileName: '',
    removedFile: [],
    disable: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        const {
          removedFile, fileList, fileName,
        } = this.state;
        if (fileName !== '') {
          values.background = fileName;
        }
        if (fileList.length) {
          axios
            .post('/api/v2/titles/update', values)
            .then((result) => {
              const {
                data: { message },
                statusText,
                status,
              } = result;
              if (status === 200) {
                this.setState({ loading: false }, () => {
                  NotificationManager.success(message, 'SUCCESS', 2000);
                  setTimeout(() => {
                    this.props.history.push('/admin/testimonials/settings');
                    this.setState({ disable: false });
                  }, 3000);
                  if (removedFile.length) {
                    removedFile.map(async (file) => {
                      await axios.post('/api/v2/removeFile', { pic: file });
                    });
                  }
                });
              } else {
                this.setState({ loading: false }, () => {
                  NotificationManager.error(
                    message || statusText,
                    'ERROR',
                    2000,
                  );
                  setTimeout(() => {
                    this.setState({ disable: false });
                  }, 2000);
                });
              }
            })
            .catch((error) => {
              this.setState({ loading: false }, () => {
                const {
                  data: { message },
                  statusText,
                } = error.response;
                NotificationManager.error(message || statusText, 'ERRRO', 2000);
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

  componentDidMount = async () => {
    const result = await axios.get('/api/v2/getTitle');
    const { data } = result;
    const {
      testimonialstitle,
      testimonialssub,
      testimonialscall,
      background,
    } = data[0];
    const fileList = [];
    if (background !== '') {
      await axios
        .get(`/api/v2/getFile/${background}`)
        .then(result => fileList.push({
          uid: uuid(),
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFile/${background}`,
        }))
        .catch((error) => {});
    }
    this.setState(() => ({
      testimonialstitle,
      background,
      testimonialssub,
      testimonialscall,
      fileList,
    }));
  };

  handleCancel = () => this.setState({ previewVisible: false });

  showPickedIcon = (background) => {
    const { name } = background;
    this.setState({ background: name });
  };

  handleChange = ({ file, fileList }) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    this.setState({ fileList });
    const { status } = file;
    if (fileList.length) {
      if (!isJPG && !isPNG) {
        NotificationManager.error(
          'You can only upload image files!',
          'ERROR',
          2000,
        );
        this.setState({ fileList: [] });
      } else if (!isLt2M) {
        NotificationManager.error('Image must smaller than 2MB!', 'ERROR', 2000);
        this.setState({ fileList: [] });
      } else
      if (status === 'done') {
        const {
          response: { fullName },
        } = file;
        this.setState({ fileName: fullName });
      }
    }
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

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      testimonialstitle,
      testimonialssub,
      testimonialscall,
      fileList,
      background,
      previewVisible,
      disable,
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
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
      <Card className="gx-card" title="Settings">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('testimonialstitle', {
              initialValue: testimonialstitle,
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
          <FormItem {...formItemLayout} label={<span>Subtitle</span>}>
            {getFieldDecorator('testimonialssub', {
              initialValue: testimonialssub,
              rules: [
                {
                  required: true,
                  message: 'Please input the subtitle!',
                  whitespace: true,
                },
              ],
            })(<TextArea />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<span> Background Testimonial</span>}
          >
            <>
              <Upload
                action="/api/v2/uploadFile"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
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
                  src={`/api/v2/getFile/${background}`}
                />
              </Modal>
            </>
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
