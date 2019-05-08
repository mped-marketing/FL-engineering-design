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
    footer_description: '',
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
    disable: false
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
        axios
          .post(`/api/v2/clients/update/${id}`, values)
          .then((result) => {
            const {
              data: { message },
              statusText,
            } = result;
            if (result.status === 200) {
              NotificationManager.success(message, 'SUCCESS', 2000);
              setTimeout(() => {
                this.props.history.push('/admin/testimonials/view');
                this.setState({ disable: true });
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
    axios(`/api/v2/clients/get/${id}`).then(async (result) => {
      const { data } = result;
      const {
        name,
        image,
        description,
        jobTitle,
      } = data;
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
        description,
        jobTitle,
      });
    }).catch((error) => {
      const {
        data: { message: errorMessage },
        statusText: errorText,
      } = error.response;
      NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
      setTimeout(() => {
        this.props.history.push('/admin/testimonials/view');
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
      description,
      jobTitle,
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
      <Card className="gx-card" title="Edit Testimonial Details">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>name</span>}>
            {getFieldDecorator('name', {
              initialValue: name,
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>job title</span>}>
            {getFieldDecorator('jobTitle', {
              initialValue: jobTitle,

            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Description</span>}>
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{
                max: 450,
                message: 'Max is 450 letter !',
              }],
            })(<TextArea rows={4} />)}
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
