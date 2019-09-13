<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Signup</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-account" type="text"></v-text-field>
              <v-text-field id="firstName" label="First Name" name="firstName" prepend-icon="mdi-lock"
                            v-model="firstName" :rules="nameRules" required>
              </v-text-field>
              <v-text-field id="lastName" label="Last Name" name="lastName" prepend-icon="mdi-lock" v-model="lastName"
                            :rules="nameRules" required>
              </v-text-field>
              <v-text-field id="password" label="Password" name="password" prepend-icon="mdi-lock" v-model="password"
                            :rules="passwordRules" required :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'" @click:append="passwordShow = !passwordShow">
              </v-text-field>
              <v-text-field id="confirm-password" label="Confirm Password" name="confirm-password"
                            prepend-icon="mdi-lock" v-model="confirmPassword" :rules="passwordRules" required
                            :append-icon="confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="confirmPasswordShow ? 'text' : 'password'"
                            @click:append="confirmPasswordShow = !confirmPasswordShow">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" :disabled="!valid" @click="validate">Signup</v-btn>
            <v-btn color="error" @click="reset">
              Reset Form
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    passwordShow: false,
    confirmPasswordShow: false,
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    firstName: '',
    nameRules: [
      v => !!v || 'First Name and Last Name Required'
    ],
    lastName: '',
    password: '',
    confirmPassword: '',
    passwordRules: [
      v => !!v || 'Password and Confirm password Required'
    ]
  }),
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
        // this.registerWithFirebase()
        this.register()
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    async register () {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'home'
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    registerWithFirebase () {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signUpAction', user)
    }
  }
};
</script>
