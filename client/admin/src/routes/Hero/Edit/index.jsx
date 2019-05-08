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
  Tag,
  Tooltip,
  Upload,
  Modal,
} from 'antd';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

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
    content: '',
    disable: false,
  };

  componentDidMount = async () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const result = await axios(`/api/v2/hero/get/${id}`, { params: { id } });
    const { data } = result;
    const {
      cta, description, title, image: pic, body,tags
    } = data[0];

    const fileList = [];
    if (pic !== '') {
      await axios
        .get(`/api/v2/getFile/${pic}`)
        .then(() => {
          fileList.push({
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: `/api/v2/getFile/${pic}`,
          });
        })
        .catch((error) => {});
    }
    this.setState({
      cta,
      description,
      title,
      pic,
      fileList,
      tags,
      content: body,
    });
  };

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    this.setState(() => ({ content }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { fileName, fileList, removedFile ,tags} = this.state;
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
          const { content } = this.state;
          values.body = content;
          values.tags = tags;

          axios
            .post(`/api/v2/hero/update/${id}`, values)
            .then((result) => {
              const {
                data: { message },
                statusText,
              } = result;
              if (result.status === 200) {
                this.setState({ loading: false }, () => {
                  NotificationManager.success(message, 'SUCCESS', 2000);
                  setTimeout(() => {
                    this.props.history.push('/admin/hero/view');
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
            })
            .catch((error) => {
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
      previewImage,
      cta,
      description,
      title,
      inputVisible,
      inputValue,
      tags,
      content,
      disable,
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
      <Card className="gx-card" title="Edit Hero Details">
        <Form onSubmit={this.handleSubmit}>
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
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('title', {
              initialValue: title,
              rules: [{
                max: 80,
                message: 'Max is 80 letter !',
                whitespace: true,
              }],
            })(<Input />)}
          </FormItem>

          <FormItem {...formItemLayout} label="Call To Action ">
            {getFieldDecorator('cta', {
              initialValue: cta,
              rules: [
                {
                  type: 'url',
                  message: 'The input is not valid URL!',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{
                max: 100,
                message: 'Max is 100 letter !',
                whitespace: true,
              }],
            })(<TextArea rows={4} maxLength={300} />)}
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
            <FormItem {...formItemLayout} label={<span>Body</span>}>
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

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
