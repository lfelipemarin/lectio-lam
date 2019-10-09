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
            <v-btn color="primary" :disabled="!valid" @click="validate" :loading="loading">Login</v-btn>
          </v-card-actions>
          <v-subheader>¿No tienes cuenta?&nbsp;<router-link to="/signup">Créala aquí.</router-link>
          </v-subheader>
        </v-card>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=4000>
          Nombre de Usuario/Contraseña inválidos
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
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password and Confirm password Required'
    ],
    error: null,
    snackbar: false,
    loading: false
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
      this.email = this.email.toLowerCase()
      AuthenticationService.login({
        email: this.email,
        password: this.password
      }).then((user) => {
        var docRef = db.collection("users").doc(this.email);

        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            user.user.getIdToken().then((data) => {
              this.$store.dispatch('setToken', data)
            })
            this.$store.dispatch('setUser', doc.data())
            this.$router.push({
              name: 'home'
            })
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
      }).catch((error) => {
        this.loading = false

        this.snackbar = true
        this.error = error
      })

    }

  }
};
</script>
