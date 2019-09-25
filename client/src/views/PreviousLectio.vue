<template>
  <v-container fluid>
    <v-row>
      <v-col>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import lectioService from "../services/LectioService";

export default {
  async mounted () {
    await this.getTodaysGospel();
  },
  data () {
    return {
      evgDetails: {},
      readings: [],
      selection: '',
      snackbar: false
    };
  },
  computed: {
    // showReset () {
    //   return this.items.length < items.length
    // }
  },
  watch: {
    loading (val) {
      if (!val) {
        this.$nextTick(() => {
          this.addListeners();
        });
      }
    }
  },

  methods: {
    // getSelection () {
    //   const para = document.querySelector('p')

    //   para.addEventListener('pointerup', (event) => {
    //     console.log('Pointer down event')
    //     alert(window.getSelection())
    //   })
    // },
    async getTodaysGospel () {
      const response = await lectioService.getTodaysGospel();
      this.evgDetails = response.data;
      this.readings = response.data.data.readings;
      // this.addListeners();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>