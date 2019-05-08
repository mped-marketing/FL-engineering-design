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
  Form, Input, Checkbox,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import { connect } from 'react-redux/es';
import { setForm } from '../../../appRedux/actions/form';

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    disable: false,
    copyrighrs: '',
    name: '',
    active: false,
  };

  componentDidMount() {
    const { options } = this.props;
    if (options.length) {
      this.setState({ active: options[0].active });
    }
  }


  onChangeCheck = () => {
    this.setState({ active: !this.state.active });
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.active = this.state.active;
      this.props.setForm(values);
    });
  };

  onChange =() => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.setForm(values);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.setState({ disable: true });
      if (!err) {
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
            const {
              response: {
                data: { message },
              },
            } = error;
            NotificationManager.error(message, 'ERROR', 2000);
            setTimeout(() => {
              this.setState({ disable: false });
            }, 2000);
          });
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;

    const { options } = this.props;
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
    return (
      <>
        {
  options.length ? (
    <Form onSubmit={this.handleSubmit} onChange={this.onChange}>
      <FormItem {...formItemLayout} label={<span>Website Name</span>}>
        {getFieldDecorator('name', {
          initialValue: options[0].name,
          rules: [{ max: 30, message: 'Only 30 Letter is allowed !' }],
        })(<Input />)}
      </FormItem>

      <FormItem {...formItemLayout} label={<span>Copyrights</span>}>
        {getFieldDecorator('copyrights', {
          initialValue: options[0].copyrights,
          rules: [{ max: 70, message: 'Only 70 Letter is allowed !' }],
        })(<Input />)}
      </FormItem>

      <FormItem
        style={{ float: 'unset' }}
        {...formItemLayout}
        label={<span>Active</span>}
            >
        {getFieldDecorator('active')(
          <Checkbox defaultChecked={options[0].active}
                >

                  Disable the webiste
          </Checkbox>,
        )}
      </FormItem>
    </Form>
  ) : null}

        <NotificationContainer />
      </>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
const mapStateToProps = (props) => {
  const { opations: options } = props.opations;
  return {
    options,
  };
};

export default connect(mapStateToProps, { setForm })(RegistrationForm);
