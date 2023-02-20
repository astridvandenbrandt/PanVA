<template>
  <UserInterface />
</template>

<script>

import { mapActions, mapMutations, mapState } from 'vuex'
import UserInterface from '../src/layout/UserInterface'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export default {
  name: 'App',
  components: {

    UserInterface,
  },
  methods: {
    ...mapActions([
      'fetchHomologyIds',
      'fetchAlignedPositions',
      'fetchSequences',
      'fetchVarPosCount',
      'fetchPhenos',
      'fetchDendrogramDefault',
    ]),
    ...mapMutations(['setIsDataLoaded']),
  },
  computed: {
    ...mapState(['chosenHomologyId']),
  },
  mounted() {
    // console.log('App mounted')
  },
  created() {
    // console.log('App created')

    Promise.all([
      this.fetchHomologyIds(),
      this.fetchAlignedPositions(this.chosenHomologyId),
      this.fetchSequences(this.chosenHomologyId),
      this.fetchVarPosCount(this.chosenHomologyId),
      this.fetchPhenos(this.chosenHomologyId),
      this.fetchDendrogramDefault(this.chosenHomologyId),
    ]).then(() => {
      this.setIsDataLoaded(true)
    })
  },
}
</script>

<style>
    #app{
    color: #253545
  }

  /* important for hiding scrollbars on Chrome, Safari */
  ::-webkit-scrollbar {
    display: none;
    }

  .ant-layout{
    background-color: white !important;

  }

  .ant-btn-circle.ant-btn-sm {
    background-color: transparent !important;
  }

  .ant-btn-icon-only.ant-btn-sm {
    background-color: transparent !important;
  }

  .form-select {
    background-color: transparent !important;
    font-size: 10px !important;
  }

  /**
  Bugfix for antd: plus and min icons are not shown on small buttons in Firefox.
  https://github.com/ant-design/ant-design/commit/15524df9414d3d44235674b3328fad3ef50714d1
 */
  .ant-btn .anticon.anticon-plus > svg,
  .ant-btn .anticon.anticon-minus > svg {
    shape-rendering: auto !important;
  }
</style>
