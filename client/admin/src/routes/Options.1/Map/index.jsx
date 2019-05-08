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
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

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
    disable: false,
  };

  handleCancel = () => this.setState({ previewVisible: false });

componentDidMount = async () => {
  const res = await axios.get('/api/v2/getoptions');
  const { data } = res;
  console.log(data);
  const {
    latitude, longitude,
  } = data[0];
  this.setState({
    latitude, longitude,
  });
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disable: true });
        axios.post('/api/v2/option', values).then((result) => {
          const {
            data: { message },
            statusText,
          } = result;
          if (result.status === 200) {
            NotificationManager.success(message, 'SUCCESS', 2000);
            setTimeout(() => {
              this.props.history.push('/admin/options/map');
              this.setState({ disable: false });
            }, 3000);
          } else {
            NotificationManager.error(message || statusText, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          }
        }).catch((error) => {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      latitude, longitude, disable,
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
      <Card className="gx-card" title="Map Statistics">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<span>Latitude</span>}>
            {getFieldDecorator('latitude', {
              initialValue: latitude,
            })(<Input type="number" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<span>Longitude</span>}>
            {getFieldDecorator('longitude', {
              initialValue: longitude,
            })(<Input type="number" />)}
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
