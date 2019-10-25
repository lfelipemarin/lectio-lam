<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12">
        <h2>Lectio</h2>
        <p>{{lectioInfo.lectio}}</p>
        <h2>Meditatio</h2>
        <p>{{lectioInfo.meditatio}}</p>
        <h2>Oratio</h2>
        <p>{{lectioInfo.oratio}}</p>
        <h2>Actio</h2>
        <p>{{lectioInfo.actio}}</p>
        <v-checkbox v-model="lectioInfo.completedActio" @change="changeCompletedActio(lectioInfo.completedActio)"
                    label="¿Cumpliste el compromiso?">
        </v-checkbox>

      </v-col>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>Ver lecturas del ese día</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p v-html="todaysReadings"></p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=4000>
          Compromiso {{lectioInfo.completedActio?'cumplido':'no cumplido'}}
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
  <v-container fill-height v-else>
    <v-layout align-center>
      <v-flex xs12 text-center>
        <v-progress-circular :size="70" :width="7" color="amber" indeterminate></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import lectioService from "../services/LectioService";

export default {
  data () {
    return {
      todaysReadings: null,
      lectioInfo: null,
      loading: true,
      snackbar: false
    };
  },
  mounted () {
    lectioService.getDateReadings(this.$moment(this.$route.params.date).format('YYYYMMDD'), 'SP', 'all').then((readings) => {
      this.todaysReadings = readings.data
    })
    let user = this.$store.state.user
    // Listener for lectio changes
    lectioService.getLectioByCreatedDate(user, this.$route.params.date).onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.lectioInfo = doc.data()
        this.loading = false
      })
      if (this.lectioInfo) {
        this.$store.dispatch('updateLectio', this.lectioInfo)
      }
    })
  },
  methods: {
    changeCompletedActio (value) {
      let user = this.$store.state.user
      const now = this.$moment().format()
      lectioService.updateLectio(this.lectioInfo, user, { completedActio: value, updatedAt: now }).then(() => {
        this.snackbar = true
      }).catch((error) => {
        this.error = error
      })
    },
  },
};
</script>