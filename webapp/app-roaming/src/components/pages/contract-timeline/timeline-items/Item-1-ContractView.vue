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
          <!-- <app-button @click="exportRawData()" :ripple="false" label="Export" /> -->
          <div class="mr-2" />
          <contract />
        </v-card-actions>
      </v-card>
    </template>
  </timeline-item>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import Contract from '@/components/dialogs/Contract.vue';
import {converterMixin} from '@/utils/mixins/handle-data';
export default {
  name: 'item-1',
  description: 'description',
  mixins: [timelineMixin, converterMixin],
  components: {Contract},
  methods: {
    exportRawData() {
      const data = 'data:text/plain;base64,' + encodeURIComponent(this.rawData);
      const link = document.createElement('a');
      link.href = data;
      link.download = `${this.referenceId}.base64`;
      document.body.appendChild(link);
      link.click();
    },
    exportToJSON() {
      const data =
        'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.convertRawToJSON(this.rawData)));
      const link = document.createElement('a');
      link.href = data;
      link.download = `${this.referenceId}.json`;
      document.body.appendChild(link);
      link.click();
    },
  },
  computed: {
    items() {
      return [
        {title: 'To JSON', icon: 'mdi-download', onClick: this.exportToJSON},
        {title: 'Raw Data', icon: 'mdi-download', onClick: this.exportRawData},
      ];
    },
  },
};
</script>
