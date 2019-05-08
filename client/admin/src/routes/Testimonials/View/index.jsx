/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card, Divider, Table, Popconfirm,Input
} from 'antd';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

class Dynamic extends React.Component {
  state = {
    data: [],
    columns: [

    ],
    items: [],
  };

  delete = (id) => {
    axios.delete('/api/v2/clients/delete', { data: { id } }).then((res) => {
      const {
        data: { message },
        statusText,
      } = res;
      if (res.status === 200) {
        NotificationManager.success(message, 'SUCCESS', 2000);
        setTimeout(() => {
          const { data } = this.state;
          const final = data.filter(element => element.id !== id);
          this.setState({ data: final, items: final });
        }, 500);
      } else {
        NotificationManager.error(message || statusText, 'ERROR', 2000);
      }
    });
  };

    componentWillMount = () => {
      axios.get('/api/v2/clients/getAll').then((result) => {
        const { data } = result;
        const columns = [
          {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
          },
          {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.length - b.description.length,
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
              <Link to={`/admin/testimonials/${element.id}`} className="icon icon-feedback" />
              <Divider type="vertical" />
              <Popconfirm
                title="Are you sure delete this testimonial?"
                onConfirm={() => this.delete(element.id)}
                okText="Yes"
                cancelText="No"
              >
                <a className="gx-mb-3 icon icon-trash" href="/" />
              </Popconfirm>
            </span>
          );
          element.title = (
            <Link to={`/admin/testimonials/${element.id}`}>{element.title}</Link>
          );
          return element;
        });
        this.setState(() => ({ data, items: data }));
      });
    };

    onChange = (event) => {
      const { name, value } = event.target;
      this.setState({ [name]: value });
      const { data } = this.state;
      let list = data;
      list = list.filter(
        item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
        || item.description.toLowerCase().indexOf(value.toLowerCase()) !== -1,
      );

      if (list.length !== 0) {
        this.setState({ items: list });
      } else {
        this.setState({ items: null });
      }
    };

    render() {
      const { data, columns, items } = this.state;
      return (
        <Card title="Testimonials List">
          <Input.Search style={{ width: '30%' }} onChange={this.onChange} placeholder="Search  " />
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

export default Dynamic;
