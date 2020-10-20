<template>
    <layout :loading="loading" :navbar=false>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-6">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Two-factor authentication</v-toolbar-title>
                    </v-toolbar>
                    <v-form ref="formVerify" v-model="valid" lazy-validation @submit.prevent="verify">
                        <v-card-text>
                            <v-text-field v-model="token" label="Enter code..." :rules="[rules.required]" autofocus></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn type="submit" color="primary" tile block large>Verify</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </layout>
</template>

<script>

    import Layout from '@/components/layouts/LayoutNoNavbar';
    import { validationRules } from '@/utils/ValidationRules';

    export default {

        name: 'TwoFactor',

        data: () => ({
            loading: false,
            token: '',
            valid: true,
            rules: validationRules
        }),

        methods: {

            verify() {
                if (this.$refs.formVerify.validate()) {
                    const data = {token: this.token};
                    this.$http({
                        method: 'post',
                        url: '/api/v1/users/2fa/verify',
                        data,
                        withCredentials: true
                    }).then((response) => {
                        if (response.data.success) {
                            localStorage.setItem('appContext', JSON.stringify(response.data.appContext));
                            this.$router.push('/');
                        } else {
                            this.$modal.error({message: 'Code is incorrect'});
                        }
                    }).catch(error => {
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