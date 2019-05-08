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
import {
  Button,
  Card,
  Form,
  Icon,
  Input,
  Tooltip,
  Tag,
  Upload,
  Modal,
} from 'antd';
import axios from 'axios';

import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import { Editor } from '@tinymce/tinymce-react';

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
    mode: 'time',
    breaking: false,
    disable: false,

  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        const { fileList, removedFile,tags } = this.state;
        const files = [];
        fileList.map((value) => {
          files.push(value.response.fullName);
          return files;
        });
        if (files.length !== 0) {
          const { content } = this.state;
          if (content.trim()) {
            values.description = content;
            values.tags = tags;
            values.header_media = files;
            axios
              .post('/api/v2/post/create', values)
              .then((result) => {
                const {
                  data: { message },
                } = result;
                if (values.newsLetter) {
                  NotificationManager.success(
                    'Post has been added, redirect to email list',
                    'SUCCESS',
                    2000,
                  );
                  setTimeout(() => {
                    this.setState({ disable: false });
                  }, 2000);
                } else {
                  NotificationManager.success(message, 'SUCCESS', 2000);
                  setTimeout(() => {
                    this.props.history.push('/admin/blogs/viewblogs/all');
                    this.setState({ disable: false });
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
                setTimeout(() => {
                  this.setState({ disable: false });
                }, 2000);
              });
          } else {
            NotificationManager.error(
              'Please Add details for the post',
              'ERROR',
              2000,
            );
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          }
        } else {
          NotificationManager.error(
            'Please Choose image or video !',
            'ERROR',
            2000,
          );
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

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    this.setState(() => ({ content }));
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
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

  updateContent(newContent) {
    this.setState({
      content: newContent,
    });
  }

  editorChange(evt) {
    const newContent = evt.editor.getData();
    this.setState({
      content: newContent,
    });
  }

  onBlur(evt) {}

  afterPaste(evt) {}

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  saveInputRef = input => (this.input = input);

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { tags } = state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { role } = this.props;
    const {
      previewVisible,
      fileList,
      previewImage,
      disable,
      categories,
      heroLength,
      tags,
      inputVisible,
      inputValue,
      breaking,
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
    const descriptionItemLayout = {
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
      <Card className="gx-card" title="Add Blog">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                Title&nbsp;
                <Tooltip title="What is the title of the blog">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
)}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please input your title!',
                  whitespace: true,
                }, {
                  max: 150,
                  message: 'Max is 150 letter !',
                  whitespace: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                Seo
              </span>
)}
          >
            {getFieldDecorator('seo', {
              rules: [
                {
                  required: true,
                  message: 'Please input your seo!',
                  whitespace: true,
                }, {
                  max: 50,
                  message: 'Max is 50 letter !',
                  whitespace: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Blog Introduction</span>}>
            {getFieldDecorator('blog_intro', {
              rules: [
                {
                  required: true,
                  message: 'Please input your intro!',
                  whitespace: true,
                },
                {
                  max: 260,
                  message: 'Max Letters for Intro is 260',
                  whitespace: true,
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<span>Upload Header Photo</span>}
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
                  src={previewImage}
                />
              </Modal>
            </>
          </FormItem>
          <FormItem {...formItemLayout} label="Keywords Meta tags">
            <div>
              {tags&&tags.map((tag, index) => {
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
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
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
                  <Icon type="plus" />                  New Keywords Meta

                </Tag>
              )}
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<span>Description</span>}>
            {getFieldDecorator('content')(
              <Editor
                init={{
                  images_upload_url: '/api/v2/uploadFile',
                  images_upload_base_path: '/api/v2/uploadFile',
                  image_caption: true,

                  images_upload_handler: (blobInfo, success, failure) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob());
                    axios.post('/api/v2/uploadFile', formData).then((result) => {
                      const { data: { fullName } } = result;
                      success(`/api/v2/getFile/${fullName}`);
                    }).catch((error) => {
                      failure('error !');
                    });
                  },
                  height: 700,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: 'file image media',
                  images_upload_credentials: true,
                  plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed mentions linkchecker',
                  toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment',
                }}
                onChange={this.handleEditorChange}
      />,
            )}
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
