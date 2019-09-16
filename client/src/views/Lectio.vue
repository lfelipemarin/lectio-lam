<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card class="mx-auto">
          <v-form ref="form" v-model="form" class="pa-4 pt-6">
            <v-textarea v-for="(step, index) in lectioDivina" v-bind:key="index" v-model="step.text" auto-grow filled
                        color="amber" :label="step.label" rows="6" :disabled="step.label=='Lectio'"
                        append-icon='mdi-help-circle'>
            </v-textarea>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn text @click="$refs.form.reset()">
              Clear
            </v-btn>
            <div class="flex-grow-1"></div>
            <v-btn :disabled="!form" :loading="isLoading" class="white--text" color="amber accent-4" depressed>
              Submit</v-btn>
          </v-card-actions>
          <v-dialog v-model="dialog" absolute max-width="400" persistent>
            <v-card>
              <v-card-title class="headline grey lighten-3">Legal</v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn text @click="agreement = false, dialog = false">
                  No
                </v-btn>
                <div class="flex-grow-1"></div>
                <v-btn class="white--text" color="amber accent-4" @click="agreement = true, dialog = false">
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    lectioDivina: {
      lectio: {
        label: 'Lectio',
        text: ''
      },
      meditatio: {
        label: 'Meditatio',
        text: ''
      },
      oratio: {
        label: 'Oratio',
        text: ''
      },
      contemplatio: {
        label: 'Contemplatio',
        text: ''
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
      console.log('lec', val)
      this.$store.dispatch('setLectioText', val)
    },
    'lectioDivina.meditatio.text': function (val) {
      console.log('lec', val)
      this.$store.dispatch('setMeditatioText', val)
    },
    'lectioDivina.oratio.text': function (val) {
      console.log('lec', val)
      this.$store.dispatch('setOratioText', val)
    },
    'lectioDivina.contemplatio.text': function (val) {
      console.log('lec', val)
      this.$store.dispatch('setContemplatioText', val)
    }
  },
  computed: {

  },
}
</script>
<style lang="scss" scoped>
</style>