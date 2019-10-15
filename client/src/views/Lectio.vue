<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-form ref="form" v-model="form" class="pa-4 pt-6">
            <v-banner elevation=5 class="mb-7">
              <h3 class="mb-1">Espíritu Santo</h3>
              Invoca al Espíritu Santo. Pídele que te ilumine y te abra a la comprensión de la Palabra y que te anime a
              la respuesta con tu vida.
              <template v-slot:actions>
                <v-btn text color="amber accent-4" to="/readings">
                  Ir a las lecturas
                </v-btn>
              </template>
            </v-banner>
            <div v-for="(step, index) in lectioDivina" v-bind:key="index">
              <v-textarea v-model="step.text" auto-grow filled color="amber" :label="step.label" rows="6"
                          :rules="rules.required" v-if="!step.type">
                <v-tooltip slot="append" top open-on-hover>
                  <template #activator="{ on }">
                    <v-icon color="primary" class="mr-1" v-on="on" size="40">mdi-help-circle</v-icon>
                  </template>
                  <span>{{step.tooltip}}</span>
                </v-tooltip>
              </v-textarea>
              <v-banner elevation=5 class="mb-7" v-else>
                <h3 class="mb-1">{{step.label}}</h3>
                {{step.tooltip}}
              </v-banner>
            </div>
            <v-checkbox v-model="lectioDivina.actio.reminder" label="¿Recordar compromiso?"></v-checkbox>

          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text @click="$refs.form.reset()">
              Limpiar
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn :disabled="!form" :loading="isLoading" class="white--text" color="amber accent-4" depressed
                   @click="saveLectio">
              Guardar</v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" multi-line color="info" :timeout=4000>
          Lectio Guardada
          <v-btn color="white" text @click="snackbar = false">
            Cerrar
          </v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import lectioService from "../services/LectioService"
import moment from 'moment'

export default {
  props: ['copiedLectioText', 'readings'],
  data: () => ({
    lectioDivina: {
      lectio: {
        label: 'Lectio',
        text: '',
        tooltip: '¿Qué dice el texto? ¿Qué sucede en este pasaje del evangelio?'
      },
      meditatio: {
        label: 'Meditatio',
        text: '',
        tooltip: '¿Qué me dice Dios en este texto?'
      },
      oratio: {
        label: 'Oratio',
        text: '',
        tooltip: '¿Qué le quiero decir yo a Dios sobre este texto?'
      },
      contemplatio: {
        label: 'Contemplatio',
        tooltip: 'Quédate impresionado, fascinado, en silencio, en calma. Déjate animar por el ardor de la Palabra, como quien recibe el calor del sol.',
        type: 'banner'
      },
      actio: {
        label: 'Actio',
        text: '',
        tooltip: 'Haz un pequeño compromiso que puedas cumplir',
        reminder: false
      }
    },
    agreement: false,
    bio: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts',
    dialog: false,
    email: undefined,
    form: false,
    isLoading: false,
    password: undefined,
    phone: undefined,
    error: null,
    rules: {
      required: [v => !!v || 'Este campo es requerido'],
    },
    snackbar: false
  }),
  mounted () {
    this.init()
    this.$nextTick(() => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 500);
      if (this.copiedLectioText) {
        this.lectioDivina.lectio.text = this.copiedLectioText
      }
    })
  },
  methods: {
    init () {
      this.lectioDivina.lectio.text = this.$store.state.lectioDivina.lectioText || ''
      this.lectioDivina.meditatio.text = this.$store.state.lectioDivina.meditatioText || ''
      this.lectioDivina.oratio.text = this.$store.state.lectioDivina.oratioText || ''
      this.lectioDivina.actio.text = this.$store.state.lectioDivina.actioText || ''
      this.lectioDivina.actio.reminder = this.$store.state.lectioDivina.actioReminder || false
    },
    saveLectio () {
      this.isLoading = true
      let lectioToSave = {
        lectio: this.lectioDivina.lectio.text,
        meditatio: this.lectioDivina.meditatio.text,
        oratio: this.lectioDivina.oratio.text,
        actio: this.lectioDivina.actio.text,
        reminder: this.lectioDivina.actio.reminder,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
      }
      let user = this.$store.state.user
      lectioService.saveLectio(lectioToSave, user).then(() => {
        this.isLoading = false
        this.$refs.form.reset()
        this.lectioDivina.actio.reminder = false
        this.snackbar = true
        console.log('All good')
      }).catch((error) => {
        this.isLoading = false
        console.log('lectio error', error)
        this.error = error
      })

    },
    resetForm () {
      this.$refs.form.reset()
      this.lectioDivina.actio.reminder = false
    }
  },
  watch: {
    'lectioDivina.lectio.text': function (val) {
      this.$store.dispatch('setLectioText', val)
    },
    'lectioDivina.meditatio.text': function (val) {
      this.$store.dispatch('setMeditatioText', val)
    },
    'lectioDivina.oratio.text': function (val) {
      this.$store.dispatch('setOratioText', val)
    },
    'lectioDivina.actio.text': function (val) {
      this.$store.dispatch('setActioText', val)
    },
    'lectioDivina.actio.reminder': function (val) {
      this.$store.dispatch('setActioReminder', val)
    }
  },
  computed: {

  },
}
</script>
<style lang="scss" scoped>
</style>