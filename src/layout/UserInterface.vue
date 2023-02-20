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
       
        <a-layout-content  v-if="isDataLoaded">
          <a-row type="flex" :gutter="[28,28]" style="margin-left: 4px; margin-right: 4px;">
            <a-col :span="24" style="padding-bottom: 14px;">
              <GeneOverview
              
                title="Gene Overview"
                :data_seqs="getSequences"
                :data_var_pos="getVarPosCount"
                :bool_collapsed="collapsed"
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
      <a-layout-sider v-model:collapsed="collapsed" collapsible collapsedWidth="0" :trigger="null">
        <div class="logo">
          <h6 class="logoHeader"> PanVA</h6>
        </div>
        <div id="sider" style="margin-left: 4px; margin-right: 4px;">

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
                      <p style="font-size: 11px;"><i> Arabidopsis</i></p> 
                    </div>
                  </div>
                    <div style="display: flex;">
                      <div style="margin-top: 2px; margin-right:8px">
                        <p class="info-header">Gene: </p> 
                      </div>
                      <select name="chosenHomId" v-model="homologySelected"  id="chosenHomId" class="form-select form-select-sm">
                        <option selected disabled>
                          Load homology group
                        </option>
                        <option v-for="homology in homologyList" v-bind:key="homology" v-bind:value="homology.homology_id"> {{ homology.name }} </option>
                      </select>
                      <div>
                        <!-- <select
                        id="chosenHomId"
                        class="form-select form-select-sm select-style-small dark"
                        aria-label=".form-select-sm example"
                        >
                        <option disabled>Load homology group</option>
                
                        <option value="14522883">FT</option> 
                        <option value="14524057">FLC</option> 
                        <option value="14526308">SVP</option>
                        <option selected value="14541976">DOG1</option>
                        <option value="14543064">VIN3</option> -->
                        <!-- <option value="14516871">core11</option> was already excluded --> 
                        <!-- <option value="14536734">core9</option> 
                        <option value="14520213">core12</option> -->
                
                        <!-- were already excluded -->
                          <!-- <option value="14611640">flc</option>
                          <option selected value="14595191">ft</option>
                          <option disabled value="14594986">rbohf</option> 
                          <option value="14598616">svp</option>
                          <option value="14615372">vin3</option> -->
                        <!-- </select> -->
                      </div>
                    </div>
                   
                </div>
               
              </div>
            </div>
          </div>
          <HomologyInfo v-if="this.$store.getters.getSequences.length >0" title="Homology information"/>
          <GroupInfo v-if="this.$store.getters.getGroups.length > 0" title="Groups"/>
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
                  <hr>
                  <p class="info-header">Selections</p>
                  <p>When selecting row items for groups, hold <kbd class="kbdkeys">crtl</kbd> <b>or</b> <kbd class="kbdkeys">alt</kbd> to add to the current selection.</p>
                  <p>To access group tooltips, hold <kbd class="kbdkeys">crtl</kbd> <b>+</b> <kbd class="kbdkeys">alt</kbd> on hovering.</p> 
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
  import GroupInfo from '@/components/GroupInfo.vue'
  // import Menu from '@/containers/Menu.vue'
  // import Tree from '@/components/Tree.vue'
  import HeatMap from '@/components/HeatMap.vue'
  // import HeatMap from '@/components/HeatMap_copy_1june.vue'
  import GeneOverview from '@/components/GeneOverview.vue'
  
  // import axios from 'axios'
  import * as d3 from 'd3'
  import { mapActions, mapGetters, mapState } from 'vuex'
  
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
        annotationRef: 'no-choice',
        homologySelected: 14541976
      }
    },
    computed: {
      ...mapGetters([
        'homologyList',
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
      ...mapState(['isDataLoaded', 'groups'])
      
    },
    mounted(){
      let vis = this;

      // vis.updateViews(vis.homologySelected)
  
      d3.select('#chosenHomId').on('change', function () {

        let selectValue = parseInt(d3.select('#chosenHomId').property('value'))
        vis.homologySelected = selectValue;
        vis.updateViews(selectValue);

        // //console.log('change rowSorting')
        // vis.$store.state.groupsSelected = [] // reset 
        // vis.$store.state.sequences = [] // reset 
        // vis.$store.state.nucStructure = [] // reset 
        // vis.$store.state.annotationReference = 'no-choice'
  
        // vis.$store.dispatch('setGroupsSelected', [])
        // vis.$store.dispatch('setSelectedRegion', '1-60')
        // vis.$store.dispatch('setGroupDelete', null)
        // vis.$store.dispatch('setGroupDecolor', null)
        // vis.$store.dispatch('setGroupColor', null)
  


        // vis.$store.state.dendrogramDefault = null // reset dendro
        // vis.$store.dispatch('updateGeneOverview', selectValue)
        // vis.$store.dispatch('updateLocusView', selectValue)  
  
      })
    },
    created() {
      // let vis = this;
      console.log('UserInterface created')
      // this.updateViews(vis.homologySelected);
      this.fetchTreeData()

    },
    methods: {
      // async fetchBarData() {
      //   await axios.get('http://localhost:3000/bar').then((response) => {
      //     this.barData = response.data.bar
      //     console.log('fetchBarData --> this.barData', this.barData)
      //   })
      // },

      ...mapActions(['updateViews']),
  
      // forceRerender() {
      //   this.GeneOverviewKey += 1; 
      //   this.HeatMapKey += 1; 
      // },
  
      // sideCollapse(){
  
      //   // console.log('TEST!', this.collapsed)
  
      //   let collapsed = this.collapsed
  
      //   return (collapsed = !collapsed)
  
      // },
   

      async fetchTreeData() {
        // const response = await fetch("./core_snp.txt");
        const response = await fetch(`${process.env.VUE_APP_FLASK_URL}/core_snp`);
        const data_tree = await response.text();
        // console.log("core SNP tree", data_tree);
  
        this.loadDataTree = data_tree;
  
      },
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
    /* background-color:#e0dee2 !important; */
    background-color: #f8f8f8 !important;
    /* border-left: 1px #c5c5c5 solid; */
    border-left: 1px rgba(0, 0, 0, 0.025) solid;
    

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
    margin-left: 24px !important;
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
  