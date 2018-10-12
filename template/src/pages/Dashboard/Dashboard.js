import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Table } from '../../components';

@inject('store')
@observer
class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getList, pagination, list, loading } = this.props.store;

    const columns = [
      {
        title: 'name',
        dataIndex: 'name'
      },
      {
        title: 'username',
        dataIndex: 'username'
      },
      {
        title: 'email',
        dataIndex: 'email'
      },
      {
        title: 'phone',
        dataIndex: 'phone'
      }
    ];

    return (
      <div>
        <Table
          loading={loading}
          data={{
            list,
            pagination
          }}
          columns={columns}
          onChange={getList}
        />
      </div>
    );
  }
}

export default Dashboard;
