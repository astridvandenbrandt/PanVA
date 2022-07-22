<template>
  <!-- <div> -->
  <div
    class="card"
    id="info-container"
    style="width: 100%; height: svgHeight * 3"
  >
    <div class="card-header" style="padding: 0 1em">
      {{ title }}
    </div>

    <ul class="list-group list-group-flush">
      <!-- <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <select
            id="chosenHomId"
            class="form-select form-select-sm select-style-small"
            aria-label=".form-select-sm example"
          >
            <option selected disabled>Load homology group</option>
            <option value="13803210">acnA</option>
            <option value="13803671">atpD</option>
            <option value="13805694">rfaL</option>
          </select>
  
        </li> -->
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        homology id:
        <span> {{ getHomologyInfoById.homology_id }} </span>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        class:
        <span>{{ getHomologyInfoById.class }} </span>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        members:
        <span class="badge rounded-pill bg-secondary">
          {{ getHomologyInfoById.members }}</span
        >
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-left"
      >
        nuc:
        <ul>
          <li>var sites: {{ getHomologyInfoById.variable_sites_nuc }}</li>
          <li>inf sites: {{ getHomologyInfoById.informative_sites_nuc }}</li>
          <li>
            pheno spec: {{ getHomologyInfoById.pheno_specific_changes_nuc }}
          </li>
        </ul>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-left"
      >
        prot:
        <ul>
          <li>var sites: {{ getHomologyInfoById.variable_sites_prot }}</li>
          <li>inf sites: {{ getHomologyInfoById.informative_sites_prot }}</li>
          <li>
            pheno spec: {{ getHomologyInfoById.pheno_specific_changes_prot }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
// import * as d3 from 'd3'
import { mapGetters } from 'vuex'

export default {
  name: 'HomologyInfo',
  props: {
    title: String,
  },
  data() {
    return {
      chosenId: '13803210',
    }
  },
  methods: {},
  computed: {
    ...mapGetters(['getHomologyInfoById']), //aligned positions from store, already transformed to csv object

    // getHomologyInfoById() {
    //   const tmpid = {
    //     homology_id: null,
    //     members: null,
    //     class: null,
    //     variable_sites_nuc: null,
    //     informative_sites_nuc: null,
    //     variable_sites_prot: null,
    //     informative_sites_prot: null,
    //     pheno_specific_changes_nuc: null,
    //     pheno_specific_changes_prot: null,
    //   }
    //   return this.$store.getters.getHomologyInfoById
    //     ? this.$store.getters.getHomologyInfoById
    //     : tmpid
    // },
  },
  mounted() {
    console.log('HomologyInfo mounted')
    // console.log('checking data', this.$store.state.homologyData.trees.nuc)

    // let vis = this;

    // d3.select('#chosenHomId').on('change', function () {
    //   //console.log('change rowSorting')
    //   let selectValue = d3.select('#chosenHomId').property('value')

    //   vis.$store.dispatch('setHomologyId', selectValue)
    //   console.log(vis.$store.getters.getPhenos)

    // })
  },
  created() {
    console.log('HomologyInfo created')
  },
}
</script>

<style>
.delete {
  font-size: 18px;
  cursor: pointer;
}

#info-container {
  background-color: transparent;
  color: white;
  border: 1px solid white !important;
}

.list-group-flush > .list-group-item {
  background-color: rgba(225, 225, 225, 0.02);
  color: white;
}
</style>
