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
    columns: [
      {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.props.children.length - b.title.props.children.length,
      },
      {
        title: 'subtitle',
        dataIndex: 'sub_title',
        key: 'subtitle',
        sorter: (a, b) => a.sub_title.props.children.length - b.sub_title.props.children.length,
      },
      {
        title: 'description',
        dataIndex: 'desc',
        key: 'description',
        sorter: (a, b) => a.desc.length - b.desc.length,
      },
      {
        title: 'Action',
        key: 'action',
        dataIndex: 'action',
        width: 360,
      },
    ],
  };

  delete = (id) => {
    axios.delete(`/api/v2/features/delete/${id}`).then((res) => {
      const {
        data: { message },
        statusText,
      } = res;
      if (res.status === 200) {
        NotificationManager.success(message, 'SUCCESS', 2000);
        setTimeout(() => {
          const { data } = this.state;
          const final = data.filter(element => element.id !== id);
          this.setState({ data: final });
        }, 500);
      } else {
        NotificationManager.error(message || statusText, 'ERROR', 2000);
      }
    });
  };

    componentWillMount = () => {
      axios.get('/api/v2/features/getAll').then((result) => {
        const { data } = result;
        const columns = [
          {
            title: 'title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.props.children.length - b.title.props.children.length,
          },
          {
            title: 'description',
            dataIndex: 'desc',
            key: 'description',
            sorter: (a, b) => a.desc.length - b.desc.length,
          },
          {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 360,
          },
        ];
        this.setState({ columns });
        data.map((element) => {
          element.action = (
            <span>
              <Link to={`/admin/features/${element.id}`} className="icon icon-feedback" />
              <Divider type="vertical" />
              <Popconfirm
                title="Are you sure delete this task?"
                onConfirm={() => this.delete(element.id)}
                okText="Yes"
                cancelText="No"
              >
                <a className="gx-mb-3 icon icon-trash" href="/" />
              </Popconfirm>
            </span>
          );
          element.title = (
            <Link to={`/admin/features/${element.id}`}>{element.title}</Link>
          );
          return element;
        });
        this.setState(() => ({ data }));
      });
    };

    render() {
      const { data, columns } = this.state;
      return (
        <Card title="Features List">
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
