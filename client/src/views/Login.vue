<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-account" type="text"></v-text-field>
              <v-text-field id="password" label="Password" name="password" prepend-icon="mdi-lock" v-model="password"
                            :rules="passwordRules" required :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'" @click:append="passwordShow = !passwordShow">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" @click="reset">
              Limpiar Formulario
            </v-btn>
            <v-btn color="primary" :disabled="!valid" @click="validate" :loading="loading">Ingresar</v-btn>
          </v-card-actions>
          <v-subheader :class="['pt-4', !emailVerified?'':'pb-4']">¿No tienes cuenta?&nbsp;<router-link to="/signup">
              Créala aquí</router-link>.
          </v-subheader>
          <v-subheader v-if="!emailVerified" class="pb-4">¿No te llegó el correo de verificación?&nbsp;<a
               @click="sendVerificationEmail">Enviar de
              nuevo</a>.
          </v-subheader>
        </v-card>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=6000>
          {{error}}
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
const firebase = require("firebase/app")
// Required for side-effects
require("firebase/firestore")
const db = firebase.firestore()

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    passwordShow: false,
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3}) *$/.test(v) || 'E-mail debe ser válido'

    ],
    password: '',
    passwordRules: [
      v => !!v || 'El campo Contraseña es obligatorio'
    ],
    error: null,
    snackbar: false,
    loading: false,
    user: null,
    emailVerified: true
  }),
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.login()
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    login () {
      this.loading = true
      this.email = this.email.toLowerCase().trim()
      AuthenticationService.login({
        email: this.email,
        password: this.password
      }).then((user) => {
        this.user = user.user
        this.emailVerified = this.user.emailVerified
        if (this.emailVerified) {
          var docRef = db.collection("users").doc(this.email);

          docRef.get().then((doc) => {
            if (doc.exists) {
              user.user.getIdToken().then((data) => {
                this.$store.dispatch('setToken', data)
              })
              this.$store.dispatch('setUser', doc.data())
              this.$router.push('/home')
              this.loading = false
            } else {
              // doc.data() will be undefined in this case
              this.loading = false

              console.log("No such document!");
            }
          }).catch((error) => {
            this.loading = false
            console.log("Error getting document:", error);
            this.error = error
          });
        } else {
          this.snackbar = true
          this.error = 'Tu correo no ha sido verificado. Por favor revisa el mensaje de verificación en tu correo electrónico'
          this.loading = false

        }// eslint-disable-next-line
      }).catch((error) => {
        this.loading = false

        this.snackbar = true
        this.error = 'Nombre de Usuario/Contraseña inválidos'
      })

    },
    sendVerificationEmail () {
      this.user.sendEmailVerification().then(() => {
        this.error = 'Se ha enviado el correo de verificación de nuevo'
        this.snackbar = true
      }).catch((error) => {
        console.log('send v email error', error)
      })
    }

  }
};
</script>
<style lang="sass" scoped>
  .v-subheader
    height: auto

  a
    text-decoration: underline

</style>
