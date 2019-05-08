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
  Form, Upload, Modal, Icon, Input,
} from 'antd';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import TextArea from 'antd/lib/input/TextArea';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { connect } from 'react-redux/es';
import { setForm } from '../../../appRedux/actions/form';

const FormItem = Form.Item;

class Registration extends Component {
  state = {
    logo: '',
    copyrighrs: '',
    previewVisible: false,
    previewVisiblecoloured: false,
    previewVisiblewhite: false,
    previewVisiblefaviconList: false,
    previewImage: '',
    previewImageWhite: '',
    previewImageFav: '',
    fileList: [],
    inputVisible: false,
    fileName: '',
    pic: 'noPic.jpg',
    removedFile: [],
    disable: false,
    mobile: '',
    colouredName: '',
    coloured: [],
    whiteName: '',
    white: [],
    faviconListName: '',
    faviconList: [],
    color: '',
  };

  componentDidMount = async () => {
    const { options } = this.props;
    const { logo: pic, footer_logo, favicon } = options[0];
    const coloured = [];
    const white = [];
    const faviconList = [];
    await axios
      .get(`/api/v2/getFile/${pic}`)
      .then(() => {
        coloured.push({
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFile/${pic}`,
        });
      })
      .catch((error) => {});
    await axios
      .get(`/api/v2/getFile/${footer_logo}`)
      .then(() => {
        white.push({
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFile/${footer_logo}`,
        });
      })
      .catch((error) => {});
    await axios
      .get(`/api/v2/getFav/${favicon}`)
      .then(() => {
        faviconList.push({
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `/api/v2/getFav/${favicon}`,
        });
      })
      .catch((error) => {});
    const res = await axios.get('/api/v2/getoptions');
    const { data } = res;
    const {
      ctatitle,
      ctasub,
      color,
    } = data[0];
    this.setState({
      pic,
      footer_logo,
      favicon,
      coloured,
      ctatitle,
      ctasub,
      white,
      faviconList,
      color,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {
        coloured, colouredName, whiteName, faviconListName, color,
      } = this.state;
      this.setState({ disable: true });
      if (!err) {
        if (colouredName !== '') {
          values.logo = colouredName;
        }
        if (whiteName !== '') {
          values.footer_logo = whiteName;
        }
        if (faviconListName !== '') {
          values.favicon = faviconListName;
        }
        if (color) {
          values.color = color;
        }
        if (coloured.length) {
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
                  this.props.history.push('/admin/options/main');
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
        } else {
          NotificationManager.error('Please Choose an image !', 'ERROR', 2000);
          setTimeout(() => {
            this.setState({ disable: false });
          }, 2000);
        }
      }
    });
  };

  handleCancel = () => this.setState({ previewVisiblecoloured: false, previewVisiblewhite: false, previewVisiblefaviconList: false });

  handlePreview = (file, type) => {
    switch (type) {
      case 'coloured':
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisiblecoloured: true,
        });
        break;
      case 'white':
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisiblewhite: true,
        });
        break;
      case 'faviconList':
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisiblefaviconList: true,
        });
        break;
      default:
        return null;
    }
  };

  removeFile = async (file) => {
    const { removedFile } = this.state;
    const { url } = file;
    if (url) {
      const urlSplit = url.split('/');
      const fileName = urlSplit[urlSplit.length - 1];
      removedFile.push(fileName);
      // removedFile.map(async (removed) => {
      await axios.post('/api/v2/removeFile', { pic: removedFile[0] });
      // });
    } else {
      const {
        response: { fullName },
      } = file;
      removedFile.push(fullName);
    }
    this.setState({ removedFile });
  };

  handleChange = ({ file, fileList }, type) => {
    const values = {};
    const isJPG = file.type === 'image/svg';
    const isPNG = file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    this.setState(() => ({ [type]: fileList }));
    if (fileList.length) {
      if (!isJPG && !isPNG) {
        NotificationManager.error(
          'You can only upload image files!',
          'ERROR',
          2000,
        );
        this.setState(() => ({ [type]: [] }));
      } else if (!isLt2M) {
        NotificationManager.error(
          'Image must smaller than 2MB!',
          'ERROR',
          2000,
        );
      } else {
        this.setState(() => ({ [type]: fileList }));
        const { status } = file;
        if (status === 'done') {
          if (type === 'faviconList') {
            const { response } = file;
            values.favicon = response;
            this.props.setForm(values);
            const name = `${[type]}Name`;
            this.setState(() => ({ [name]: response }));
          } else {
            const {
              response: { fullName },
            } = file;
            if (type === 'coloured') {
              values.logo = fullName;
              this.props.setForm(values);
            }
            if (type === 'white') {
              values.footer_logo = fullName;
              this.props.setForm(values);
            }
            const name = `${[type]}Name`;
            this.setState(() => ({ [name]: fullName }));
          }
        }
      }
    }
  };

  changeColour = ({ color }) => {
    this.setState({ color });
    const values = {};
    values.color = color;
    this.props.setForm(values);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      white,
      previewVisible,
      previewVisiblecoloured,
      pic,
      coloured,
      faviconList,
      faviconListName,
      color,
      previewVisiblewhite,
      footer_logo,
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
    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Select Color">
            {getFieldDecorator('colour', {})(
              <ColorPicker color={color} onChange={this.changeColour}>
                <Input
                  className="colour-picker"
                  style={{
                    cursor: 'pointer !important',
                    backgroundColor: color,
                    width: '50px',
                  }}
                  />
              </ColorPicker>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Main Logo">
            <Upload
              action="/api/v2/uploadFile"
              listType="picture-card"
              fileList={coloured}
              onPreview={file => this.handlePreview(file, 'coloured')}
              onChange={file => this.handleChange(file, 'coloured')}
              withCredentials
              onRemove={this.removeFile}
              accept=".png,.svg"
            >
              {coloured.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisiblecoloured}
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

          <FormItem {...formItemLayout} label="Footer Logo">
            <Upload
              action="/api/v2/uploadFile"
              listType="picture-card"
              fileList={white}
              onPreview={file => this.handlePreview(file, 'white')}
              onChange={file => this.handleChange(file, 'white')}
              withCredentials
              onRemove={this.removeFile}
              accept=".png,.svg"
            >
              {white.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisiblewhite}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img
                alt="example"
                style={{ width: '100%' }}
                src={`/api/v2/getFile/${footer_logo}`}
              />
            </Modal>
          </FormItem>

          <FormItem {...formItemLayout} label="Fav ico" style={{ float: 'unset' }}>
            <Upload
              action="/api/v2/uploadFav"
              listType="picture-card"
              fileList={faviconList}
              onPreview={file => this.handlePreview(file, 'faviconList')}
              onChange={file => this.handleChange(file, 'faviconList')}
              withCredentials
              onRemove={this.removeFile}
              accept=".png,.svg"
              >
              {faviconList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
              accept=".png,.svg"
              >
              <img
                alt="example"
                style={{ width: '100%' }}
                src={`/api/v2/getFav/${faviconListName}`}
                />
            </Modal>
          </FormItem>
        </Form>
        <NotificationContainer />
      </>
    );
  }
}

const RegistrationForm = Form.create()(Registration);
const mapStateToProps = ({ opations }) => {
  const { opations: options } = opations;
  return {
    options,
  };
};

export default connect(mapStateToProps, { setForm })(RegistrationForm);
