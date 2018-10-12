import axios from '../../utils/request';

export const getList = params => {
  return axios('https://jsonplaceholder.typicode.com/users', {
    params
  });
};
