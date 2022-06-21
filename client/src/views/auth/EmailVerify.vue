<template>
  <v-container grid-list-xs fill-height justify-center>
    <v-row align="center" justify="center" v-if="mode=='resetPassword'">
      <v-col cols="12" sm="8" md="4" class="text-center">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" :rules="emailRules" required label="Email" name="login"
                            prepend-icon="mdi-account" type="text"></v-text-field>
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
            <v-btn color="error" @click="mode='login'">
              Cancelar
            </v-btn>
            <v-btn color="primary" :disabled="!valid" @click="validate" :loading="isLoading">Enviar</v-btn>
          </v-card-actions>
        </v-card>
        <v-btn v-if="validNewPass" class="mt-5" color="primary" dark to="/login">Ir a la página de ingreso</v-btn>
        <v-snackbar v-model="snackbar" multi-line color="warning" :timeout=6000>
          {{message}}
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row align="center" justify="center" class="mb-5 flex-column" v-else>
      <h1 class="mb-3 text-center">{{message}}</h1>
      <v-icon class="mb-6" size="130" :color="validEmail?'success':'error'">
        {{validEmail?'mdi-check-decagram':'mdi-cancel'}}
      </v-icon>
      <v-btn color="primary" dark to="/login">Ir a la página de ingreso</v-btn>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable */
const firebase = require("firebase/app");
// Add the Firebase products that you want to use
require("firebase/auth");
const auth = firebase.auth()

export default {
  data () {
    return {
      message: '',
      validEmail: false,
      validNewPass: false,
      valid: true,
      snackbar: false,
      mode: '',
      actionCode: '',
      email: '',
      emailRules: [
        v => !!v || 'El campo Email es obligatorio',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3}) *$/.test(v) || 'E-mail debe ser válido'
      ],
      password: '',
      confirmPassword: '',
      passwordShow: false,
      confirmPasswordShow: false,
      isLoading: false,
      error: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.actionCode = this.$route.query.oobCode
      let continueUrl = this.$route.query.continueUrl
      this.mode = this.$route.query.mode
      let lang = this.$route.query.lang
      if (!this.actionCode) {
        this.$router.push('/')
      }
      switch (this.mode) {
        case 'verifyEmail':
          this.handleVerifyEmail(auth, this.actionCode, continueUrl, lang)
          break;
        case 'resetPassword':
          this.handleResetPassword(auth, this.actionCode, continueUrl, lang)
          break;
        default:
          break;
      }
    })
  },
  methods: {
    validate () {
      this.isLoading = true
      if (this.$refs.form.validate()) {
        // Save the new password.
        auth.confirmPasswordReset(this.actionCode, this.password).then((resp) => {
          // Password reset has been confirmed and new password updated.
          this.validNewPass = true
          this.snackbar = true
          this.message = 'Contraseña cambiada correctamente'
          this.isLoading = false

        }).catch((error) => {
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
          this.error = error
          this.validNewPass = false
          this.message = 'El enlace de verificación de correo ha expirado'
          this.isLoading = false
        });
      }
    },
    handleVerifyEmail (auth, actionCode, continueUrl, lang) {
      // Localize the UI to the selected language as determined by the lang
      // parameter.
      // Try to apply the email verification code.
      auth.applyActionCode(actionCode).then((resp) => {
        // Email address has been verified.
        this.validEmail = true
        this.message = 'Tu dirección de correo ha sido verificada'
      }).catch((error) => {
        // Code is invalid or expired. Ask the user to verify their email address
        // again.
        this.validEmail = false
        this.message = 'El enlace de verificación de correo ha expirado'
      })
    },
    handleResetPassword (auth, actionCode, continueUrl, lang) {
      // Localize the UI to the selected language as determined by the lang
      // parameter.
      // Verify the password reset code is valid.
      auth.verifyPasswordResetCode(actionCode).then((email) => {
        this.email = email

      }).catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
        this.error = error
        this.validEmail = false
        this.message = 'El enlace de verificación de correo ha expirado'
      })
    }
  },
  computed: {
    passwordRules () {
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