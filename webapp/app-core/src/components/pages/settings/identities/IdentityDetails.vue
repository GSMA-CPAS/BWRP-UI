<template>
  <layout :loading="loading">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
        </v-col>
      </v-row>
      <v-row v-if="identity && identity.certificate">
        <v-col cols="12" lg="12">
          <v-card>
            <v-card-text>
              <v-simple-table>
                <tbody>
                <tr>
                  <td width="100px">Identity</td>
                  <td>{{identity.name}}</td>
                </tr>
                <tr>
                  <td>Issuer</td>
                  <td>{{x509.issuer}}</td>
                </tr>
                <tr>
                  <td>Subject</td>
                  <td>{{x509.subject}}</td>
                </tr>
                <tr>
                  <td>Not Before</td>
                  <td>{{x509.notBefore}}</td>
                </tr>
                <tr>
                  <td>Not After</td>
                  <td>{{x509.notAfter}}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary" tile @click="renewCertificate">Renew Certificate</v-btn>
              <v-btn type="submit" color="primary" tile @click="exportCertificate">Export Certificate</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </layout>
</template>

<script>

import Layout from '@/components/layouts/LayoutSettings';
import moment from 'moment';

export default {

  name: 'UserDetails',
  title: 'Identity Details',

  data: () => ({
    loading: true,
    breadcrumbItems: [
      {
        text: 'Signing Identities'.toUpperCase(),
        disabled: false,
        exact: true,
        to: '/settings/identities',
      },
      {
        text: 'Details'.toUpperCase(),
        disabled: true,
      },
    ],
    identityId: null,
    identity: null,
    x509: {
      issuer: null,
      subject: null,
      notBefore: null,
      notAfter: null
    },
  }),

  created: function() {
    this.identityId = this.$route.params.id;
    setTimeout(() => {
      this.fetchIdentity();
    }, 100);
  },

  methods: {
    fetchIdentity() {
      this.$http({
        method: 'get',
        url: '/api/v1/identities/' + this.identityId,
        withCredentials: true
      }).then((response) => {
        this.loading = false;
        this.identity = response.data;
        if (this.identity) {
          this.breadcrumbItems[1].text = this.identity.name.toUpperCase();
          if (!this.identity.certificate) {
            this.$modal.error({message: 'Failed to load identity certificate!'});
          } else {
            // this.certificateHtml = this.identity.certificate.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            const x509 = this.identity.x509;
            this.x509.issuer = x509.issuer.str;
            this.x509.subject = x509.subject.str;
            this.x509.notBefore = moment.unix(x509.notBefore).toDate();
            this.x509.notAfter = moment.unix(x509.notAfter).toDate();
          }
        } else {
          this.$modal.error({message: 'Failed to load identity!'});
        }
      }).catch((error) => {
        this.loading = false;
        this.$modal.error(error);
      });
    },
    exportCertificate() {
      const blob = new Blob([this.identity.certificate], {type: ' application/x-pem-file'});
      const filename = this.identity.name + '.pem';
      if (window.navigator.msSaveOrOpenBlob) { // ie11
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        const link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    renewCertificate() {
      this.$modal.confirm({
        title: 'Renew Identity Certificate', message: 'Are you sure you want to renew the certificate of the identity?',
        callbackOk: () => {
          this.loading = true;
          this.$http({
            method: 'post',
            url: '/api/v1/identities/' + this.identity.id + '/renew',
            withCredentials: true
          }).then((/* response */) => {
            this.$modal.info({
              title: 'Success',
              message: 'Identity certificate has been renewed successfully!',
              callbackOk: () => {
                this.fetchIdentity();
              },
            });
          }).catch((error) => {
            this.loading = false;
            this.$modal.error(error);
          });
        }
      });
    }
  },

  components: {
    Layout,
  },
};
</script>

<style scoped>
  table tr:hover {
    background-color: transparent !important;
  }
</style>
