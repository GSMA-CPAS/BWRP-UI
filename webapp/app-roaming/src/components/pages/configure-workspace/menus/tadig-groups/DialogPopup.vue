<template>
  <v-dialog width="50vw" v-model="component">
    <template v-slot:activator="{on}">
      <v-icon :class="margin" v-on="on" @click="$emit('on-open')" small>
        mdi-{{ icon }}
      </v-icon>
    </template>
    <v-card class="pa-1">
      <v-card-title class="headline">
        {{ title }}
        <v-spacer />
        <v-icon color="dark" @click="hide">mdi-close</v-icon>
      </v-card-title>
      <div>
        <v-card-text>
          <slot name="content" />
        </v-card-text>
      </div>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <app-button plain label="Cancel" @button-pressed="hide" />
        <app-button
          label="Confirm"
          :disabled="disabled"
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
    disabled: {type: Boolean},
  },
  watch: {},
  methods: {},
  computed: {},
  mounted() {},
};
</script>
