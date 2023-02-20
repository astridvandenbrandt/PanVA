<template>
  <UserInterface />
</template>

<script>
// import AddUser from '../src/components/AddUser'
// import Users from '../src/components/Users'
import UserInterface from '../src/layout/UserInterface'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { mapState, mapActions, mapMutations } from 'vuex'
dotenv.config()


export default {
  name: 'App',
  components: {
    // AddUser,
    // Users,
    UserInterface,
  },
  methods: {
  ...mapActions([
      'fetchHomologyIds',
      'fetchAlignedPositions',
      'fetchNucStructure',
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
    console.log('App mounted', this.chosenHomologyId)
  },
  created() {
    console.log('App created')
    // this.$store.dispatch('fetchHomologyIds')
    // console.log('store homology_ids from App', this.$store.state.homologyIds)
    // this.$store.dispatch(
    //   'fetchHomologyGroup',
    //   this.$store.state.chosenHomologyId
    // )
    // this.$store.dispatch('fetchAlignedPositions', {
    //   id: this.$store.state.chosenHomologyId,
    //   region: this.$store.state.selectedRegion,
    // })
    // this.$store.dispatch('fetchAlignedPositions', {
    //   id: this.$store.getters.chosenHomologyId,
    // })
    // this.$store.dispatch(
    //   'fetchDendrogramDefault',
    //   this.$store.getters.chosenHomologyId
    // )
    // this.$store.dispatch('fetchSequences', this.$store.getters.chosenHomologyId)
    // this.$store.dispatch('fetchVarPosCount', this.$store.getters.chosenHomologyId)
    // this.$store.dispatch('fetchNucStructure', this.$store.getters.chosenHomologyId)

    // this.$store.dispatch('fetchPhenos', this.$store.getters.chosenHomologyId)
    Promise.all([
      this.fetchHomologyIds(),
      this.fetchAlignedPositions(this.chosenHomologyId),
      this.fetchSequences(this.chosenHomologyId),
      this.fetchNucStructure(this.chosenHomologyId),
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
    /* color: white */
    color: #253545;
  }

  

  /* important for hiding scrollbars on Chrome, Safari */
  ::-webkit-scrollbar {
    display: none;
    }


  .ant-layout{
    /* background-color: #2c313c !important; */
    background-color: white !important;
  }

  .ant-btn-circle.ant-btn-sm {
    background-color: transparent !important;
  }

  .ant-btn-icon-only.ant-btn-sm {
    background-color: transparent !important;
    /* color: whitesmoke !important */
  }

  .form-select {
    /* background-color: #282c34 !important; */
    background-color: transparent !important;
    /* color: whitesmoke !important; */
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
