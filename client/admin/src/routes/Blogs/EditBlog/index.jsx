/* eslint-disable camelcase */
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
  Checkbox,
  Tag,
} from 'antd';
import { connect } from 'react-redux';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import { convertToRaw, EditorState } from 'draft-js';
import uuid from 'uuid';
import { Editor } from '@tinymce/tinymce-react';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    editorState: EditorState.createEmpty(),
    fileList: [],
    previewVisible: false,
    previewImage: '',
    values: '',
    categories: [],
    removedFile: [],
    checked: true,
    content: '',
    headingLength: '',
    tags: [],
    inputVisible: false,
    inputValue: '',
    breakingNews: true,
    disable:false
  };

  componentDidMount = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    axios(`/api/v2/post/${id}`).then(async (result) => {
      const { data } = result;
      const {
        title, seo, header_media, description, post_intro,tags
      } = data[0];
      const fileList = [];
      const getPhotos = header_media.map(async (value) => {
        await axios
          .get(`/api/v2/getFile/${value}`)
          .then(result => fileList.push({
            uid: uuid(),
            name: 'image.png',
            status: 'done',
            url: `/api/v2/getFile/${value}`,
          }))
          .catch((error) => {});
      });
      await Promise.all(getPhotos).then(() => {
        this.setState({
          fileList,
          title,
          seo,
          content: description,
          post_intro,
          tags
        });
      });
    }).catch((error) => {
      const {
        data: { message: errorMessage },
        statusText: errorText,
      } = error.response;
      NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
      setTimeout(() => {
        this.props.history.push('/admin/blogs/viewblogs/all');
      }, 2000);
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    const { status } = file;
    if (status === 'done') {
      const {
        response: { fullName },
      } = file;
      this.setState({ fullName });
    }
  };

  toggleDisable = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { fileList, removedFile } = this.state;
    const files = [];
    fileList.map((file) => {
      const { url } = file;
      if (url) {
        const urlSplit = url.split('/');
        const fileName = urlSplit[urlSplit.length - 1];
        files.push(fileName);
      } else {
        const {
          response: { fullName },
        } = file;

        files.push(fullName);
        return files;
      }
    });
    if (files.length !== 0) {
      const { content ,tags} = this.state;
      if (content.trim()) {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({ disable: true });
            const {
              match: {
                params: { id },
              },
            } = this.props;
            values.header_media = files;
            values.description = content;
            values.tags = tags;

            axios
              .post(`/api/v2/post/update/${id}`, {
                data: values,
              })
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
                      this.props.history.push('/admin/blogs/viewblogs/all');
                      this.setState({ disable: false });
                    }, 3000);
                  });
                  if (removedFile.length) {
                    removedFile.map(async (file) => {
                      await axios.post('/api/v2/removeFile', { pic: file });
                    });
                  }
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

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

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

  onChangeBreaking = () => {
    this.setState({ breakingNews: !this.state.breakingNews });
  };

  onChangeCheck = () => {
    this.setState({ checked: !this.state.checked });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    this.setState(() => ({ content }));
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  editorChange = (evt) => {
    const newContent = evt.editor.getData();
    this.setState({
      content: newContent,
    });
  };

  saveInputRef = input => (this.input = input);
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
    if (tags) {
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
    } else {
      tags = [inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      previewVisible,
      fileList,
      title,
      seo,
      content,
      disable,
      post_intro: blog_intro,
      pic,
      inputVisible,
      inputValue,
      tags,
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
      <Card className="gx-card" title="Edit Blog Details">
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
              initialValue: title,
              rules: [{

                max: 150,
                message: 'Max is 150 letter !',
                whitespace: true,

              }],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                seo
              </span>
)}
          >
            {getFieldDecorator('seo', {
              initialValue: seo,
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
            {getFieldDecorator('post_intro', {
              initialValue: blog_intro,
              rules: [
                {
                  max: 260,
                  message: 'Max Letters for Intro is 260',
                  whitespace: true,
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Header Photo">
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
                src={`/api/v2/getFile/${pic}`}
              />
            </Modal>
            </FormItem>
            <FormItem {...formItemLayout} label="Keywords Meta">
            <div>
              {tags
                ? tags.map((tag) => {
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
          {content.length ? (
            <FormItem {...formItemLayout} label={<span>Description</span>}>
              <Editor
                initialValue={content}
                init={{
                  images_upload_url: '/api/v2/uploadFile',
                  images_upload_base_path: '/api/v2/uploadFile',
                  image_caption: true,
                  images_upload_handler: (blobInfo, success, failure) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob());
                    axios
                      .post('/api/v2/uploadFile', formData)
                      .then((result) => {
                        const {
                          data: { fullName },
                        } = result;
                        success(`/api/v2/getFile/${fullName}`);
                      })
                      .catch((error) => {
                        failure('error !');
                      });
                  },
                  height: 700,
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
          ) : null}
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
