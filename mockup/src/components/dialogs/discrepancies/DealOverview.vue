<template>
  <v-container fluid class="ml-8">
    <v-row>
      <v-col cols="4">
        <v-row>
          <span>Deal: xyz 2020 - 2021</span>
        </v-row>
        <v-row>
          <span>Partner: {{partner}}</span>
        </v-row>
        <v-row>
          <span>Own TADIGS: </span>
          <span v-for="(ot,index)  in ownTadigs" :key="ot">
            <span v-if="index !== ownTadigs.length - 1">
               {{ot}},
            </span>
            <span v-if="index === ownTadigs.length - 1">
               {{ot}}
            </span>
          </span>
        </v-row>
        <v-row>
          <span>Partner TADIGS: </span>
          <span v-for="(pt,index) in partnerTadigs" :key="pt">
            <span v-if="index !== partnerTadigs.length - 1">
               {{pt}},
            </span>
            <span v-if="index === partnerTadigs.length - 1">
               {{pt}}
            </span>
          </span>
        </v-row>
      </v-col>
      <v-col cols="4">
        <span>Currency: {{currency}}</span>

      </v-col>
      <v-col cols="4">
        <v-row>
          <span>Total revenue commitment: </span>
        </v-row>
        <v-row>
          <span>MOC revenue commitment: </span>
        </v-row>
        <v-row>
          <span>SMS revenue commitment: </span>
        </v-row>
        <v-row>
          <span>Data revenue commitment: </span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'discrepancies-deal-overview',
  description: 'Discrepancies Deal Overview',
  props: { isHome: Boolean },
  data() {
    if(this.isHome){
      return {
        partner: 'TMPL',
        ownTadigs: ['OWNT1', 'OWNT2', 'OWN3'],
        partnerTadigs: ['PWNT1', 'PWNT2', 'PWN3'],
        currency: 'EUR'
      };
    } else {
      return {
        partner: 'DTAG',
        ownTadigs: ['PWNT1', 'PWNT2', 'PWN3'],
        partnerTadigs: ['OWNT1', 'OWNT2', 'OWN3'],
        currency: 'EUR'
      };
    }
  },
  computed: {
    contract: {},
  }
};
</script>

<style scoped>

</style>
