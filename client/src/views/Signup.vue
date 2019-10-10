<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Registro</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-at" type="text"></v-text-field>
              <v-text-field id="firstName" label="Nombres" name="firstName" prepend-icon="mdi-textbox"
                            v-model="firstName" :rules="nameRules" required>
              </v-text-field>
              <v-text-field id="lastName" label="Apellidos" name="lastName" prepend-icon="mdi-textbox"
                            v-model="lastName" :rules="nameRules" required>
              </v-text-field>
              <template>
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                        min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="birthdate" label="Fecha de nacimiento" prepend-icon="mdi-calendar" readonly
                                  v-on="on">
                    </v-text-field>
                  </template>
                  <v-date-picker ref="picker" v-model="birthdate" :max="new Date().toISOString().substr(0, 10)"
                                 min="1950-01-01" @change="save"></v-date-picker>
                </v-menu>
              </template>
              <v-text-field id="password" label="Contraseña" name="password" prepend-icon="mdi-lock" v-model="password"
                            :rules="passwordRules" required :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'" @click:append="passwordShow = !passwordShow">
              </v-text-field>
              <v-text-field id="confirm-password" label="Confirmar Contraseña" name="confirm-password"
                            prepend-icon="mdi-lock" v-model="confirmPassword" :rules="passwordRules" required
                            :append-icon="confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="confirmPasswordShow ? 'text' : 'password'"
                            @click:append="confirmPasswordShow = !confirmPasswordShow">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" @click="reset">
              Limpiar Formulario
            </v-btn>
            <v-btn color="primary" :disabled="!valid" @click="validate">Registrarse</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import moment from 'moment'
const firebase = require("firebase/app");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore()
// import _ from 'lodash'

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
      v => !!v || 'El campo Email es obligatorio',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail debe ser válido'
    ],
    firstName: '',
    nameRules: [
      v => !!v || 'El campo Nombres es obligatorio'
    ],
    lastName: '',
    password: '',
    confirmPassword: '',
    // passwordRules: [
    //   v => !!v || 'El campo Contraseña es obligatorio',
    //   v => (!!v && v) === this.confirmPassword || 'Las contraseñas no coinciden'
    // ],
    birthdate: null,
    menu: false,
    response: null,
    error: null
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
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
    register () {
      let credentials = {
        email: this.email.toLowerCase().trim(),
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
        birthdate: this.birthdate,
        createdAt: moment().format(),
        updatedAt: moment().format()
      }
      AuthenticationService.register(credentials)
        .then((user) => {
          // User is signed in.
          delete credentials.password
          credentials.uid = user.user.uid

          db.collection('users').doc(credentials.email).set(credentials)
            .then(() => {
              console.log('success')
              user.user.getIdToken().then((data) => {
                this.$store.dispatch('setToken', data)
              })
              this.$store.dispatch('setUser', credentials)
              this.$router.push({
                name: 'home'
              })
            }).catch((error) => {
              console.log('Error adding document', error)
              this.error = error
            })
        })
        .catch((error) => {
          // Handle Errors here.
          let errorCode = error.code
          let errorMessage = error.message
          console.log('Auth errors', errorCode, errorMessage)
          this.error = `${error.errorCode} ${error.errorMessage}`
        })
    },
    registerWithFirebase () {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signUpAction', user)
    }
  },
  computed: {
    passwordRules () {
      // debugger
      const rules = []
      let rule = v => !!v || 'El campo Contraseña es obligatorio'
      rules.push(rule)
      rule =
        v => (v || '').length >= 6 ||
          `La contraseña debe tener mas de 6 caracteres`

      rules.push(rule)
      if (this.password) {
        rule = v => (!!v && v) === this.password || 'Las contraseñas no coinciden'
        rules.push(rule)
      }
      return rules
    },
  }
};
</script>
