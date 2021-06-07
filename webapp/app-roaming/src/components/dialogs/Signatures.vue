<template>
  <app-dialog
    :title="signatures ? 'Signatures' : 'No existing signatures'"
    label="View Signatures"
  >
    <!-- width="80vw" -->
    <template v-if="signatures.length > 0" #content>
      <v-simple-table
        v-for="(
          {signature, msp, identity, blockchainRef, state, certificate},
          signatureIndex
        ) in signatures"
        :key="signatureIndex"
        class="pb-10 respect"
      >
        <tbody>
          <tr>
            <td class="font-weight-medium pa-2">
              Signature {{ signatureIndex + 1 }}
            </td>
            <td />
          </tr>
          <tr>
            <td class="font-weight-medium pa-2">State</td>
            <td class="pa-2">{{ state }}</td>
          </tr>
          <tr>
            <td class="font-weight-medium pa-2">Transaction ID</td>
            <td class="pa-2">{{ blockchainRef.txId }}</td>
          </tr>
          <tr>
            <td class="font-weight-medium pa-2">Organization</td>
            <td class="pa-2">{{ msp }}</td>
          </tr>
          <tr>
            <td class="font-weight-medium pa-2">Identity</td>
            <td class="pa-2">
              {{ identity }}
              <tooltip tooltipText="Download Certificate">
                <template #activator="{on}">
                  <v-icon
                    @click="downloadCertificate(msp, identity, certificate)"
                    v-on="on"
                    class="ml-2"
                  >
                    mdi-download
                  </v-icon>
                </template>
              </tooltip>
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium pa-2">Signature</td>
            <td class="pa-2">
              {{ signature }}
            </td>
          </tr>
        </tbody>
        <!-- <v-row>
          <v-col>Signature</v-col>
          <v-col>{{ signature }}</v-col>
        </v-row> -->
      </v-simple-table>
    </template>
    <template v-else #content>
      <div class="subtitle-1 pl-2">No available signatures.</div>
    </template>
  </app-dialog>
</template>
<script>
/*
  INFO: SUBJECT to changes
 */
import {timelineMixin} from '@mixins/component-specfic';
import Tooltip from '../global-components/Tooltip.vue';
export default {
  components: {Tooltip},
  name: 'signatures',
  description: 'This is the dialog view for the signatures.',
  mixins: [timelineMixin],
  methods: {
    downloadCertificate(msp, identity, certificate) {
      const data = new Blob([certificate], {
        type: 'data:text/plain',
      });
      const fileName = `${msp}_${identity}.pem`;

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
};
</script>

<style scoped>
/deep/ table {
  table-layout: fixed;
}

table td {
  word-wrap: break-word; /* All browsers since IE 5.5+ */
}
table tr td:nth-child(2) {
  width: 80%;
}
table tr:hover {
  background-color: transparent !important;
}
</style>
