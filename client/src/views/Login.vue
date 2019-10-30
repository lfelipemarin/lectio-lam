<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12" v-if="mode=='verifyEmail'">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation v-on:submit.prevent="validate">
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-account" type="text"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="error" @click="mode='login'">
              Cancelar
            </v-btn>
            <v-btn color="primary" :disabled="!valid" @click="validate" :loading="isLoading">Enviar</v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="elevation-12" v-else>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation @keyup.native.enter="validate">
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-account" type="text"></v-text-field>
              <v-text-field id="password" label="Password" name="password" prepend-icon="mdi-lock" v-model="password"
                            :rules="passwordRules" required :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="passwordShow ? 'text' : 'password'" @click:append="passwordShow = !passwordShow">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" :disabled="!valid" @click="validate" :loading="isLoading">
            <v-icon dark class="mr-2">mdi-login-variant</v-icon>              
              Ingresar</v-btn>
          </v-card-actions>
          <div class="d-flex caption pb-4 pl-4 justify-center flex-column text-center">
            <div class="pa-4">
              ó ingresa con
            </div>
            <div class="d-flex justify-center">
              <v-btn color="primary mr-3" @click="loginWithGoogle" :loading="isLoading">
                <v-icon dark>mdi-google</v-icon>
              </v-btn>
              <!-- <v-btn color="primary" @click="validate" :loading="isLoading">
                <v-icon dark>mdi-facebook</v-icon>
              </v-btn> -->
            </div>

          </div>

          <div :class="['pt-1','pl-4','caption']">¿No tienes cuenta? <router-link to="/signup">
              Créala aquí</router-link>.
          </div>
          <div :class="['pl-4','caption', !emailVerified?'':'pb-4']">¿Olvidaste la contraseña? <a @click="changeToVerifyEmail">Recupérala aquí</a>.
          </div>
          <div v-if="!emailVerified" class="caption pb-4 pl-4">¿No te llegó el correo de verificación? <a
               @click="sendVerificationEmail">Enviar de nuevo</a>.
          </div>
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
import _ from 'lodash'

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
      v => !!v || 'El campo Email es obligatorio',
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3}) *$/.test(v) || 'E-mail debe ser válido'

    ],
    password: '',
    passwordRules: [
      v => !!v || 'El campo Contraseña es obligatorio'
    ],
    error: null,
    snackbar: false,
    isLoading: false,
    user: null,
    emailVerified: true,
    mode: 'login'
  }),
  created () {
    this.checkRedirectGoogle()
  },
  methods: {
    validate () {
      if (this.$refs.form.validate() && this.mode == 'login') {
        this.login()
      } else if (this.$refs.form.validate() && this.mode == 'verifyEmail') {
        this.sendPasswordRecoveryEmail()
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    login () {
      this.isLoading = true
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
              this.isLoading = false
            } else {
              // doc.data() will be undefined in this case
              this.isLoading = false
            }
          }).catch((error) => {
            this.isLoading = false
            this.error = error
          });
        } else {
          this.snackbar = true
          this.error = 'Tu correo no ha sido verificado. Por favor revisa el mensaje de verificación en tu correo electrónico'
          this.isLoading = false

        }// eslint-disable-next-line
      }).catch((error) => {
        this.isLoading = false

        this.snackbar = true
        this.error = 'Nombre de Usuario/Contraseña inválidos'
      })

    },
    loginWithGoogle () {
      this.isLoading = true
      let provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/user.birthday.read')
      firebase.auth().signInWithRedirect(provider)
    },
    logout () {
      this.drawer = false
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
      }).catch(function (error) {
        this.error = error
        // An error happened.
      });

      this.resetStore()
      this.$router.push({
        name: 'login'
      })
    },
    sendVerificationEmail () {
      this.user.sendEmailVerification().then(() => {
        this.error = 'Se ha enviado el correo de verificación de nuevo'
        this.snackbar = true
      }).catch((error) => {
        this.error = error
      })
    },
    sendPasswordRecoveryEmail () {
      this.isLoading = true
      let auth = firebase.auth()
      auth.sendPasswordResetEmail(this.email).then(() => {
        this.error = `Se ha enviado un correo de recuperación a ${this.email}`
        this.snackbar = true
        this.mode = 'login'
        this.isLoading = false
      }).catch((error) => {
        this.error = error
        this.isLoading = false
      })
    },
    changeToVerifyEmail () {
      this.mode = 'verifyEmail'
    },
    checkRedirectGoogle () {
      this.isLoading = true
      firebase.auth().getRedirectResult().then((result) => {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          let token = result.credential.accessToken;

          AuthenticationService.getPersonFromGoogle('me', 'birthdays', token).then(resp => {
            let user = {}
            if (resp.data.birthdays) {
              console.log(resp.data.birthdays[1])
              let birthdate = ''
              _.each(resp.data.birthdays[1].date, (param) => {
                console.log(param)
                birthdate += param.toString() + '-'
              })
              user.birthdate = this.$moment(new Date(birthdate.slice(0, -1))).format('YYYY-MM-DD') || ''
            }

            var docRef = db.collection("users").doc(result.additionalUserInfo.profile.email);

            docRef.get().then((doc) => {
              if (doc.exists) {
                // result.user.getIdToken().then((data) => {
                //   this.$store.dispatch('setToken', data)
                // })
                this.$store.dispatch('setUser', doc.data())
                this.$store.dispatch('setToken', token)
                this.$router.push('/home')
                this.isLoading = false
              } else {
                user.firstName = result.additionalUserInfo.profile.given_name
                user.lastName = result.additionalUserInfo.profile.family_name
                user.email = result.additionalUserInfo.profile.email
                user.uid = result.user.uid
                user.createdAt = this.$moment().format()
                user.updatedAt = this.$moment().format()
                // doc.data() will be undefined in this case
                db.collection('users').doc(result.additionalUserInfo.profile.email).set(user)
                  .then(() => {
                    this.$store.dispatch('setUser', user)
                    this.$store.dispatch('setToken', token)
                    this.$router.push('/home')
                    this.isLoading = false
                  }).catch((error) => {
                    this.isLoading = false
                    this.error = error
                  })
              }
            }).catch((error) => {
              this.isLoading = false
              this.error = error
            });
          })
        }
        this.isLoading = false
      }).catch((error) => {
        // Handle Errors here.
        this.isLoading = false
        this.error = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
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
