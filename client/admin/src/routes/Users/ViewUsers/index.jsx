/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card, Divider, Table, Popconfirm, Button, Input, Icon,
} from 'antd';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';

class Dynamic extends React.Component {
  state = {
    data: [],
    columns: [],
    items: [],
  };

  delete = (id, rule) => {
    axios
      .delete('/api/v2/users/delete', { data: { id, rule } })
      .then((res) => {
        const {
          data: { message },
        } = res;
        NotificationManager.success(message, 'SUCCESS', 2000);
        setTimeout(() => {
          const { data } = this.state;
          const final = data.filter(element => element.id !== id);
          this.setState({ data: final,items: final  });
        }, 500);
      })
      .catch(() => {
        NotificationManager.error(
          'You can not delete the admin',
          'ERROR',
          2000,
        );
      });
  };

  componentDidMount = () => {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    axios.get('/api/v2/users/getAll').then((result) => {
      const { data } = result;
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.props.children.length - b.name.props.children.length,
          render: (text, record) => (
            <div className="gx-flex-row gx-align-items-center">
              <img
                className="gx-rounded-circle gx-size-30 gx-mr-2"
                src={`/api/v2/getFile/${record.pic}`}
                alt=""
              />
              <p className="gx-mb-0">{record.name}</p>
            </div>
          ),
        },
        {
          title: 'email',
          dataIndex: 'email',
          key: 'email',
          sorter: (a, b) => a.email.length - b.email.length,
        },
        {
          title: 'rule',
          dataIndex: 'rule',
          key: 'rule',
        },
        {
          title: 'Action',
          key: 'action',
          width:100,
          dataIndex: 'action',
        },
      ];
      this.setState({ columns });
      data.map((element) => {
        element.action = (
          <span>
            <Link to={`/admin/users/${element.id}`} className="icon icon-feedback" />
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure delete this User?"
              onConfirm={() => this.delete(element.id, element.rule)}
              okText="Yes"
              cancelText="No"
            >
              <a className="gx-mb-3 icon icon-trash" href="/" />
            </Popconfirm>
          </span>
        );
        element.name = (
          <Link to={`/admin/users/${element.id}`}>{element.name}</Link>
        );
        return element;
      });
      this.setState(() => ({ data, items: data }));
    });
  };

  delete = (id, rule) => {
    axios
      .delete('/api/v2/users/delete', { data: { id, rule } })
      .then((res) => {
        const {
          data: { message },
        } = res;
        NotificationManager.success(message, 'SUCCESS', 2000);
        setTimeout(() => {
          const { data } = this.state;
          const final = data.filter(element => element.id !== id);
          this.setState({ data: final });
        }, 500);
      })
      .catch(() => {
        NotificationManager.error(
          'You can not delete the admin',
          'ERROR',
          2000,
        );
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
          placeholder={`Search ${dataIndex}`}
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
      <Icon
        type="search"
        style={{
          backgroundColor: filtered ? '#cccccc' : undefined,
          color: filtered ? 'black' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (typeof record[dataIndex] === 'object') {
        return record[dataIndex].props.children
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
      item => item.name.props.children.toLowerCase().indexOf(value.toLowerCase()) !== -1
      || item.email.toLowerCase().indexOf(value.toLowerCase()) !== -1
      || item.rule.toLowerCase().indexOf(value.toLowerCase()) !== -1,
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
      <Card title="Users List">
        <Input.Search style={{ width: '30%' }} onChange={this.onChange} placeholder="Search  " />
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={items}
        />
        <NotificationContainer />
      </Card>
    );
  }
}

export default Dynamic;
