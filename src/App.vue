<template>
  <UserInterface />
</template>

<script>
// import AddUser from '../src/components/AddUser'
// import Users from '../src/components/Users'
import UserInterface from '../src/layout/UserInterface'

export default {
  name: 'App',
  components: {
    // AddUser,
    // Users,
    UserInterface,
  },
  mounted() {
    console.log('App mounted')
  },
  created() {
    console.log('App created')
    this.$store.dispatch('fetchHomologyIds')
    // console.log('store homology_ids from App', this.$store.state.homologyIds)
    // this.$store.dispatch(
    //   'fetchHomologyGroup',
    //   this.$store.state.chosenHomologyId
    // )
    // this.$store.dispatch('fetchAlignedPositions', {
    //   id: this.$store.state.chosenHomologyId,
    //   region: this.$store.state.selectedRegion,
    // })
    this.$store.dispatch('fetchAlignedPositions', {
      id: this.$store.getters.chosenHomologyId,
    })
    this.$store.dispatch(
      'fetchDendrogramDefault',
      this.$store.getters.chosenHomologyId
    )
    this.$store.dispatch('fetchSequences', this.$store.getters.chosenHomologyId)
    this.$store.dispatch(
      'fetchVarPosCount',
      this.$store.getters.chosenHomologyId
    )
    this.$store.dispatch('fetchPhenos', this.$store.getters.chosenHomologyId)
  },
}
</script>

<style>
    #app{
    /* color: white */
    color: #253545
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
</style>
