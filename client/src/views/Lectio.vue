<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-form ref="form" v-model="form" class="pa-4 pt-6">
            <v-textarea v-for="(step, index) in lectioDivina" v-bind:key="index" v-model="step.text" auto-grow filled
                        color="amber" :label="step.label" rows="6">
              <v-tooltip slot="append" top open-on-hover>
                <template #activator="{ on }">
                  <v-icon color="primary" class="mr-1" v-on="on" size="40">mdi-help-circle</v-icon>
                </template>
                <span>{{step.tooltip}}</span>
              </v-tooltip>
            </v-textarea>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text @click="$refs.form.reset()">
              Limpiar
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn :disabled="!form" :loading="isLoading" class="white--text" color="amber accent-4" depressed>
              Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['copiedLectioText'],
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
        tooltip: 'Haz un pequeño compromiso que puedas cumplir'
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
    rules: {
      email: v => (v || '').match(/@/) || 'Please enter a valid email',
      length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,
      password: v => (v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
        'Password must contain an upper case letter, a numeric character, and a special character',
      required: v => !!v || 'This field is required',
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
      this.lectioDivina.lectio.text = this.$store.state.lectioDivina.lectioText
      this.lectioDivina.meditatio.text = this.$store.state.lectioDivina.meditatioText
      this.lectioDivina.oratio.text = this.$store.state.lectioDivina.oratioText
      this.lectioDivina.contemplatio.text = this.$store.state.lectioDivina.contemplatioText
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