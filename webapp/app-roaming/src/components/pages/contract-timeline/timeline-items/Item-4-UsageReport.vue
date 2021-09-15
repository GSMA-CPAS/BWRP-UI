<template>
  <timeline-item>
    <template #content>
      <v-card
        v-if="!isOwnUsage && !isPartnerUsageReceived"
        class="mr-15"
        color="#fafafa"
      >
        <v-card-text>
          <div>WAITING FOR PARTNER USAGE</div>
        </v-card-text>
      </v-card>
      <v-card v-else :class="isUsageSent ? '' : 'mr-15'" color="#fafafa">
        <v-card-text>
          <div>{{ isOwnUsage ? selfMsp : partnerMsp }}</div>
          <div>
            UPLOADED on
            {{ isOwnUsage ? ownUsageCreationDate : partnerUsageCreationDate }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <usage-report :is-own-usage="isOwnUsage" />
          <ul />
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
      <send-usage v-if="!isUsageSent" />
    </template>
  </timeline-item>
</template>
<script>
import SendUsage from '@dialogs/SendUsage.vue';
import {timelineMixin} from '@mixins/component-specfic';
import UsageReport from '@dialogs/UsageReport';
import AppButton from '@/components/global-components/Button';
import {utilsMixin} from '@mixins/handle-data';
export default {
  name: 'item-4',
  description: 'description',
  mixins: [timelineMixin, utilsMixin],
  props: {
    isOwnUsage: {
      type: Boolean,
      default: false,
    },
    isCurrentTimeline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      partnerBody: null,
    };
  },
  methods: {
    pollData() {
      if (this.isCurrentTimeline) {
        this.partnerBody = setInterval(() => {
          if (!this.isPartnerUsageReceived) {
            this.$store.dispatch('usage/getUsageById', {
              contractId: this.contractId,
              usageId: this.currentUsageId,
              isPartner: false,
            });
          } else {
            clearInterval(this.partnerBody);
          }
        }, 30000);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.partnerBody);
  },
  computed: {
    items() {
      if (this.isOwnUsage) {
        return [
          {
            title: 'To CSV',
            icon: 'mdi-download',
            onClick: this.exportOwnUsageToCSV,
          },
          {
            title: 'To XLSX',
            icon: 'mdi-download',
            onClick: this.exportOwnUsageToXLSX,
          },
        ];
      } else {
        return [
          {
            title: 'To CSV',
            icon: 'mdi-download',
            onClick: this.exportPartnerUsageToCSV,
          },
          {
            title: 'To XLSX',
            icon: 'mdi-download',
            onClick: this.exportPartnerUsageToXLSX,
          },
        ];
      }
    },
  },
  // created() {
  //   if (!this.isOwnUsage) this.pollData();
  // },
  components: {
    AppButton,
    UsageReport,
    SendUsage,
  },
};
</script>
