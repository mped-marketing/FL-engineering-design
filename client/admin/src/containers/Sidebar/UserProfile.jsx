/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { Avatar, Popover } from 'antd';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../../appRedux/actions/Auth';

class UserProfile extends Component {
  state = {
    name: '',
    pic: '',
    id: '',
  };

  logout = () => {
    this.props.userSignOut();
  };

  componentDidMount = async () => {
    const result = await axios('/api/v2/getName');
    const { data } = result;
    const { name, pic, id } = data[0];
    this.setState(() => ({ name, pic, id }));
  };

  goPropfile = () => {
    const { id } = this.state;
    this.props.history.push('/admin/profile');
  }

  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li onClick={this.goPropfile}>Profile</li>
        <li onClick={this.logout}>log out</li>
      </ul>
    );
    const { name, pic } = this.state;
    return (
      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
        <Popover
          placement="bottomRight"
          content={userMenuOptions}
          trigger="click"
        >
          <Avatar
            src={`/api/v2/getFile/${pic}`}
            className="profile-photo gx-size-40 gx-pointer gx-mr-3"
            alt=""
          />
          <span className="gx-avatar-name">
            <span style={{ color: '#000', letterSpacing: '2px' }}>{name}</span>
            <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
          </span>
        </Popover>
      </div>
    );
  }
}

export default connect(
  null,
  { userSignOut },
)(withRouter(UserProfile));
