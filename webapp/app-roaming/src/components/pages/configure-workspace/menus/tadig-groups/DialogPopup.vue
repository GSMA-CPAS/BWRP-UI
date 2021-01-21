<template>
  <v-dialog v-model="component">
    <template v-slot:activator="{on}">
      <v-icon :class="margin" v-on="on" @click="$emit('on-open')" small>
        mdi-{{ icon }}
      </v-icon>
    </template>
    <v-card class="pa-1">
      <v-card-title class="headline">
        {{ title }}
        <v-spacer />
        <app-button color="dark" @button-pressed="hide" icon svg="close" />
      </v-card-title>
      <div class="pa-5">
        <v-card-text>
          <slot name="content" />
        </v-card-text>
      </div>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <app-button
          label="Confirm"
          @button-pressed="
            $emit('on-confirm');
            hide();
          "
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {handleComponentVisibilityMixin} from '@/utils/mixins/handle-states';
export default {
  name: 'dialog-popup',
  description: 'description',
  mixins: [handleComponentVisibilityMixin],
  data: () => ({}),
  components: {},
  props: {
    title: {type: String},
    icon: String,
    margin: {type: String, default: 'ma-2'},
  },
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>
