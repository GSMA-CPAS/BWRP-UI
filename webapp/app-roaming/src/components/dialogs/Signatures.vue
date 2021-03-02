<template>
  <app-dialog
    :title="signatures ? 'Signatures' : 'No existing signatures'"
    label="View Signatures"
  >
    <!-- width="80vw" -->
    <template v-if="signatures" #content>
      <v-simple-table
        v-for="(
          {signature, msp, identity, blockchainRef, state}, signatureIndex
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
            <td class="pa-2">{{ identity }}</td>
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
  </app-dialog>
</template>
<script>
/*
  INFO: SUBJECT to changes
 */
import {timelineMixin} from '@/utils/mixins/component-specfic';
export default {
  name: 'signatures',
  description: 'This is the dialog view for the signatures.',
  mixins: [timelineMixin],
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
