/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card, Divider, Table, Popconfirm,
} from 'antd';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

class Dynamic extends React.Component {
  state = {
    data: [],
    columns: [    ],
  };


    componentWillMount = () => {
      axios.get('/api/v2/about/getItems').then((result) => {
        const { data } = result;
        const columns = [
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.props.children.length - b.title.props.children.length,
          },
          {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 100,
          },
        ];
        this.setState({ columns });
        data.map((element) => {
          element.action = (
            <span>
              <Link to={`/admin/about/items/${element.id}`} className="icon icon-feedback" />
            </span>
          );
          element.title = (
            <Link to={`/admin/about/items/${element.id}`}>{element.title}</Link>
          );
          return element;
        });
        this.setState(() => ({ data }));
      });
    };

    render() {
      const { data, columns } = this.state;
      return (
        <Card title="About | Items List">
          <Table
            className="gx-table-responsive"
            {...this.state}
            columns={columns}
            dataSource={data}
          />
          <NotificationContainer />
        </Card>
      );
    }
}

export default Dynamic;
