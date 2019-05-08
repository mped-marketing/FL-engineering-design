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
    title: '',
    desc: '',
    icon: '',
    content: '',
    fileList: [],
    removedFile: [],
    fileName: '',
  };


componentDidMount = async () => {
  const {
    match: {
      params: { id },
    },
  } = this.props;

  const result = await axios(`/api/v2/about/item/${id}`);
  const { data } = result;
  const {
    title, image,
  } = data;
  const fileList = [];
  if (image !== '') {
    await axios
      .get(`/api/v2/getFile/${image}`)
      .then(result => fileList.push({
        uid: uuid(),
        name: 'image.png',
        status: 'done',
        url: `/api/v2/getFile/${image}`,
      }))
      .catch((error) => {});
  }
  this.setState({
    title, image, fileList,
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
          match: {
            params: { id },
          },
        } = this.props;
        const {
          icon, content, removedFile, fileList, fileName,
        } = this.state;
        if (fileName !== '') {
          values.image = fileName;
        }
        values.body = content;
        if (fileList.length) {
          axios.post(`/api/v2/about/item/${id}`, {
            data: values,

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
                  this.props.history.push('/admin/about/items');
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
              });
            }
          }).catch((error) => {
            this.setState({ loading: false }, () => {
              const {
                data: { message },
                statusText,
              } = error.response;
              NotificationManager.error(message || statusText, 'ERRRO', 2000);
            });
          });
        } else {
          NotificationManager.error('Please Choose an image !', 'ERROR', 2000);
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
    if (fileList.length) {
      const { status } = file;
      const isSvg = file.type === 'image/svg+xml';
      const isPNG = file.type === 'image/png';
      if (!isSvg && !isPNG) {
        this.setState({ fileList });
        NotificationManager.error(
          'You can only upload svg files!',
          'ERROR',
          2000,
        );
        this.setState(() => ({ fileList: [] }));
      } else if (status === 'done') {
        const {
          response: { fullName },
        } = file;
        this.setState({ fileName: fullName });
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      title, desc, icon, content, fileList, previewVisible,
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
      <Card className="gx-card" title="Edit Items">
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
                accept="image/png, image/svg+xml"
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
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </FormItem>
        </Form>
        <NotificationContainer />
      </Card>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
