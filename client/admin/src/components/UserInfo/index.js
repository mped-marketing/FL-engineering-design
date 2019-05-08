/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import axios from 'axios';
import { Avatar, Popover, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { userSignOut } from '../../appRedux/actions/Auth';

class UserInfo extends Component {
  state = {
    name: '',
  };

  componentDidMount =async () => {
    const result = await axios('/api/v2/getName');
    const { data } = result;
    const { name, pic } = data[0];
    this.setState({ name, pic });
  }

  logout = () => {
    this.props.userSignOut();
  }

  goPropfile = () => {
    const { id } = this.state;
    this.props.history.push('/admin/profile');
  }

  render() {
    const { name, pic } = this.state;
    const userMenuOptions = (
      <ul className="gx-user-popover">
        <li onClick={this.goPropfile}>Profile</li>
        <Menu.Divider />
        <li onClick={this.logout}>Log out</li>
      </ul>
    );


    return (
      <Popover
        overlayClassName="gx-popover-horizantal"
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
      >
        <Avatar
          src={`/api/v2/getFile/${pic}`}
          className="gx-avatar gx-pointer"
          alt=""
        />
      </Popover>
    );
  }
}

export default connect(null, { userSignOut })(withRouter(UserInfo));
