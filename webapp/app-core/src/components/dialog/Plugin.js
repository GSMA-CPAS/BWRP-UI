import Dialog from '@/components/dialog/Dialog';

const Modal = {

  install(Vue) {
    this.EventBus = new Vue();

    // global component
    Vue.component('modal', Dialog);

    Vue.prototype.$modal = {

      info(params) {
        Modal.EventBus.$emit('info', params);
      },

      error(params) {
        Modal.EventBus.$emit('error', params);
      },

      confirm(params) {
        Modal.EventBus.$emit('confirm', params);
      },
    };
  },
};

export default Modal;
