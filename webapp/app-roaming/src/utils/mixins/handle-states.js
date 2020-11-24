const handleComponentVisibilityMixin = {
  data() {
    return {component: false};
  },
  methods: {
    hide() {
      this.component = false;
    },
    show() {
      this.component = true;
    },
    switch() {
      this.component = !this.component;
    },
  },
  computed: {
    isVisible() {
      return this.component;
    },
  },
};
export {handleComponentVisibilityMixin};
const counterMixin = {
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    increase() {
      this.counter++;
    },
    decrease() {
      if (this.counter === 0) {
        return;
      }
      this.counter--;
    },
  },
};
export {counterMixin};
