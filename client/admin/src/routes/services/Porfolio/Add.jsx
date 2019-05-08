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
  Input,
  Upload,
  Modal,
  Icon,
  Tag,
  Tooltip,
  DatePicker,
  Select,
} from 'antd';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { Editor } from '@tinymce/tinymce-react';

const { Option } = Select;

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    content: '',
    fileList: [],
    previewVisible: false,
    previewImage: '',
    categories: [],
    fileName: '',
    removedFile: [],
    services: [],
    disable: false,
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        const {
          content, fileList, removedFile, tags,
        } = this.state;
        const files = [];
        fileList.map((value) => {
          files.push(value.response.fullName);
          return files;
        });
        if (files.length !== 0) {
          values.image = files[0];
          values.body = content;
          values.tags = tags;

          axios
            .post('/api/v2/portfolio', values)
            .then((result) => {
              const {
                data: { message },
              } = result;
              NotificationManager.success(message, 'SUCCESS', 2000);
              setTimeout(() => {
                this.props.history.push('/admin/services/portfolio');
                this.setState({ disable: false });
              }, 3000);
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
            'Please Choose image !',
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

  componentWillMount() {
    axios.get('/api/v2/services').then((result) => {
      const { data } = result;
      this.setState(() => ({ services: data }));
    });
  }

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
      previewVisible, fileList, previewImage, services, disable, inputVisible,
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
      <Card className="gx-card" title="Portfolio">
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
              rules: [
                {
                  required: true,
                  message: 'Please input the title!',
                  whitespace: true,
                },
                {
                  max: 30,
                  message: 'Max is 30 letter',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Service</span>}>
            {getFieldDecorator('service_id', {
              rules: [
                {
                  required: true,
                  message: 'Please choose service !',
                  whitespace: true,
                },
              ],
            })(
              <Select>
                {services.length && services.map(service => (
                  <Option value={`${service.id}`}>{service.title}</Option>
                ))}

              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Date</span>}>
            {getFieldDecorator('date')(<DatePicker />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Client</span>}>
            {getFieldDecorator('client', {
              rules: [
                {
                  max: 30,
                  message: 'Max is 30 Letter !',
                  whitespace: true,
                },
              ],
            })(<Input type="text" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={<span>Location</span>}>
            {getFieldDecorator('location', {
              rules: [
                {
                  max: 40,
                  message: 'Max is 40 Letter !',
                  whitespace: true,
                },
              ],
            })(<Input type="text" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Keywords Meta tags">
            <div>
              {tags ? tags.map((tag, index) => {
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
              }) : null}
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
          <FormItem {...formItemLayout} label={<span>Body</span>}>
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

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
