<template>
  <timeline-item>
    <template #content>
      <v-card class="mr-15" color="#fafafa">
        <v-card-text>
          <div v-if="isOwnUsage">DTAG</div>
          <div v-else>TMUS</div>
          <div>UPLOADED on {date}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <usage-report :is-own-usage="isOwnUsage"/>
          <ul/>
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
        </v-card-actions>
      </v-card>
    </template>
    <template #icon>
      <send-usage v-if="!isUsageSent"/>
    </template>
  </timeline-item>
</template>
<script>
import SendUsage from '@/components/dialogs/SendUsage.vue';
import {timelineMixin} from '@/utils/mixins/component-specfic';
import UsageReport from '@/components/dialogs/UsageReport';

export default {
  name: 'item-4',
  description: 'description',
  mixins: [timelineMixin],
  props: {
    isOwnUsage: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    usageJsonToCsv() {
      const inboundItems = this.$store.state.document.usage.body.inbound;
      const outboundItems = this.$store.state.document.usage.body.outbound;
      const header = Object.keys(inboundItems[0]);
      header.push('direction');
      return [
        header.join(','), // header row first
        ...inboundItems.map((row) => header.map((fieldName) => {
          if (fieldName === 'direction') return 'inbound';
          else return row[fieldName] ? row[fieldName] : '';
        }).join(',')),
        ...outboundItems.map((row) => header.map((fieldName) => {
          if (fieldName === 'direction') return 'outbound';
          else return row[fieldName] ? row[fieldName] : '';
        }).join(','))
      ].join('\r\n');
    },
    exportToCSV() {
      const data = new Blob([this.usageJsonToCsv()], {
        type: 'data:text/csv',
      });
      const fileName = `${this.referenceId}.csv`;
      this.generateFile(data, fileName);
    },
    exportToXLSX() {
      const data = new Blob([this.usageJsonToCsv()], {
        type: 'application/excel',
      });
      const fileName = `${this.referenceId}.xlsx`;
      this.generateFile(data, fileName);
    },
    generateFile(data, fileName) {
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
    }
  },
  computed: {
    items() {
      return [
        {title: 'To CSV', icon: 'mdi-download', onClick: this.exportToCSV},
        {title: 'To XLSX', icon: 'mdi-download', onClick: this.exportToXLSX},
      ];
    },
  },
  components: {
    UsageReport,
    SendUsage,
  },
};
</script>
