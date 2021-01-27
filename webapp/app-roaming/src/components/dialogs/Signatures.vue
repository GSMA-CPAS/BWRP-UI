<template>
  <app-dialog
    :title="signatures ? 'Signatures' : 'No existing signatures'"
    label="View Signatures"
  >
    <template v-if="signatures" #content>
      <row
        v-for="({signature, msp}, signatureIndex) in signatures"
        :key="signatureIndex"
        :label="`Signature ${signatureIndex}`"
      >
        <v-col cols="8"> {{ `${signature} from ${msp}` }}</v-col>
      </row>
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
