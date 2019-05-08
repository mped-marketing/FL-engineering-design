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
  Divider,
  Table,
  Popconfirm,
  Tag,
  Button,
  Input,
  Icon,
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

  delete = (id) => {
    axios
      .delete('/api/v2/posts/delete', { data: { id } })
      .then((res) => {
        const {
          data: { message },
          statusText,
        } = res;
        if (res.status === 200) {
          const { items } = this.state;
          const final = items.filter(element => element.id !== id);
          this.setState(
            () => ({ items: final }),
            () => {
              NotificationManager.success(message, 'SUCCESS', 2000);
            },
          );
        } else {
          NotificationManager.error(message || statusText, 'ERROR', 2000);
        }
      })
      .catch((error) => {
        const {
          data: { message: errorMessage },
          statusText: errorText,
        } = error.response;
        NotificationManager.error(errorMessage || errorText, 'ERROR', 2000);
      });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  componentWillMount = () => {
    axios.get('/api/v2/posts/getAll').then((result) => {
      const { data } = result;
      const { match: { params: { status } } } = this.props;
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'name',
          sorter: (a, b) => a.title.props.children[0].length - b.title.props.children[0].length,
        },
        {
          title: 'auther',
          dataIndex: 'user.name',
          key: 'auther',
          sorter: (a, b) => a.user.name.length - b.user.name.length,
        },
        {
          title: 'Action',
          key: 'action',
          dataIndex: 'action',
          width: 100,
        },
      ];
      this.setState({ columns });
      const { role } = this.props;

      data.map((element) => {
        element.action = (
          <span>
            <Link to={`/admin/blogs/${element.id}`} className="icon icon-feedback" />
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure delete this Post?"
              onConfirm={() => this.delete(element.id)}
              okText="Yes"
              cancelText="No"
            >
              <a className="gx-mb-3 icon icon-trash" href="/" />
            </Popconfirm>
            <Divider type="vertical" />
          </span>
        );
        element.title = (
          <Link to={`/admin/blogs/${element.id}`}>
            {element.title.slice(0, 50)} ...
          </Link>
        );
        return element;
      });
      let finalData;

      if (status.toLowerCase() === 'approved') {
        finalData = data.filter(element => element.approve);
      } else if (status.toLowerCase() === 'notapproved') {
        finalData = data.filter(element => !element.approve);
      } else if (status.toLowerCase() === 'all') {
        finalData = data;
      } else {
        this.props.history.push('/admin/blogs/viewblogs/all');
      }
      this.setState(() => ({ data: finalData, items: finalData }));
    });
  };

  update = (post) => {
    const { id, approve } = post;
    axios
      .post('/api/v2/post/changeState', { id, approve })
      .then((res) => {
        const { data } = this.state;
        const {
          data: { message },
        } = res;
        data.forEach((element) => {
          if (element.id === id) {
            if (element.approve === false) element.approve = true;
            else element.approve = false;
          }
        });

        this.setState(
          () => ({ data }),
          () => {
            NotificationManager.success(message, 'SUCCESS', 2000);
          },
        );
      })
      .catch((error) => {
        this.setState({ loading: false }, () => {
          const {
            data: { message },
            statusText,
          } = error.response;
          NotificationManager.error(message || statusText, 'ERROR', 2000);
        });
      });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={selectedKeys}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ backgroundColor: filtered ? '#cccccc' : undefined, color: filtered ? 'black' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (typeof record[dataIndex] === 'object') {
        return record[dataIndex].props.children
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      if (dataIndex.toString().includes('.')) {
        const dataIndexSplit = dataIndex.toString().split('.');
        return record[dataIndexSplit[0]][dataIndexSplit[1]]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    const { data } = this.state;
    let list = data;
    list = list.filter(
      item => item.title.props.children[0].toLowerCase().indexOf(value.toLowerCase()) !== -1
      || item.user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1,
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
      <Card title="View Blogs">
        <Input.Search style={{ width: '30%' }} onChange={this.onChange} placeholder="Search " />
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
