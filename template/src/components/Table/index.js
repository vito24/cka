import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Alert, Radio, Button, Checkbox, Icon, Row, Col } from 'antd';

import styles from './index.module.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

export default class extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.shape({
      list: PropTypes.array.isRequired,
      pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    }),
    selectedRows: PropTypes.array,
    onSelectRow: PropTypes.func,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    loading: PropTypes.bool,
    buttons: PropTypes.node,
    expandedRowRender: PropTypes.func,
    scroll: PropTypes.object,
    size: PropTypes.oneOf(['default', 'middle', 'small']),
    filterOptionVisible: PropTypes.bool // 是否可以过滤columns
  };

  static defaultProps = {
    scroll: {},
    size: 'default',
    filterOptionVisible: true
  };

  constructor(props) {
    super(props);
    const { columns, size } = props;
    const needTotalList = initTotalList(columns);
    // default selected columns
    const defaultCheckdList = columns.map(({ dataIndex, key }) => dataIndex || key);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
      size,
      showFullScreen: false,
      visibleColumns: columns, // 可见的columns
      filterDropdownVisible: false, // 过滤columns弹窗是否可见
      checkAll: true, // 是否全选
      checkedList: defaultCheckdList // 选中的columns的dataIndex|key集合
    };
    this.defaultCheckdList = defaultCheckdList;
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows !== undefined && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList
      });
    }
  }

  hasSelection = this.props.selectedRows !== undefined && this.props.onSelectRow !== undefined;

  handleTableSize = event => {
    this.setState({ size: event.target.value });
  };

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0)
      };
    });
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  handleExpand = (expanded, record) => {
    if (this.props.onExpand !== undefined) {
      this.props.onExpand(expanded, record);
    }
  };

  handleFullScreen = () => {
    this.setState({
      showFullScreen: !this.state.showFullScreen
    });
  };

  handleCleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  // 过滤columns
  handleFilterColumns = checkedList => {
    const { columns } = this.props;
    const visibleColumns = columns.filter(({ dataIndex, key }) =>
      checkedList.includes(dataIndex || key)
    );
    this.setState({
      visibleColumns,
      checkedList,
      checkAll: checkedList.length === this.defaultCheckdList.length
    });
  };

  // 展示所有columns
  handleCheckAllColumns = e => {
    const checked = e.target.checked;
    const { columns } = this.props;
    this.setState({
      visibleColumns: checked ? columns : [],
      checkedList: checked ? this.defaultCheckdList : [],
      checkAll: e.target.checked
    });
  };

  // 获取分页参数
  getPaginationProps = () => {
    const {
      data: { pagination }
    } = this.props;
    let paginationProps = false;
    if (typeof pagination === 'object') {
      const { current, pageSize } = pagination;
      paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: true,
        showTotal: total => {
          const totalPages =
            parseInt(total / pageSize) === total / pageSize
              ? total / pageSize
              : parseInt(total / pageSize) + 1;
          return `共 ${total} 条记录 第 ${current} / ${totalPages} 页`;
        },
        ...pagination
      };
    }
    return paginationProps;
  };

  // 获取过滤后的columns
  getVisibleColumns = () => {
    const { visibleColumns, filterDropdownVisible, checkAll, checkedList } = this.state;
    const { columns, filterOptionVisible } = this.props;
    if (filterOptionVisible) {
      const filterColumn = {
        title: '',
        dataIndex: 'option',
        filterDropdown: (
          <div className={styles.customFilterDropdown}>
            <Checkbox onChange={this.handleCheckAllColumns} checked={checkAll}>
              全选
            </Checkbox>
            <CheckboxGroup value={checkedList} onChange={this.handleFilterColumns}>
              <Row>
                {columns.map(({ dataIndex, key, title }) => (
                  <Col span={24} key={title}>
                    <Checkbox value={dataIndex || key}>{title}</Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </div>
        ),
        filterIcon: <Icon type="setting" />,
        filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState({ filterDropdownVisible: visible });
        }
      };
      return visibleColumns.concat(filterColumn);
    }
    return visibleColumns;
  };

  render() {
    const { selectedRowKeys, needTotalList, showFullScreen, size } = this.state;
    const {
      data: { list },
      loading,
      scroll,
      buttons,
      expandedRowRender
    } = this.props;

    let rowSelection = undefined;
    if (this.hasSelection) {
      rowSelection = {
        selectedRowKeys,
        onChange: this.handleRowSelectChange,
        getCheckboxProps: record => ({
          disabled: record.disabled
        })
      };
    }

    const TableAlert = this.hasSelection ? (
      <div className={styles.tableAlert}>
        <Alert
          message={
            <Fragment>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              {needTotalList.map(item => (
                <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                  {item.title}总计&nbsp;
                  <span style={{ fontWeight: 600 }}>
                    {item.render ? item.render(item.total) : item.total}
                  </span>
                </span>
              ))}
              <a onClick={this.handleCleanSelectedKeys} style={{ marginLeft: 24 }}>
                清空
              </a>
            </Fragment>
          }
          type="info"
          showIcon
        />
      </div>
    ) : null;

    return (
      <div className={showFullScreen ? styles.fullScreen : undefined}>
        <div className={styles.tableListOperator}>
          <div>{buttons}</div>
          <div>
            <RadioGroup onChange={this.handleTableSize} value={size} size="small">
              <RadioButton value="small">小</RadioButton>
              <RadioButton value="middle">中</RadioButton>
              <RadioButton value="default">大</RadioButton>
            </RadioGroup>
            <Button
              size="small"
              icon={showFullScreen ? 'shrink' : 'arrows-alt'}
              onClick={this.handleFullScreen}
            />
          </div>
        </div>
        <div className={styles.table}>
          {TableAlert}
          <Table
            expandedRowKeys={
              loading ? [] : list.filter(({ expand }) => expand).map(({ key }) => key)
            }
            size={size}
            loading={loading}
            rowKey={record => record.key}
            rowSelection={rowSelection}
            dataSource={list}
            columns={this.getVisibleColumns()}
            pagination={this.getPaginationProps()}
            onChange={this.handleTableChange}
            onExpand={this.handleExpand}
            expandedRowRender={expandedRowRender}
            scroll={scroll}
          />
        </div>
      </div>
    );
  }
}
