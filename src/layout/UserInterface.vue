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

      <a-layout-content>
        <a-row
          type="flex"
          style="margin-left: 4px; margin-right: 4px; row-gap: 16px"
        >
          <a-col :span="24">
            <GeneOverview
              v-if="this.$store.getters.getSequences.length > 0"
              title="Gene Overview"
              :data_seqs="getSequences"
              :data_var_pos="getVarPosCount"
              :bool_collapsed="collapsed"
              :key="GeneOverviewKey"
            />
          </a-col>
        </a-row>
        <a-row
          type="flex"
          style="margin-left: 4px; margin-right: 4px; row-gap: 16px"
          id="locus-view"
        >
          <!-- <a-col :span="4">
              <Menu v-if="this.$store.getters.homologyIdList.length > 0" />
              <HomologyInfo v-if="this.$store.getters.getHomologyInfoById" />
              <div class="mt-3">
                <Tree title="Tree" :dataTree="loadData" svgHeight="1500" />
              </div>
            </a-col> -->
          <a-col :span="24">
            <HeatMap
              v-if="this.$store.state.dendrogramDefault"
              title="Locus View"
              :data_dendro="getDendrogramDefault"
              :data_heatmap="getAlignedPositions"
              :data_region="selectedRegion"
              :data_phenos="getPhenos"
              :bool_collapsed="collapsed"
              :key="HeatMapKey"
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
          <!-- <a-col :span="3"> 
              
            </a-col> -->
        </a-row>
      </a-layout-content>
    </a-layout>
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      collapsedWidth="0"
      :trigger="null"
    >
      <div class="logo">
        <h6 class="logoHeader">PanVA: Pectobacterium</h6>
      </div>
      <div id="sider" style="margin-left: 4px; margin-right: 4px">
        <select
          id="chosenHomId"
          class="form-select form-select-sm select-style-small dark"
          aria-label=".form-select-sm example"
        >
          <option selected disabled>Load homology group</option>
          <option value="13803210">acnA</option>
          <option value="13806284">atpD</option>
          <option value="13806245">dnaA</option>
          <option value="13805562">dnaJ</option>
          <option value="13806410">dnaX</option>
          <option selected value="13803671">gapA</option>
          <option value="13806436">gyrA</option>
          <option value="13806241">gyrB</option>
          <option value="13804882">mdh</option>
          <option value="13805775">mtlD</option>
          <option value="13804402">pgi</option>
          <option value="13807072">proA</option>
          <option value="13807007">recA</option>
          <option value="13806569">rho</option>
          <option value="13806911">rpoA</option>
          <option value="13805238">rpoS</option>
          <option value="13805694">rfaL</option>

          <option value="13808794">intA(1)</option>
          <option value="13812455">intA(2)</option>
          <option value="13812284">bin3(1)</option>
          <option value="13812287">bin3(2)</option>
          <option value="13812171">virulent5</option>

          <option value="13804863">tycC</option>
          <option value="13804857">tycC_3</option>
          <!-- <option value="13810661">imm_1</option> -->
        </select>
        <HomologyInfo
          v-if="this.$store.getters.getHomologyInfoById"
          title="Info"
        />
        <GroupInfo
          v-if="this.$store.getters.getGroups.length > 0"
          title="Groups"
        />
      </div>
    </a-layout-sider>
    <a-layout-footer style="text-align: center"> </a-layout-footer>
  </a-layout>
</template>

<script>
import HomologyInfo from '@/components/HomologyInfo.vue'
// import Menu from '@/containers/Menu.vue'
// import Tree from '@/components/Tree.vue'
import HeatMap from '@/components/HeatMap.vue'
import GroupInfo from '@/components/GroupInfo.vue'
import GeneOverview from '@/components/GeneOverview.vue'

// import axios from 'axios'
import * as d3 from 'd3'
import { mapGetters } from 'vuex'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'

export default {
  name: 'UserInterface',
  components: {
    HomologyInfo,
    GroupInfo,
    // Menu,
    // Bar,
    // Tree,
    HeatMap,
    GeneOverview,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  data() {
    return {
      loadData: {},
      loadDataTree: {},
      collapsed: false,
      GeneOverviewKey: 0,
      HeatMapKey: 0,
    }
  },
  computed: {
    ...mapGetters([
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
    ]), //aligned positions from store, already transformed to csv object
  },
  mounted() {
    let vis = this

    d3.select('#chosenHomId').on('change', function () {
      //console.log('change rowSorting')
      vis.$store.state.groupsSelected = [] // reset dendro
      vis.$store.dispatch('setGroupsSelected', [])
      vis.$store.dispatch('setGroups', [])
      vis.$store.dispatch('setGroupDelete', null)
      vis.$store.dispatch('setGroupDecolor', null)
      vis.$store.dispatch('setGroupColor', null)
      vis.$store.dispatch('setSelectedRegion', '1-60')

      let selectValue = d3.select('#chosenHomId').property('value')
      vis.$store.state.dendrogramDefault = null // reset dendro
      vis.$store.dispatch('updateGeneOverview', selectValue)
      vis.$store.dispatch('updateLocusView', selectValue)

      // vis.forceRerender()
      // vis.$store.dispatch('setHomologyId', selectValue)
      // vis.$store.state.dendrogramDefault = null // reset dendro

      // vis.$store.dispatch(
      //   'fetchDendrogramDefault',
      //   vis.$store.state.chosenHomologyId
      // )

      // vis.$store.dispatch('fetchAlignedPositions', {
      //   id: vis.$store.getters.chosenHomologyId,
      // })

      // vis.$store.dispatch('fetchSequences', vis.$store.getters.chosenHomologyId)
      // vis.$store.dispatch('fetchVarPosCount', vis.$store.getters.chosenHomologyId)
      // vis.$store.dispatch('fetchPhenos', vis.$store.getters.chosenHomologyId)
    })
  },
  created() {
    console.log('UserInterface created')

    // this.fetchBarData()
    this.fetchTreeData()
    // this.fetchHeatMapData()
    // this.fetchDendroData()
    // this.fetchAlignedPositions(this.getAlignedPositions)
  },
  methods: {
    // async fetchBarData() {
    //   await axios.get('http://localhost:3000/bar').then((response) => {
    //     this.barData = response.data.bar
    //     console.log('fetchBarData --> this.barData', this.barData)
    //   })
    // },

    forceRerender() {
      this.GeneOverviewKey += 1
      this.HeatMapKey += 1
    },

    sideCollapse() {
      console.log('TEST!', this.collapsed)

      let collapsed = this.collapsed

      return (collapsed = !collapsed)
    },
    async fetchTreeData() {
      const response = await fetch('./core_snp.txt')
      const data_tree = await response.text()
      console.log('!!! core SNP tree', data_tree)

      this.loadDataTree = data_tree
    },
    // loadTreeData() {
    //   // const response = await fetch('./tree.txt')
    //   // const data = await response.text()

    //   let data = await d3.json('http://localhost:5000/tree_nuc_trimmed')
    //   // console.log('fetchData --> this.loadData', data)
    //   this.loadData = data
    // },
    // async fetchDendroData() {
    //   let data_dendro = await d3.json('./d3-dendrogram-pecto_var.json')
    //   console.log('!!!data dendro', data_dendro)
    //   this.dendroData = data_dendro
    //   console.log('fetchDendroData --> this.dendroData', this.dendroData)
    // },
    // async fetchHeatMapData() {
    //   let data_heat = await d3.tsv('/data_heatmap.tsv', function (d) {
    //     return {
    //       row: +d.row_idx,
    //       col: +d.col_idx,
    //       value: +d.log2ratio,
    //     }
    //   })
    //   console.log('fetchHeatMapData --> this.heatmapData', data_heat)
    //   this.heatmapData = data_heat
    // },

    /////////////////////////////
    //// old fetch functions ////
    /////////////////////////////
    // async fetchDendroData() {

    //   let data_dendro = await d3.json('http://localhost:5000/d3dendro')
    //   console.log('!!!data dendro', data_dendro)
    //   this.dendroData = data_dendro;
    //   console.log('fetchDendroData --> this.dendroData', this.dendroData)
    // },
    // async fetchHeatMapData() {

    //   let data_heat = await d3.csv('http://localhost:5000/al_pos')

    //   console.log('fetchHeatMapData --> this.heatmapData', data_heat)
    //   this.heatmapData = data_heat
    // },
  },
}
</script>

<style>
/* .ant-layout-header {
    height: 30px !important;
    background-color: transparent !important;
    padding: 0 5px !important;
  } */

.ant-layout-footer {
  padding: 0px !important;
}

.ant-layout-sider {
  /* background-color: transparent !important; */
  /* background-color: #141414 !important; */
  background-color:#e0dee2 !important;
  border-left: 1px #c5c5c5 solid;
}

.trigger {
  /* font-size: 18px;
    line-height: 64px;
    padding: 0 10px; */
  cursor: pointer;
  transition: color 0.3s;
  vertical-align: 20px !important;
}

.trigger:hover {
  color: #1890ff;
}

.logoHeader {
  /* color: #e9ecef !important; */
  margin-left: 4px !important;
  margin-top: 4px !important;
}

.logo {
  height: 26px;
  /* background: rgba(255, 255, 255, 0.3); */
  /* text-align: center; */
}

#chosenHomId{
    background-color: transparent !important;
    /* color: white; */
    margin-bottom: 5px;
    margin-top: 0px;
    border: 1px solid #c5c5c5 !important;
  }
</style>
