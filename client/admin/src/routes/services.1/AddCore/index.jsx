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
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const FormItem = Form.Item;
const { TextArea } = Input;

class Registration extends Component {
  state = {
    content: '',
    fileList: [],
    previewVisible: false,
    previewImage: '',
    categories: [],
    fileName: '',
    removedFile: [],
    disable: false,
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        const {
          content, fileList, removedFile,
        } = this.state;
        const files = [];
        fileList.map((value) => {
          files.push(value.response.fullName);
          return files;
        });
        if (files.length !== 0) {
          values.icon = files[0];
          values.body = content;
          axios.post('/api/v2/core', values).then((result) => {
            const { data: { message } } = result;
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/core/viewcore');
              this.setState({ disable: false });
            }, 3000);
            if (removedFile.length) {
              removedFile.map(async (file) => {
                await axios.post('/api/v2/removeFile', { pic: file });
              });
            }
          }).catch(async (error) => {
            const { data: { message }, statusText } = error.response;
            NotificationManager.error(message || statusText, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          });
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

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    this.setState(() => ({ content }));
  }

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
    this.setState({ fileList });
    const isSvg = file.type === 'image/svg+xml';
    const isPNG = file.type === 'image/png';
    if (!isSvg && !isPNG) {
      NotificationManager.error(
        'You can only upload svg files!',
        'ERROR',
        2000,
      );
      this.setState({ fileList: [] });
    } else {
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
    const { previewVisible, fileList, previewImage, disable } = this.state;
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
      <Card className="gx-card" title="Add Core">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Icon</span>}>
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
                }, {
                  max: 30,
                  message: 'Max is 30 letter',

                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('desc', {
              rules: [
                {
                  required: true,
                  message: 'Please input the description!',
                  whitespace: true,
                },
                {
                  max: 150,
                  message: 'Max is 150 letter',
                },
              ],
            })(<TextArea />)}
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
