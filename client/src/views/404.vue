<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex xs12 text-center>
        <div v-if="message">
          <h2 class="mb-3">{{message}}</h2>
          <p small>Todavia puedes hacer la Lectio Divina <a
               href="https://www.ciudadredonda.org/calendario-lecturas/evangelio-del-dia/hoy">Ingresa aquí
              para ver las lecturas del día</a> y después dirígete a la <router-link to="/lectio">seccion Lectio Divina
            </router-link>
          </p>
          <v-img src="../assets/holyFamilyWorking.jpg" max-width="300px"></v-img>
        </div>
        <v-progress-circular :size="70" :width="7" color="accent" indeterminate v-else></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      message: 'Temporalmente fuera de servicio, estamos trabajando para reparalo.'
    }
  },
  methods: {

  },
}
</script>
<style lang="sass">
  .v-responsive.v-image
    margin: 0 auto
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
    border-radius: 8px
</style>