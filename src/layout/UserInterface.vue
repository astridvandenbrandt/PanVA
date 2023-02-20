<template>
  <a-layout>
    <a-layout>
      <a-layout-header
        style="
          background: transparent;
          height: 30px;
          padding-left: 5px;
          padding-right: 5px;
        "
      >
        <div style="float: right">
          <menu-fold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-unfold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
        </div>
      </a-layout-header>

      <a-layout-content v-if="isDataLoaded">
        <a-row type="flex" :gutter="[28,28]" style="margin-left: 4px; margin-right: 4px;">
          <a-col :span="24" style="padding-bottom: 14px;">
            <GeneOverview
              v-if="this.$store.getters.getSequences.length > 0"
              title="Gene Overview"
              :data_seqs="getSequences"
              :data_var_pos="getVarPosCount"
              :bool_collapsed="collapsed"
            />
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="[28,28]" style="margin-left: 4px; margin-right: 4px;" id="locus-view">

          <a-col :span="24">
            <HeatMap
              v-if="this.$store.state.dendrogramDefault"
              title="Locus View"
              :data_dendro="getDendrogramDefault"
              :data_heatmap="getAlignedPositions"
              :data_region="selectedRegion"
              :data_phenos="getPhenos"
              :bool_collapsed="collapsed"
              :group_delete="getGroupToDelete"
              :group_decolor="getGroupToDecolor"
              :group_color="getGroupToColor"
              :group_collapse="getGroupToCollapse"
              :group_expand="getGroupToExpand"
              :core_snp="loadDataTree"
            />
            <div v-else class="d-flex justify-content-center">
              <div class="spinner-border m-5" role="status"></div>
            </div>
          </a-col>

        </a-row>
      </a-layout-content>
      <a-layout-content
        class="d-flex align-items-center justify-content-center"
        v-else
      >
        <div
          class="spinner-border text-secondary"
          style="width: 3rem; height: 3rem"
          role="status"
        ></div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      collapsedWidth="0"
      :trigger="null"
    >
      <div class="logo">
        <h6 class="logoHeader">PanVA </h6>
      </div>
      <div id="sider" style="margin-left: 4px; margin-right: 4px">
        <div class="accordion accordion-flush" id="accordionHomologySelect">
            <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingSelect">
                <div class="card-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseSelect" aria-expanded="true" aria-controls="flush-collapseSelect">
                    <p class='card-header'> Load data</p>
                  </button>
                </div>
              </h2>
              <div id="flush-collapseSelect" class="accordion-collapse collapse show" aria-labelledby="flush-collapseSelect" data-bs-parent="#accordionHomologySelect">
                <div class="accordion-body">
                  <div style="display: flex; align-items: baseline; justify-content: space-between;">
                    <div> 
                      <p class="info-header">Pangenome: </p> 
                    </div>
                    <div> 
                      <p style="font-size: 11px;"><i> Pectobacteria</i></p> 
                    </div>
                  </div>
                    <div style="display: flex;">
                      <div style="margin-top: 2px; margin-right:8px">
                        <p class="info-header">Gene: </p> 
                      </div>
                      <div>
                        <select name="chosenHomId" v-model="homologySelected"  id="chosenHomId" class="form-select form-select-sm">
                          <option selected disabled>
                            Load homology group
                          </option>
                          <option v-for="homology in homologyList" v-bind:key="homology" v-bind:value="homology.homology_id"> {{ homology.name }} </option>
                       </select>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

        <HomologyInfo
          v-if="this.$store.getters.getHomologyInfoById"
          title="Homology information"
        />
        <GroupInfo
          v-if="this.$store.getters.getGroups.length > 0"
          title="Groups"
        />
        <div class="accordion accordion-flush" id="accordionTips">
            <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingThree">
                <div class="card-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                    <p class='card-header'> Tips & Usage</p>
                  </button>
                </div>
              </h2>
              <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionTips">
                <div class="accordion-body">
                  <p class="info-header">Filter options</p>
                    <p><b>Variable</b>: positions with multiple nucleotides</p>
                    <p><b>Informative</b>: variable positions with a frequency > 1</p>
                    <p><b>Phenotype specific</b>: variable positions specific for virulence</p>
                  <hr>
                  <p class="info-header">Selections</p>
                  <p>When selecting row items for groups, hold <kbd class="kbdkeys">ctrl</kbd> or <kbd class="kbdkeys">alt</kbd> to add to the current selection.</p>
                  <p>To access group tooltips, hold <kbd class="kbdkeys">ctrl</kbd> <b>+</b> <kbd class="kbdkeys">alt</kbd> on mouse moving.</p> 
                </div>
              </div>
            </div>
          </div>



      </div>
    </a-layout-sider>
    <a-layout-footer style="text-align: center"> </a-layout-footer>
  </a-layout>
</template>

<script>
import HomologyInfo from '@/components/HomologyInfo.vue'
import HeatMap from '@/components/HeatMap.vue'
import GroupInfo from '@/components/GroupInfo.vue'
import GeneOverview from '@/components/GeneOverview.vue'

import * as d3 from 'd3'
import { mapGetters, mapState, mapActions } from 'vuex'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

export default {
  name: 'UserInterface',
  components: {
    HomologyInfo,
    GroupInfo,
    HeatMap,
    GeneOverview,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  data() {
    return {
      loadDataTree: {},
      collapsed: false,
      homologySelected: 13803671,

    }
  },
  computed: {
    ...mapGetters([
      'homologyList',
      'getAlignedPositions',
      'getDendrogramDefault',
      'getSequences',
      'getVarPosCount',
      'getPhenos',
      'selectedRegion',
      'getHomologyInfoById',
      'getGroupToDelete',
      'getGroupToDecolor',
      'getGroupToColor',
      'getGroupToCollapse',
      'getGroupToExpand',
    ]), 
    ...mapState(['isDataLoaded', 'groups']),

  },
  mounted() {
    let vis = this

    d3.select('#chosenHomId').on('change', function () {
     

      let selectValue = parseInt(d3.select('#chosenHomId').property('value'))
      vis.homologySelected = selectValue
      vis.updateViews(selectValue)

  
    })
  },
  created() {
    console.log('UserInterface created')


   
    this.fetchTreeData()

  },
  methods: {

    ...mapActions(['updateViews']),

    async fetchTreeData() {
      const response = await fetch(`${process.env.VUE_APP_FLASK_URL}/core_snp`)
      const data_tree = await response.text()
      console.log('!!! core SNP tree', data_tree)

      this.loadDataTree = data_tree
    },
  
  },
}
</script>

<style>


.ant-layout-footer {
  padding: 0px !important;
}

.ant-layout-sider {
  
  background-color: #f8f8f8 !important;
  border-left: 1px rgba(0, 0, 0, 0.025) solid;
}

.trigger {

  cursor: pointer;
  transition: color 0.3s;
  vertical-align: 20px !important;
}

.trigger:hover {
  color: #1890ff;
}

.logoHeader {
  margin-left: 24px !important;
  margin-top: 4px !important;
}

.logo {
  height: 26px;

}

#chosenHomId{
    background-color: transparent !important;
    margin-bottom: 5px;
    margin-top: 0px;
    border: 1px solid #c5c5c5 !important;
    font-size: 15px !important;
    padding-left: 14px !important;

    
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
--bs-accordion-active-color: black !important;
--bs-accordion-btn-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='black'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;
--bs-accordion-btn-active-icon: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='black'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e") !important;


}

.accordion-button {
  
  --bs-accordion-btn-focus-border-color:  transparent !important;
  --bs-accordion-btn-focus-box-shadow: 0 0 0 0 transparent !important;

}

.accordion-body {
font-size: 10px !important;

}

</style>
