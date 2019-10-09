<template>
  <v-container grid-list-xs fill-height class="flex-column">
    <v-row align="center" justify="center">
      <img src="../assets/logo-lam-white.png"/>
    </v-row>
    <v-row v-if="!$store.state.isUserLoggedIn">
      <v-btn color="amber" class="mt-5 mr-5" to="/login">Ingresar</v-btn>
      <v-btn color="amber" class="mt-5" to="/signup">Registrarse</v-btn>
    </v-row>
  </v-container>
</template>

<script>

export default {

};
</script>
