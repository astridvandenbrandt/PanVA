<template> 
  <div class="accordion accordion-flush" id="accordionFlushExample">
       <!-- Homology information -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingHomology">
            <div class="card-header">
              <button class="accordion-button collapsed" id="first-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseHomology" aria-expanded="false" aria-controls="flush-collapseomology">
                <p class='card-header'> Homology info</p>
              </button>
            </div>
          </h2>
          <div id="flush-collapseHomology" class="accordion-collapse collapse" aria-labelledby="flush-headingHomology" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <ul class="list-group list-group-flush">
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
                <span class="badge rounded-pill bg-secondary"> {{ getHomologyInfoById.members }}</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-left"
              >
                nuc:
                <ul style="padding-left: 10px;">
                  <li>var sites: {{ getHomologyInfoById.variable_sites_nuc }}</li>
                  <li>inf sites: {{ getHomologyInfoById.informative_sites_nuc }}</li>
                  <li>pheno spec: {{ getHomologyInfoById.pheno_specific_changes_nuc }}</li>
                </ul>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-left"
              >
                prot:
                <ul style="padding-left: 10px;">
                  <li>var sites: {{ getHomologyInfoById.variable_sites_prot }}</li>
                  <li>inf sites: {{ getHomologyInfoById.informative_sites_prot }}</li>
                  <li>
                    pheno spec: {{ getHomologyInfoById.pheno_specific_changes_prot }}
                  </li>
                </ul>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  <!-- Legends and usage information -->
  <div class="accordion accordion-flush" id="accordionLegend">
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingOne">
        <div class="card-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="true" aria-controls="flush-collapseOne">
            <p class='card-header'> Legends</p>
          </button>
        </div>
      </h2>
      <div id="flush-collapseOne" class="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionLegend">
        <div class="accordion-body">
          <p class="info-header">Regular nucleotides</p>
          <div style="display: flex; justify-content: flex-start;">
            <div style="display: block; padding-right: 4px;">
              <svg height="10" width="10">
                <rect width="10" height="10" style="fill:#fb8072" />  
            </svg> 
            <p>A</p>
            </div>
            <div style="display: block; padding-right: 4px;">
              <svg height="10" width="10">
                <rect width="10" height="10" style="fill:#80b1d3"/>  
            </svg> 
            <p>C</p>
            </div>
            <div style="display: block; padding-right: 4px;">
              <svg height="10" width="10">
                <rect width="10" height="10" style="fill:#fdb462"/>  
            </svg> 
            <p>G</p>
            </div> 
            <div style="display: block; padding-right: 4px;">
              <svg height="10" width="10">
                <rect width="10" height="10" style="fill:#b3de69"/> 
            </svg> 
            <p>T</p>
            </div>
            <div style="display: block; padding-right: 4px;">
              <svg height="10" width="10">
                <rect width="10" height="10" style="fill:#FFF;;stroke-width:1;stroke:rgba(0,0,0,0.125)"/>  
            </svg> 
            <p>-</p>
            </div>
          </div>
          <p class="info-header">Aggregation glyph</p>
          <div style="justify-content: flex-start; padding-bottom: 4px;">
              <img src = "/legend_clustal.svg"/> 
          </div>
          <p>Clockwise: A, C, G, T <br> Middle: -</p>

        </div>
      </div>
    </div>
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

  },
  mounted() {
    // console.log('HomologyInfo mounted')
  },
  created() {
    // console.log('HomologyInfo created')
  },
}
</script>

<style>
.delete {
    font-size: 18px;
    cursor: pointer;
  }
  
  #info-container {
    background-color: transparent !important;
  }


  #accordionFlushExample {
   border-radius: 0 !important;
  }


  
  .list-group-flush > .list-group-item {
    background-color:transparent;
    font-size: 10px;
    padding-left: 0px;
    padding-right: 0px;

  }


  .card-header {

    font-variant-caps: all-petite-caps;
    font-size: 14px;

}

.info-header {
  font-size: 13px;
}

.accordion {

  border-radius: 0.375rem !important;
  --bs-accordion-bg: transparent !important;
  --bs-accordion-border-color: var(--bs-border-color-translucent) !important;
  --bs-accordion-border-radius: 0.375rem !important;
  --bs-accordion-active-bg: transparent !important;

}


.accordion-body {
  font-size: 10px !important;


  }

.kbdkeys { 
  font-family: monospace;
  font-size: 10px;
}


</style>
