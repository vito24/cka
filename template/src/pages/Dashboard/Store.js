import { observable, action, runInAction } from 'mobx';
import loading from '../../utils/loading';
import { getList } from './api';

export default class Store {
  constructor() {
    this.getList();
  }

  @observable
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0
  };
  @observable list = [];

  @action.bound
  @loading('loading')
  async getList({ pageSize = this.pagination.pageSize, current = this.pagination.current } = {}) {
    const params = {
      page: current,
      size: pageSize
    };
    const data = await getList(params);
    runInAction(() => {
      this.pagination = {
        current,
        pageSize,
        total: 100
      };
      this.list = data.map(item => ({
        ...item,
        key: item.id
      }));
    });
  }
}
