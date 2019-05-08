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
  Button, Card, Form, Input,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
// import addHttp from 'http';

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    fileList: [],
    previewVisible: false,
    previewImage: '',
    categories: [],
    fileName: '',
    facebook: '',
    twitter: '',
    whats: '',
    google: '',
    logo: '',
    disable: false,
  };

  addHttp = (link) => {
    let newLink = '';
    if (!link.match(/^[a-zA-Z]+:\/\//)) {
      newLink = `https://${link}`;
      return newLink;
    }
    return link;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  componentDidMount = async () => {
    const res = await axios.get('/api/v2/getoptions');
    const { data } = res;
    const {
      facebook,
      twitter,
      whats,
      google,
      logo,
      email,
      address,
      youtube,
      instagram,
    } = data[0];
    this.setState({
      facebook: this.addHttp(facebook),
      twitter: this.addHttp(twitter),
      logo,
      whats,
      google: this.addHttp(google),
      email,
      address,
      youtube: this.addHttp(youtube),
      instagram: this.addHttp(instagram),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        axios
          .post('/api/v2/option', values)
          .then((result) => {
            const {
              data: { message },
              statusText,
            } = result;
            if (result.status === 200) {
              NotificationManager.success(message, 'SUCCESS', 2000);
              setTimeout(() => {
                this.props.history.push('/admin/options/social');
                this.setState({ disable: false });
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
              NotificationManager.error(
                errorMessage || statusMessage,
                'ERROR',
                2000,
              );
              setTimeout(() => {
                this.setState({ disable: false });
              }, 2000);
            });
          });
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
    if ((file.status = 'removed')) {
      const {
        response: { fullName: pic },
      } = file;
      await axios.post('/api/v2/removeFile', { pic }).then(() => {
        this.setState({ fileName: '' });
      });
    }
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
    const {
      facebook,
      twitter,
      whats,
      google,
      youtube,
      instagram,
      disable,
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
      <Card className="gx-card" title="Social Media">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Facebook</span>}>
            {getFieldDecorator('facebook', { initialValue: facebook })(
              <Input />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Twitter</span>}>
            {getFieldDecorator('twitter', { initialValue: twitter })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Whatsapp</span>}>
            {getFieldDecorator('whats', {
              initialValue: whats,
              rules: [
                {
                  max: 20,
                  message: 'The input is not valid Mobile',
                },
              ],
            })(<Input type="text" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Youtube </span>}>
            {getFieldDecorator('youtube', {
              initialValue: youtube,
            })(<Input type="text" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Instagram </span>}>
            {getFieldDecorator('instagram', {
              initialValue: instagram,
            })(<Input type="text" />)}
          </FormItem>
          {/* <FormItem {...formItemLayout} label={<span>Google</span>}>
            {getFieldDecorator('google', { initialValue: google })(<Input />)}
          </FormItem> */}
          <FormItem {...tailFormItemLayout}>
            {!disable ? (
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            ) : (
              <Button type="primary" disabled htmlType="submit">
                Save
              </Button>
            )}
          </FormItem>
        </Form>
        <NotificationContainer />
      </Card>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
export default RegistrationForm;
