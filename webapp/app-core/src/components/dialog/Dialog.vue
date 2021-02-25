<template>
  <v-dialog v-model="showDialog" :persistent='persistent' width="380">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn v-if='type === "confirm"' color="primary" text @click="handleClose">{{ buttonTextClose }}</v-btn>
        <v-btn color="primary" tile @click="handleOk">{{ buttonTextOk }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import Modal from '@/components/dialog/Plugin';

export default {

  name: 'Dialog',

  data() {
    return {
      showDialog: false,
      type: 'info',
      persistent: true,
      title: '',
      message: '',
      buttonTextClose: 'Cancel',
      buttonTextOk: 'OK',
      callbackClose: null,
      callbackOk: null,
    };
  },

  beforeMount() {
    Modal.EventBus.$on('info', (params) => {
      this.type = 'info';
      this.persistent = params.persistent !== false;
      this.title = (params.title) ? this.title = params.title : 'Info';
      this.message = params.message;
      this.callbackOk = params.callbackOk;
      if (params.buttonTextOk) this.buttonTextOk = params.buttonTextOk;
      this.showDialog = true;
    });

    Modal.EventBus.$on('error', (params) => {
      this.type = 'error';
      this.title = (params.title) ? this.title = params.title : 'Error';
      this.persistent = params.persistent !== false;
      this.message = params.message;
      this.callbackOk = params.callbackOk;
      if (params.buttonTextOk) this.buttonTextOk = params.buttonTextOk;
      if (typeof params === 'object') {
        this.title = 'Error';
        if (params.response && params.response.data) {
          if (params.response.data.message) {
            this.message = params.response.data.message;
          } else {
            this.message = 'Unknown error!';
          }
        }
      } else {
        this.message = params;
      }
      this.showDialog = true;
    });

    Modal.EventBus.$on('confirm', (params) => {
      this.type = 'confirm';
      this.persistent = params.persistent !== false;
      this.title = (params.title) ? this.title = params.title : 'Confirm';
      this.message = params.message;
      this.callbackClose = params.callbackClose;
      this.callbackOk = params.callbackOk;
      if (params.buttonTextClose) this.buttonTextClose = params.buttonTextClose;
      if (params.buttonTextOk) this.buttonTextOk = params.buttonTextOk;
      this.showDialog = true;
    });
  },

  methods: {

    handleClose() {
      this.showDialog = false;
      if (this.callbackClose) {
        this.callbackClose();
      }
    },

    handleOk() {
      this.showDialog = false;
      if (this.callbackOk) {
        this.callbackOk();
      }
    },
  },
};
</script>
