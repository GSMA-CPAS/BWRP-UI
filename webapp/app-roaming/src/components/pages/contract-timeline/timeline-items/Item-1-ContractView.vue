<template >
  <timeline-item>
    <template #content>
      <v-card :class="cardTextStyle" color="#fafafa">
        <v-card-text>
          <div><b>CONTRACT</b> {{ contractId }}</div>
          <div><b>CREATED</b> {{ creationDate }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-menu offset-y bottom>
            <template v-slot:activator="{on, attrs}">
              <app-button label="Export" v-bind="attrs" v-on="on" />
            </template>
            <v-list>
              <v-list-item link v-for="(item, index) in items" :key="index">
                <v-list-item-title v-text="item.title" @click="item.onClick" />
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-menu>
          <div class="mr-2" />
          <contract />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@mixins/component-specfic';
import Contract from '@dialogs/Contract.vue';
import {converterMixin} from '@mixins/handle-data';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin, converterMixin],
  components: {Contract},
  methods: {
    exportRawData() {
      const data = new Blob([this.rawData], {
        type: 'data:text/plain',
      });
      const fileName = `${this.referenceId}.base64`;

      if (window.navigator.msSaveOrOpenBlob) {
        // ie11
        window.navigator.msSaveOrOpenBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = fileName;
        link.href = window.URL.createObjectURL(data);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    exportToJSON() {
      const data = new Blob([atob(this.rawData)], {
        type: 'data:application/json',
      });
      const fileName = `${this.referenceId}.json`;

      if (window.navigator.msSaveOrOpenBlob) {
        // ie11
        window.navigator.msSaveOrOpenBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = fileName;
        link.href = window.URL.createObjectURL(data);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
  },
  computed: {
    items() {
      return [
        {title: 'Raw Data', icon: 'mdi-download', onClick: this.exportRawData},
        {title: 'To JSON', icon: 'mdi-download', onClick: this.exportToJSON},
      ];
    },
  },
};
</script>
