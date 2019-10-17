<template>
  <v-container fluid v-if="!loading">
    <v-row>
      <v-col cols="12">
        <h2>Lectio</h2>
        <p>{{lectioInfo[0].lectio}}</p>
        <h2>Meditatio</h2>
        <p>{{lectioInfo[0].meditatio}}</p>
        <h2>Oratio</h2>
        <p>{{lectioInfo[0].oratio}}</p>
        <h2>Actio</h2>
        <p>{{lectioInfo[0].actio}}</p>
        <v-checkbox v-model="lectioInfo[0].completedActio" @change="changeCompletedActio(lectioInfo[0].completedActio)"
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
          Compromiso {{lectioInfo[0].completedActio?'cumplido':'no cumplido'}}
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
import moment from 'moment'
import lectioService from "../services/LectioService";
import _ from 'lodash'

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
    lectioService.getDateReadings(moment(this.$route.params.date).format('YYYYMMDD'), 'SP', 'all').then((readings) => {
      this.todaysReadings = readings.data
    })
    let user = this.$store.state.user
    lectioService.getLectioByCreatedDate(user, this.$route.params.date).then((collection) => {
      this.lectioInfo = _.map(collection.docs, (doc) => {
        this.loading = false
        return doc.data()
      })
      this.loading = false
    }).catch((error) => {
      this.loading = false
      console.log('lectio archive', error)
      this.error = error
    })
  },
  methods: {
    changeCompletedActio (value) {
      let user = this.$store.state.user
      lectioService.updateLectio(this.lectioInfo[0], user, { completedActio: value }).then(() => {
        // this.isLoading = false
        this.snackbar = true
        console.log('All good')
      }).catch((error) => {
        // this.isLoading = false
        console.log('lectio error', error)
        this.error = error
      })
    },
  },
};
</script>