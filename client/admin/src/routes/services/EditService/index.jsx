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
  Tooltip,
  Modal,
  Tag,
  Icon,
} from 'antd';
import uuid from 'uuid';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import MaterialUiIconPicker from 'react-material-ui-icon-picker';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Editor } from '@tinymce/tinymce-react';
import ClearFix from 'material-ui/internal/ClearFix';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    title: 'ss',
    desc: 'qq',
    icon: '',
    content: '',
    fileList: [],
    removedFile: [],
    fileName: '',
    seo: '',
    disable: false,
  };


componentDidMount = async () => {
  const {
    match: {
      params: { id },
    },
  } = this.props;
  const result = await axios(`/api/v2/service/${id}`);
  const { data } = result;
  const {
    title, desc, icon, body, seo, tags,
  } = data[0];
  const fileList = [];
  if (icon !== '') {
    await axios
      .get(`/api/v2/getFile/${icon}`)
      .then(result => fileList.push({
        uid: uuid(),
        name: 'image.png',
        status: 'done',
        url: `/api/v2/getFile/${icon}`,
      }))
      .catch((error) => { this.props.history.push('/admin'); });
  }
  this.setState({
    title, desc, icon, content: body, fileList, seo, tags,
  });
}

handleEditorChange = (e) => {
  const content = e.target.getContent();
  this.setState(() => ({ content }));
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          icon, content, removedFile, fileList, fileName, tags,
        } = this.state;
        console.log(fileName);

        if (fileName !== '') {
          values.icon = fileName;
        }
        values.body = content;
        values.tags = tags;

        const {
          match: {
            params: { id },
          },
        } = this.props;
        this.setState({ disable: true });
        if (fileList.length) {
          axios.post('/api/v2/services/updateService', {
            data: values,
            params: { id },
          }).then((result) => {
            const {
              data: { message },
              statusText,
              status,
            } = result;
            if (status === 200) {
              this.setState({ loading: false }, () => {
                NotificationManager.success(message, 'SUCCESS', 2000);
                setTimeout(() => {
                  this.props.history.push('/admin/services/viewServices');
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
                NotificationManager.error(message || statusText, 'ERROR', 2000);
                setTimeout(() => {
                  this.setState({ disable: false });
                }, 2000);
              });
            }
          }).catch((error) => {
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

  showPickedIcon = (icon) => {
    const { name } = icon;
    this.setState({ icon: name });
  }

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
      title, desc, icon, content, fileList, previewVisible, seo, disable, inputVisible,
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
      <Card className="gx-card" title="Edit Services">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<span>Image</span>}
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
                  src={`/api/v2/getFile/${icon}`}
                />
              </Modal>
            </>
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Title</span>}>
            {getFieldDecorator('title', {
              initialValue: title || null,
              rules: [
                {
                  max: 30,
                  message: 'Max is 30 letter',

                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Seo</span>}>
            {getFieldDecorator('seo', {
              initialValue: seo,
              rules: [
                {
                  max: 30,
                  message: 'Max is 30 letter',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('desc', {
              initialValue: desc || null,
            })(<TextArea maxLength="300" />)}
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
          <FormItem
            {...formItemLayout}
            label={<span>Body</span>}>
            {content.length ? (
              <Editor
                initialValue={content}
                init={{
                  images_upload_url: '/api/v1/uploadFile',
                  images_upload_base_path: '/api/v1/uploadFile',
                  image_caption: true,
                  images_upload_handler: (blobInfo, success, failure) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob());
                    axios.post('/api/v1/uploadFile', formData).then((result) => {
                      const { data: { fullName } } = result;
                      success(`/api/v1/getFile/${fullName}`);
                    }).catch((error) => {
                      failure('error !');
                    });
                  },
                  height: 500,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: 'file image media',
                  images_upload_credentials: true,
                  plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed mentions linkchecker',
                  toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment',
                }}
                onChange={this.handleEditorChange}
        />
            ) : null}
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
