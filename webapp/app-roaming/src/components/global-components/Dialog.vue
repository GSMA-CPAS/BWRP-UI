<template>
  <v-dialog scrollable :width="width" v-model="component">
    <template v-slot:activator="{on}">
      <app-button
        :loading="loading"
        :outlined="outlined"
        @click="$emit('on-open')"
        v-on="on"
        :label="label"
        :svg="svg"
        :min-width="labelMinWidth"
      />
    </template>
    <v-card class="pa-1">
      <v-card-title class="headline">
        <div>
          {{ title }}
        </div>
        <v-spacer />
        <v-icon v-if="!hideIcon" color="dark" @click="hide">mdi-close</v-icon>
      </v-card-title>
      <v-card-text v-if="$scopedSlots['content']" class="pa-5">
        <slot name="content" />
      </v-card-text>
      <div v-if="$scopedSlots['actions']">
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <slot name="actions" :cancel="hide" />
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import {handleComponentVisibilityMixin} from '@/utils/mixins/handle-states';
export default {
  name: 'app-dialog',
  description: 'This is a custom dialog.',
  mixins: [handleComponentVisibilityMixin],
  props: {
    outlined: Boolean,
    label: {type: String, default: 'Missing Label'},
    svg: {type: String},
    title: {type: String, default: 'Missing Title'},
    width: {type: String, default: '60vw'},
    hideIcon: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    labelMinWidth: String,
    padding: String,
  },
};
</script>
