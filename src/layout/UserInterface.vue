<template>
    <a-layout>
      
     
      <a-layout>
        <a-layout-header style="background: transparent; height: 30px; padding-left:5px; padding-right: 5px">
          <div style="float:right">
            <menu-fold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
            />
            <menu-unfold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          </div>
         
        </a-layout-header>
       
        <a-layout-content>
          <a-row type="flex" :gutter="[28,28]" style="margin-left: 4px; margin-right: 4px;">
            <a-col :span="24" style="padding-bottom: 14px;">
              <GeneOverview
                v-if="this.$store.getters.getSequences.length > 0 && this.$store.getters.getNucStructure.length > 0"
                title="Gene Overview"
                :data_seqs="getSequences"
                :data_var_pos="getVarPosCount"
                :bool_collapsed="collapsed"
                :key="GeneOverviewKey"
                :data_nuc_structure="getNucStructure"
              />
            </a-col>
          </a-row>
          <a-row type="flex" :gutter="[28,28]" style="margin-left: 4px; margin-right: 4px;" id="locus-view">
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
                :data_nuc_structure="getNucStructure"
                :annotation_ref="getAnnotationRef"
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
      <a-layout-sider v-model:collapsed="collapsed" collapsible collapsedWidth="0" :trigger="null">
        <div class="logo">
          <h6 class="logoHeader"> PanVA: Arabidopsis</h6>
        </div>
        <div id="sider" style="margin-left: 4px; margin-right: 4px;">
            <select
            id="chosenHomId"
            class="form-select form-select-sm select-style-small dark"
            aria-label=".form-select-sm example"
          >
            <option disabled>Load homology group</option>
  
           <option value="14522883">FT</option> 
           <option value="14524057">FLC</option> 
           <option value="14526308">SVP</option>
           <option selected value="14541976">DOG1</option>
           <option value="14543064">VIN3</option>
           <!-- <option value="14516871">core11</option> -->
           <option value="14536734">core9</option>
           <option value="14520213">core12</option>
  
            <!-- <option value="14611640">flc</option>
            <option selected value="14595191">ft</option>
            <option disabled value="14594986">rbohf</option> 
            <option value="14598616">svp</option>
            <option value="14615372">vin3</option> -->
          </select>
          <HomologyInfo v-if="this.$store.getters.getSequences.length >0" title="Info"/>
          <GroupInfo v-if="this.$store.getters.getGroups.length > 0" title="Groups"/>
  
  
        </div>
      </a-layout-sider>
      <a-layout-footer style="text-align: center"> </a-layout-footer>
    </a-layout>
  </template>
  
  <script>
  import HomologyInfo from '@/components/HomologyInfo.vue'
  import GroupInfo from '@/components/GroupInfo.vue'
  // import Menu from '@/containers/Menu.vue'
  // import Tree from '@/components/Tree.vue'
  import HeatMap from '@/components/HeatMap.vue'
  // import HeatMap from '@/components/HeatMap_copy_1june.vue'
  import GeneOverview from '@/components/GeneOverview.vue'
  
  // import axios from 'axios'
  import * as d3 from 'd3'
  import { mapGetters } from 'vuex'
  
  import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons-vue';
  
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
        annotationRef: 'no-choice'
      }
    },
    computed: {
      ...mapGetters([
        'getAlignedPositions',
        'getDendrogramDefault',
        'getSequences',
        'getVarPosCount',
        'getNucStructure',
        'getPhenos',
        'selectedRegion',
        'getHomologyInfoById',
        'getGroupToDelete',
        'getGroupToDecolor',
        'getGroupToColor',
        'getGroupToCollapse',
        'getGroupToExpand',
        'getAnnotationRef'
        
      ]), //aligned positions from store, already transformed to csv object
    },
    mounted(){
      let vis = this;
  
      d3.select('#chosenHomId').on('change', function () {
        //console.log('change rowSorting')
        vis.$store.state.groupsSelected = [] // reset 
        vis.$store.state.sequences = [] // reset 
        vis.$store.state.nucStructure = [] // reset 
        vis.$store.state.annotationReference = 'no-choice'
  
        vis.$store.dispatch('setGroupsSelected', [])
        vis.$store.dispatch('setSelectedRegion', '1-60')
        vis.$store.dispatch('setGroupDelete', null)
        vis.$store.dispatch('setGroupDecolor', null)
        vis.$store.dispatch('setGroupColor', null)
  
        let selectValue = d3.select('#chosenHomId').property('value')
        vis.$store.state.dendrogramDefault = null // reset dendro
        vis.$store.dispatch('updateGeneOverview', selectValue)
        vis.$store.dispatch('updateLocusView', selectValue)  
  
      })
    },
    created() {
      console.log('UserInterface created')
      this.fetchTreeData()
      // this.fetchBarData()
      this.fetchData()
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
        this.GeneOverviewKey += 1; 
        this.HeatMapKey += 1; 
      },
  
      sideCollapse(){
  
        console.log('TEST!', this.collapsed)
  
        let collapsed = this.collapsed
  
        return (collapsed = !collapsed)
  
      },
      async fetchData() {
        // const response = await fetch('./tree.txt')
        // const data = await response.text()
  
        let data = await d3.json('http://localhost:5000/tree_nuc_trimmed')
        // console.log('fetchData --> this.loadData', data)
        this.loadData = data
      },
      async fetchDendroData() {
        let data_dendro = await d3.json('./d3-dendrogram-14594986.json')
        console.log('!!!data dendro', data_dendro)
        this.dendroData = data_dendro
        console.log('fetchDendroData --> this.dendroData', this.dendroData)
      },
      async fetchTreeData() {
        const response = await fetch("./core_snp.txt");
        const data_tree = await response.text();
        console.log("!!! core SNP tree", data_tree);
  
        this.loadDataTree = data_tree;
  
      },
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
    padding: 0px !important
  }
  
  .ant-layout-sider {

    /* background-color: #23252a !important; */
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
  
  .logoHeader{
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
  /* .card{
    background-color: black !important;
  } */
  
  
  
  
  </style>
  