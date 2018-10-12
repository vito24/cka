import { action, runInAction, decorate, observable } from 'mobx';

const loading = (loadingName = 'loading') => {
  return (target, key, descriptor) => {
    if (!target.hasOwnProperty(loadingName)) {
      target[loadingName] = false;
      decorate(target, {
        [loadingName]: observable
      });
    }

    return {
      ...descriptor,
      @action
      value() {
        const fn = descriptor.value;
        let result = fn.apply(this, arguments);
        if (result instanceof Promise) {
          this[loadingName] = true;
          return result
            .then(response => {
              runInAction(() => {
                this[loadingName] = false;
                return Promise.resolve(response);
              });
            })
            .catch(error => {
              runInAction(() => {
                this[loadingName] = false;
                return Promise.reject(error);
              });
            });
        } else {
          return result;
        }
      }
    };
  };
};

export default loading;
