<template>
  <v-dialog :width="width" v-model="component">
    <template v-slot:activator="{on}">
      <app-button
        :loading="loading"
        :outlined="outlined"
        v-on="on"
        :label="label"
      />
    </template>
    <v-card class="pa-1">
      <v-card-title class="headline text-uppercase">
        {{ title }}
        <fragment v-if="!hideIcon">
          <v-spacer />
          <app-button color="dark" @button-pressed="hide" icon svg="close" />
        </fragment>
      </v-card-title>
      <div v-if="$scopedSlots['content']" class="pa-5">
        <slot name="content" />
      </div>
      <fragment v-if="$scopedSlots['actions']">
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <slot name="actions" :cancel="hide" />
        </v-card-actions>
      </fragment>
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
    title: {type: String, default: 'Missing Title'},
    width: {type: String, default: '60vw'},
    hideIcon: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
  },
};
</script>
