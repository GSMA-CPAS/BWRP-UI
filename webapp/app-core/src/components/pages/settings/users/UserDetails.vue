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
                            User Details
                        </v-card-title>
                        <v-form ref="formUpdateUser" v-model="valid" lazy-validation @submit.prevent="updateUser">
                            <v-card-text>
                                <v-text-field v-model="user.username" color="secondary" disabled></v-text-field>
                                <v-text-field v-model="user.forename" label="First name" color="secondary"></v-text-field>
                                <v-text-field v-model="user.surname" label="Last name" color="secondary"></v-text-field>
                                <v-text-field v-model="user.email" label="E-Mail" color="secondary" :rules="[rules.email]"></v-text-field>
                            </v-card-text>
                            <v-card-actions class="pa-4">
                                <v-btn type="submit" color="primary" tile>Update User</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-row>
                <v-col cols="12" lg="6">
                    <v-card>
                        <v-card-title>
                            User Certificate
                        </v-card-title>
                        <v-card-actions class="pa-4">
                            <v-btn color="primary" tile @click="showCertificateDialog = true">Show certificate</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-row v-if="user.username !== 'admin'">
                <v-col cols="12" lg="6">
                    <v-card>
                        <v-card-title>
                            Reset Password
                        </v-card-title>
                        <v-form ref="formResetPassword" v-model="valid" lazy-validation @submit.prevent="resetPassword">
                            <v-card-text>
                                <v-text-field v-model="newPasswordReset" label="New Password" color="secondary" :rules="[rules.required, rules.password]"></v-text-field>
                            </v-card-text>
                            <v-card-actions class="pa-4">
                                <v-btn type="submit" color="primary" tile>Reset password</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="showCertificateDialog" persistent width="640">
            <v-card>
                <v-card-title class="headline">Certificate</v-card-title>
                <v-card-text>
                    <span v-html="certificateHtml"></span>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-btn color="primary" tile @click="showCertificateDialog = false">CLOSE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </layout>
</template>

<script>

    import Layout from '@/components/layouts/LayoutSettings';
    import { validationRules } from '@/utils/ValidationRules';

    export default {

        name: 'UserDetails',

        data: () => ({
            loading: true,
            breadcrumbItems: [
                {
                    text: 'Users'.toUpperCase(),
                    disabled: false,
                    exact: true,
                    to: '/settings/users'
                },
                {
                    text: 'Details'.toUpperCase(),
                    disabled: true
                }
            ],
            userId: null,
            user: {
                username: "",
                forename: "",
                surname: "",
                email: "",
                active: true
            },
            certificateData: {
                notBefore: "",
                notAfter: "",
                issuer: {},
                subject: {},
                attributes: {}
            },
            certificateHtml: "",
            newPasswordReset: "",
            showCertificateDialog: false,
            valid: true,
            rules: validationRules
        }),

        created: function() {
            this.userId = this.$route.params.id;
            setTimeout(() => {
                this.fetchUser();
            }, 100);
        },

        methods: {

            fetchUser() {
                this.$http({method:'get', url: '/api/v1/users/' + this.userId, withCredentials: true}).then((response) => {
                    this.loading = false;
                    this.user = response.data;
                    this.certificateHtml = this.user.certificate.replace(/(?:\r\n|\r|\n)/g, '<br/>');
                    if (this.user.certificateData) {
                        this.certificateData.validFrom = this.user.certificateData.validFrom;
                        this.certificateData.validTo = this.user.certificateData.validTo;
                        this.certificateData.issuer = this.user.certificateData.issuer.attributes;
                        this.certificateData.subject = this.user.certificateData.subject.attributes;
                        this.certificateData.attributes = this.user.certificateData.extensions.attributes;
                    }
                }).catch((error) => {
                    this.loading = false;
                    this.$modal.error(error);
                });
            },

            updateUser() {
                if (this.$refs.formUpdateUser.validate()) {
                    let data = {
                        forename: this.user.forename,
                        surname: this.user.surname,
                        email: this.user.email,
                        active: this.user.active,
                    };
                    this.loading = true;
                    this.$http({
                        method: 'put',
                        url: '/api/v1/users/' + this.user.id,
                        withCredentials: true,
                        data: data
                    }).then(() => {
                        this.loading = false;
                        this.$modal.info({
                            title: "Success",
                            message: 'User "' + this.user.username + '" has been updated successfully!'
                        });
                    }).catch(error => {
                        this.loading = false;
                        this.$modal.error(error);
                    });
                }
            },

            showCertificate() {
                this.$modal.info({message: 'info'});
            },

            resetPassword() {
                if (this.$refs.formResetPassword.validate()) {
                    const data = {
                        userId: this.user.id,
                        newPassword: this.newPasswordReset
                    };
                    this.$modal.confirm({
                        title: "Reset Password", message: "Are you sure?",
                        callbackOk: () => {
                            this.loading = true;
                            this.$http({
                                method: 'post',
                                url: '/api/v1/users/password/reset',
                                withCredentials: true,
                                data: data
                            }).then((/*response*/) => {
                                this.loading = false;
                                this.newPasswordReset = '';
                                this.$modal.info({
                                    title: "Success",
                                    message: "User password has been reset successfully!"
                                });
                            }).catch(error => {
                                this.loading = false;
                                this.$modal.error(error);
                            });
                        }
                    });
                }
            }
        },

        components: {
            Layout
        }
    }

</script>