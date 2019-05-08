/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import axios from 'axios';
import {
  Card, Divider, Table, Popconfirm, Tag,
} from 'antd';
import {
  NotificationManager,
  NotificationContainer,
} from 'react-notifications';
import { Link } from 'react-router-dom';


const expandedRowRender = record => <p>{record.body}</p>;

class Dynamic extends React.Component {
  state = {
    expandedRowRender,
    data: [],
    columns: [],
    loading: false,
    disable:false,
  };

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading });
  };

  delete = (id) => {
    axios.post('/api/v2/comment/delete', { data: { id } }).then((res) => {
      const { data: { message }, statusText } = res;
      if (res.status === 200) {
        const { data } = this.state;
        const final = data.filter(element => element.id !== id);
        this.setState({ data: final }, () => {
          NotificationManager.success(message, 'SUCCESS', 2000);
        });
      } else {
        NotificationManager.error(message || statusText, 'ERROR', 2000);
      }
    });
  }

  update = (id) => {
    axios.post('/api/v2/comment/update', { data: { id } }).then((res) => {
      const { data: { message }, statusText } = res;
      if (res.status === 200) {
        const { data } = this.state;
        data.forEach((element) => {
          if (element.id === id) {
            if (element.approve === '0') element.approve = '1';
            else element.approve = '0';
          }
        });
        this.setState(() => ({ data }));
      } else {
        NotificationManager.error(message || statusText, 'ERROR', 2000);
      }
    });
  }

  getData = () => {
    this.setState({ loading: true }, async () => {
      axios.get('/api/v2/comments/getAll').then((result) => {
        const { data } = result;
        const columns = [
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.username.length - b.username.length,

          }, {
            title: 'Post',
            dataIndex: 'post',
            key: 'post',
            sorter: (a, b) => a.post.props.children.length - b.post.props.children.length,
          }, {
            title: 'Status',
            dataIndex: 'approve',
            key: 'Status',
            render: approve => (
              <span>
                <Tag color={approve === '0' ? 'red' : 'green'} key={approve === '0' ? '0' : '1'}>{approve === '0' ? 'NOT APPROVED' : 'APPROVED'}</Tag>
              </span>
            ),
            sorter: (a, b) => a.approve - b.approve,
          }, {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            width: 260,
          }];
        this.setState(() => ({ columns }));
        data.map((element) => {
          element.action = (
            <span>
              <Popconfirm
                title="Are you sure update this comment ?"
                onConfirm={() => this.update(element.id)}
                okText="Yes"
                cancelText="No"
              >
                <span className={element.approve === '0' ? 'icon icon-check-circle-o' : 'icon icon-close-circle'} />
              </Popconfirm>
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
          element.post = (
            <Link to={element.post ? `/admin/blogs/${element.post.id}` : 'posts'}>
              {element.post && element.post.title.slice(0, 50)}
            </Link>
          );
          return element;
        });
        const { match: { params: { status } } } = this.props;

        let finalData;
        if (status.toLowerCase() === 'approved') {
          finalData = data.filter(element => element.approve === '1');
        } else if (status.toLowerCase() === 'notapproved') {
          finalData = data.filter(element => element.approve === '0');
        } else if (status.toLowerCase() === 'all') {
          finalData = data;
        } else {
          this.props.history.push('/admin/comments/all');
        }
        this.setState(() => ({ data: finalData, loading: false }));
      });
    });
  }

  componentWillMount = () => {
    this.getData();
  };


  render() {
    const { data, columns } = this.state;
    return (
      <Card title="Comments">
        <Table className="gx-table-responsive" {...this.state} columns={columns} dataSource={data} />
        <NotificationContainer />
      </Card>
    );
  }
}

export default Dynamic;
