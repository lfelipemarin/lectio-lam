<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-form ref="form" v-model="form" class="pa-4 pt-6">
            <v-textarea v-for="(step, index) in lectioDivina" v-bind:key="index" v-model="step.text" auto-grow filled
                        color="amber" :label="step.label" rows="6" :rules="rules.required">
              <v-tooltip slot="append" top open-on-hover>
                <template #activator="{ on }">
                  <v-icon color="primary" class="mr-1" v-on="on" size="40">mdi-help-circle</v-icon>
                </template>
                <span>{{step.tooltip}}</span>
              </v-tooltip>
            </v-textarea>
            <v-checkbox v-model="lectioDivina.contemplatio.reminder" label="Recordar compromiso?"></v-checkbox>

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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import lectioService from "../services/LectioService";

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
  }),
  mounted () {
    this.init()
    this.$nextTick(() => {

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
      this.lectioDivina.contemplatio.text = this.$store.state.lectioDivina.contemplatioText || ''
    },
    async saveLectio () {
      try {
        const response = await lectioService.saveLectio({
          lectio: this.lectioDivina.lectio.text,
          meditatio: this.lectioDivina.meditatio.text,
          oratio: this.lectioDivina.oratio.text,
          contemplatio: this.lectioDivina.contemplatio.text,
          reminder: this.lectioDivina.contemplatio.reminder,
          UserId: this.$store.state.user.id
        })
        console.log('lectio save response ', response)
      } catch (error) {
        this.error = error.response.data.error

      }
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
    'lectioDivina.contemplatio.text': function (val) {
      this.$store.dispatch('setContemplatioText', val)
    }
  },
  computed: {

  },
}
</script>
<style lang="scss" scoped>
</style>