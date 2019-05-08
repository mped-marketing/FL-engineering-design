/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import {
  Card,
  Table,
} from 'antd';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';

class Dynamic extends React.Component {
  state = {
    data: [],
    columns: [],
  };


  componentWillMount = () => {
    axios.get('/api/v2/contactus').then((result) => {
      const { data } = result;
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title: 'Mobile',
          dataIndex: 'mobile',
          key: 'mobile',
          sorter: (a, b) => a.mobile.length - b.mobile.length,
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
          sorter: (a, b) => a.message.length - b.message.length,
        },
      ];
      this.setState({ columns, items: data });
    });
  };

  render() {
    const { columns, items } = this.state;
    return (
      <Card title="Contact Us">
        <Table
          className="gx-table-responsive"
          {...this.state}
          columns={columns}
          dataSource={items}
        />
        <NotificationContainer />
      </Card>
    );
  }
}
const mapStateToProps = ({ auth }) => {
  const { role } = auth;
  return {
    role,
  };
};
export default connect(mapStateToProps)(Dynamic);
