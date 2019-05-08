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
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';

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
import MaterialUiIconPicker from 'react-material-ui-icon-picker';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    fileList: [],
    previewVisible: false,
    previewImage: '',
    tags: [],
    inputVisible: false,
    categories: [],
    fileName: '',
    content: '',
    removedFile: [],
    heroLength: '',
    inputValue: '',
    breaking: false,
    previewIcon: '',
  };

  handleCancel = () => this.setState({ previewVisible: false });

  showPickedIcon = (icon) => {
    const { name } = icon;
    this.setState({ icon: name, previewIcon: name });
  };

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    this.setState(() => ({ content }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          fileList, removedFile, previewIcon, content,
        } = this.state;
        const files = [];
        fileList.map((value) => {
          files.push(value.response.fullName);
          return files;
        });
        if (files.length !== 0) {
          values.image = files[0];
          values.body = content;
          axios
            .post('/api/v2/features/create', values)
            .then((result) => {
              const {
                data: { message },
              } = result;
              if (values.newsLetter) {
                NotificationManager.success(
                  'Feature has been added, redirect to email list',
                  'SUCCESS',
                  2000,
                );
              } else {
                NotificationManager.success(message, 'SUCCESS', 2000);
                setTimeout(() => {
                  this.props.history.push('/admin/features/view');
                }, 3000);
              }
              if (removedFile.length) {
                removedFile.map(async (file) => {
                  await axios.post('/api/v2/removeFile', { pic: file });
                });
              }
            })
            .catch(async (error) => {
              const {
                data: { message },
                statusText,
              } = error.response;
              NotificationManager.error(message || statusText, 'ERROR', 2000);
            });
        } else {
          NotificationManager.error(
            'Please Choose image or video !',
            'ERROR',
            2000,
          );
        }
      }
    });
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  removeFile = async (file) => {
    const { removedFile } = this.state;
    const {
      response: { fullName },
    } = file;
    removedFile.push(fullName);
    this.setState({ removedFile });
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
    const { previewVisible, fileList, previewImage } = this.state;
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
      <Card className="gx-card" title="Add Feature">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Image</span>}>
            <>
              <Upload
                action="/api/v2/uploadFile"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                onRemove={this.removeFile}
              >
                {fileList.length >= 5 ? null : uploadButton}
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
            </>
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please input your title!',
                  whitespace: true,
                }, {
                  max: 20,
                  message: 'Max length is 20 letter',
                  whitespace: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Sub Title</span>}>
            {getFieldDecorator('sub_title', {
              rules: [
                {
                  required: true,
                  message: 'Please input your Sub Title!',
                  whitespace: true,
                },
                {
                  max: 80,
                  message: 'Max length is 80 letter',
                  whitespace: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Call To Action</span>}>
            {getFieldDecorator('cta', {
              rules: [
                {
                  required: true,
                  message: 'Please input',
                  whitespace: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  message: 'Please input your description!',
                  whitespace: true,
                },
                {
                  max: 250,
                  message: 'Max length is 250 letter',
                  whitespace: true,
                },
              ],
            })(<TextArea rows={4} maxLength={300} />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Body</span>}>
            {' '}
            <Editor
              init={{
                images_upload_url: '/api/v1/uploadFile',

                images_upload_base_path: '/api/v1/uploadFile',
                image_caption: true,

                images_upload_handler: (blobInfo, success, failure) => {
                  const formData = new FormData();
                  formData.append('file', blobInfo.blob());
                  axios
                    .post('/api/v1/uploadFile', formData)
                    .then((result) => {
                      const {
                        data: { fullName },
                      } = result;
                      success(`/api/v1/getFile/${fullName}`);
                    })
                    .catch((error) => {
                      failure('error !');
                    });
                },
                height: 500,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'file image media',
                images_upload_credentials: true,
                plugins:
                  'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed mentions linkchecker',
                toolbar:
                  'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment',
              }}
              onChange={this.handleEditorChange}
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Add Feature
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
