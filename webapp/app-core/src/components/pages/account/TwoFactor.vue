<template>
    <layout :loading="loading">
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <v-breadcrumbs :items="breadcrumbItems" large></v-breadcrumbs>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-card>
                        <v-card-title>
                            Enable Two-factor authentication
                        </v-card-title>
                        <v-card-text>
                            To enable two-factor authentication you will need to have an authenticator app (such as Google Authenticator or Authy) installed on your mobile phone. Scan this QR code or enter the plain text key into the authenticator app and enter the code in the field below to activate two-factor authentication.
                        </v-card-text>
                        <v-card-text>
                            <img :src=qrCodeImageUrl>
                        </v-card-text>
                        <v-card-text>
                            Plain text key: {{twoFactor.secret}}
                        </v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="enableTwoFactorAuth">
                            <v-card-text>
                                <v-text-field v-model="twoFactor.token" label="Enter Code" :rules="[rules.required]"></v-text-field>
                            </v-card-text>
                            <v-card-actions  class="pa-4">
                                <v-btn type="submit" color="primary" tile>Activate</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </layout>
</template>

<script>

    import Layout from '@/components/layouts/LayoutAccount';
    import { validationRules } from '@/utils/ValidationRules';

    export default {

        name: 'SecurityTwoFactor',

        data: () => ({
            loading: false,
            breadcrumbItems: [
                {
                    text: 'Security'.toUpperCase(),
                    disabled: false,
                    exact: true,
                    to: '/account/security'
                },
                {
                    text: 'Two-factor'.toUpperCase(),
                    disabled: true
                },
            ],
            qrCodeImageUrl: "",
            twoFactor: {
                secret: "",
                token: ""
            },
            valid: true,
            rules: validationRules
        }),

        created: function() {
            setTimeout(() => {
                this.fetch2faSecret();
            }, 100);
        },

        methods: {

            fetch2faSecret() {
                this.$http({method:'get', url: '/api/v1/users/2fa/generate', withCredentials: true}).then((response) => {
                    this.loading = false;
                    this.twoFactor.secret = response.data.secret;
                    this.qrCodeImageUrl = response.data.qrCodeImageUrl;
                }).catch((error) => {
                    this.loading = false;
                    this.$modal.error(error);
                });
            },

            enableTwoFactorAuth() {
                if (this.$refs.form.validate()) {
                    this.$http({
                        method: 'post',
                        url: '/api/v1/users/2fa/enable',
                        withCredentials: true,
                        data: this.twoFactor
                    }).then((response) => {
                        this.loading = false;
                        if (response.data.success) {
                            this.$modal.info({
                                title: "Success",
                                message: "Two-factor authentication is now configured on your account."
                            });
                            this.$router.push({path: '/account/security'});
                        } else {
                            this.$modal.error({message: 'Invalid code'});
                        }
                    }).catch(error => {
                        this.loading = false;
                        this.$modal.error(error);
                    });
                }
            }
        },

        components: {
            Layout
        }
    }

</script>