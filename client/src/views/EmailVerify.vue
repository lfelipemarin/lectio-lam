<template>
  <v-container grid-list-xs fill-height class="flex-column" justify-center>
    <v-row align="center" justify="center" class="mb-5 flex-column">
      <h1 class="mb-3 text-center">{{message}}</h1>
      <v-icon class="mb-6" size="130" :color="valid?'success':'error'">{{valid?'mdi-check-decagram':'mdi-cancel'}}
      </v-icon>
      <v-btn outline color="primary" dark to="/login">Ir a la página de ingreso</v-btn>
    </v-row>
  </v-container>
</template>

<script>
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");

export default {
  data () {
    return {
      message: '',
      valid: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      let auth = firebase.auth()
      let actionCode = this.$route.query.oobCode
      let continueUrl = this.$route.query.continueUrl
      let lang = this.$route.query.lang
      if (!actionCode) {
        this.$router.push('/')
      }
      this.handleVerifyEmail(auth, actionCode, continueUrl, lang)
    })
  },
  methods: {
    // eslint-disable-next-line
    handleVerifyEmail (auth, actionCode, continueUrl, lang) {
      // Localize the UI to the selected language as determined by the lang
      // parameter.
      // Try to apply the email verification code.
      // eslint-disable-next-line
      auth.applyActionCode(actionCode).then((resp) => {
        // Email address has been verified.
        this.valid = true
        this.message = 'Tu dirección de correo ha sido verificada'
        // eslint-disable-next-line
      }).catch((error) => {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        this.valid = false
        this.message = 'El enlace de verificación de correo ha expirado'
      });
    }
  },
};
</script>