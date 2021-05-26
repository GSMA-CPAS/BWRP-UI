
<template>
  <v-container v-if="$store.state.document">
    <v-timeline>
      <Item-1-ContractView />
      <Item-2-Signatures />
      <v-expansion-panels focusable
         v-model="panel"
      >
        <v-expansion-panel
            v-for="(item,i) in this.usageIds"
            :key="i"
            v-model="panel"
            @click="onPanelClick(item.usageId)"
        >
          <v-expansion-panel-header>
            <v-col md="1" sm="2" class="text-no-wrap">
              Timeline {{i+1}}
            </v-col>
            <v-col class="text-no-wrap">
              Creation date: {{item.creationDate}}
            </v-col>
            <v-spacer/>
            <v-col cols="auto">
              <h3 class="red--text text-no-wrap">
                {{item.tag}}
              </h3>
            </v-col>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-timeline>
              <Item-3-UploadUsage />
              <Item-4-UsageReport :isOwnUsage="true"/>
              <Item-4-UsageReport />
              <Item-5-Discrepancies/>
              <Item-6-GenerateSettlement/>
              <Item-7-SettlementDiscrepancies :isHome="true"/>
              <Item-7-SettlementDiscrepancies/>
              <Item-8-SettlementReport :currentTimeline="false"/>
            </v-timeline>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel
            @click="onPanelClick(currentUsageId)"
            v-model="panel"
            >
          <v-expansion-panel-header>
            <v-col cols="1" class="text-no-wrap">
              Timeline {{usageIds.length+1}}
            </v-col>
            <v-col/>
            <v-spacer/>
            <v-col cols="auto">
              <h3 v-if="ownUsage.tag === 'APPROVED'" class="green--text text-no-wrap">
                APPROVED
              </h3>
              <h3 v-else class="grey--text text-no-wrap">
                IN PROGRESS
              </h3>
            </v-col>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-timeline>
              <Item-3-UploadUsage />
              <Item-4-UsageReport v-if="this.isUsageUploaded" :isOwnUsage="true"/>
              <Item-4-UsageReport v-if="this.isUsageSent" :isCurrentTimeline="true" />
              <Item-5-Discrepancies v-if="this.areUsagesExchanged" />
              <Item-6-GenerateSettlement v-if="this.areUsagesExchanged"/>
              <Item-7-SettlementDiscrepancies v-if="this.areSettlementsGenerated" :isHome="true"/>
              <Item-7-SettlementDiscrepancies v-if="this.areSettlementsGenerated"/>
              <Item-8-SettlementReport v-if="this.areSettlementsGenerated" />
              <Item-9-Result v-if="this.usageSignatures.length" />
            </v-timeline>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-timeline>
  </v-container>
</template>
<script>
import {timelineMixin} from '@/utils/mixins/component-specfic';
import Item1ContractView from './timeline-items/Item-1-ContractView.vue';
import Item2Signatures from './timeline-items/Item-2-Signatures.vue';
import Item3UploadUsage from './timeline-items/Item-3-UploadUsage';
import Item4UsageReport from './timeline-items/Item-4-UsageReport';
import Item5Discrepancies from './timeline-items/Item-5-UsageDiscrepancies.vue';
import Item6GenerateSettlement from './timeline-items/Item-6-GenerateSettlement.vue';
import Item7SettlementDiscrepancies from './timeline-items/Item-7-SettlementDiscrepancies.vue';
import Item8SettlementReport from './timeline-items/Item-8-SettlementReport.vue';
import Item9Result from './timeline-items/Item-9-Result.vue';
export default {
  components: {
    Item9Result,
    Item8SettlementReport,
    Item7SettlementDiscrepancies,
    Item6GenerateSettlement,
    Item5Discrepancies,
    Item4UsageReport,
    Item3UploadUsage,
    Item2Signatures,
    Item1ContractView,
  },
  name: 'timeline',
  title: 'Timeline',
  description: 'Component: Timeline',
  mixins: [timelineMixin],
  created() {
    this.loadData(this.$route.params.cid);
  },
  data() {
    return {
      panel: [0],
      expanded: false
    };
  },
  computed: {
    areSettlementsAccepted() {
      return this.$store.state.timelineCache.currentTimeline['isReportAccepted'];
    }
  },
  methods: {
    onPanelClick(usageId) {
      if (!event.currentTarget.classList.contains('v-expansion-panel-header--active')) {
        this.loadDataFromCache(usageId);
      }
    }
  },

};
</script>
