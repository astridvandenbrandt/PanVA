<template>
  <div class="card" id="heatmap-view" style="width: 100%">
    <div class="card-header" style="padding: 0 1em">
      {{ title }}
    </div>
    <a-row style="padding-top: 5px">
      <a-col :span="3">
        <div
          class="container leftContainer emptyDiv"
          style="padding-right: 0px"
        >
          <div class="iconsSelect" style="float:left">
            <div class="iconsDiv" style="float:left">
              <BgColorsOutlined />
            </div>
            <div style="width: calc(100% - 25px); float:left">
              <select
                id="cellColors"
                v-model="cellColors"
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
              >
                <option value="no-choice" selected disabled>
                  Color cells by
                </option>
                <option disabled value="default">Default</option>
                <option value="clustal">Clustal</option>
                <option disabled value="cg-at">CG vs AT</option>
                <option disabled value="pur-pyr">Purine vs Pyrimidine</option>
              </select>
            </div>
          </div>
          <div class="iconsSelect" style="float:left">
            <div class="iconsDiv" style="float:left">
              <ColumnWidthOutlined />
            </div>
            <div style="width: calc(100% - 25px); float:left">
              <select
                id="colFilter"
                v-model="colFilter"
                class="form-select form-select-sm select-style-small"
                aria-label=".form-select-sm example"
              >
                <option selected disabled>Filter Positions by</option>
                <option value="all">All</option>
                <option value="var">Variable</option>
                <option value="var-inf">Informative</option>
              </select>
            </div>
          </div>
          <div class="iconsSelect" style="float:left">
            <div class="iconsDiv" style="float:left">
              <SortAscendingOutlined />
            </div>
            <div style="width: calc(100% - 25px); display: inline-block">
              <select
                id="rowSorting"
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
              >
                <option value="no-choice" disabled>
                  Sort Accessions by
                </option>
                <option value="initial">Initial</option>
                <option value="dendro-default" selected>Dendrogram Default</option>
                <option value="dendro-custom">
                  Dendrogram Custom
                </option>
                <option value="position" disabled>
                  Nucleotide (single position)
                </option>
                <option value="FT10">FT10</option>
                <option value="FT16">FT16</option>
              </select>
            </div>

          </div>
        </div>

        <div id="dendro" class="container leftContainer variantView">
          <svg id="dendroSvg" width="100%" :height="chartHeightMax">
            <g id="dendroview" :transform="dendroHeight"></g>
          </svg>
        </div>
      </a-col>
      <div id="bipartiteCol" :class="bipartiteClass">
        <div class="container leftContainer emptyDiv">
        </div>
        <div id="bipartite" class="container leftContainer variantView">
          <svg id="bipartiteSvg" width="100%" :height="chartHeightMax">
            <g
              id="bipartiteview"
              :transform="'translate(' + 0 + ',' + 1 + ')'"
            ></g>
          </svg>
        </div>
      </div>
      <a-col :span="3">
        <div class="container leftContainer emptyDiv" style="padding-left: 5px">
          <div style="margin-top: 2px; float: left; margin-right: 8px">
            <a-tooltip>
              <template #title>calculate cluster dendrogram</template>
              <a-button
                type="primary"
                size="small"
                :disabled="disableDendroCalc"
                @click="toggleCheckedDendro"
              >
                <template #icon>
                  <div>
                    <SwapOutlined />
                  </div>
                </template>
              </a-button>
            </a-tooltip>
          </div>
          <div style="float: left; margin-top: 2px; margin-left: 2px; margin-right: 8px;">
            <a-tooltip>
              <template #title>(un)link dendrogram tree</template>
              <a-button
                :type="buttonType"
                size="small"
                :disabled="disableDendroCalc"
                @click="toggleLinkDendro"
              >
                <template #icon>
                  <div>
                    <LinkOutlined />
                  </div>
                </template>
              </a-button>
            </a-tooltip>
          </div>
          <div style="margin-top: 2px; margin-left: 2px; float: left; margin-right: 8px">
            <a-tooltip>
              <template #title>add to groups</template>
              <a-button 
                danger
                size="small"
                :disabled="colorsGroups.length == 0"
                @click="toggleGroupCreate"             
              >
                <template #icon>
                  <div>
                     <PlusOutlined />
                  </div>
                </template>
              </a-button>
            </a-tooltip>
          </div>   
          <div class='iconsSelect' style="width: 100%; float:left; margin-top: 0px"> 
             <div style="float:left;">
              <input id="core-snp-checkbox" @change="toggleLinkCoreSNP" :disabled="toggleButton == true" v-model="showCoreSNP" class="form-check-input check-core-snp" type="checkbox" value="" style="width: 17px; height: 17px; margin-top: 5px; margin-right: 5px; background: transparent; border-radius: 0.25rem;" >
              <label class="form-check-label" for="core-snp-checkbox">
              core SNP
              </label>
            </div> 
          </div>
          <div class="iconsSelect" style="float:left">
            <div class="iconsDiv" style="float:left; margin-right: 5px">
              <a-tooltip>
                <template #title>set visual reference</template> 
             <span style="font-size: 10px; font-weight: 500; vertical-align: bottom"> REF</span>
            </a-tooltip>
            </div>
          <div class='iconsSelect' style="width: calc(100% - 25px); float:left; ">
           
              <select name="visRefSelect" v-model="visualRefSelected"  id="visualReference" class="form-select form-select-sm">
                <option value="no-choice" selected disabled>
                  Set Visual Reference
                </option>
                <option value="none">None</option>
                <option v-for="ref in phenosNamesCopy" v-bind:key="ref" v-bind:value="ref.mRNA_id"> {{ ref.group }} </option>
              </select>
          </div>
        </div>
        </div>
        <div id="heatmapRow" class="container leftContainer variantView">
          <svg id="heatmapSvgRow" width="500" :height="chartHeightMax">
            <g
              id="heatmapviewRow"
              :transform="'translate(' + 7 + ',' + 2 + ')'"
            ></g>
          </svg>
        </div>
      </a-col>
        <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10" id="heatmap-cells">

        <div id="heatmapCol" class="container leftContainer">
          <div
            id="checkboxPosGroup"
            :style="{ width: chartWidth + 'px', height: '30px' }"
          >
            <checkboxGroup />
          </div>
          <svg id="heatmapSvgCol" :width="chartWidth + 10" :height="80">

            <g
              id="heatmapviewColCheck"
              :transform="'translate(' + 1 + ',' + 15 + ')'"
            ></g>
           
            <g
              id="heatmapviewCol"
              :transform="'translate(' + 0 + ',' + 72 + ')'"
            ></g>
            <g
            id="heatmapviewVisRef"
            :transform="'translate(' + 1 + ',' + 30 + ')'"
            ></g>
          </svg>
        </div>

        <div id="heatmap" class="container leftContainer variantView">
          <svg id="heatmapSvg" :width="chartWidth" :height="chartHeightMax">
            <g
              id="heatmapview"
              :transform="'translate(' + 1 + ',' + 1 + ')'"
            ></g>
          </svg>
        </div>
        </a-col>
        <a-col flex="236px">
        <div class="container leftContainer emptyDiv">
          <div id="phenotypesDivLabels" style="width: 100%; float:left;">
            <svg id="phenosLabels" width="100%" height="80px">
              <g
                id="phenosLabel0G"
                :transform="'translate(' + 0 + ',' + 70 + ')'"
              ></g>
              <g
                id="phenosLabel1G"
                :transform="'translate(' + 112 + ',' + 70 + ')'"
              ></g>
            </svg>
          </div>
        </div>
        <div id="phenotypes" class="container leftContainer variantView">
          <svg id="phenotypesSvg" width="100%" :height="chartHeightMax">
            <g
              id="brushview"
              :transform="'translate(' + 0 + ',' + 1 + ')'"
            ></g>
            <g
              id="pheno0view"
              :transform="'translate(' + 0 + ',' + 2 + ')'"
            ></g>
            <g
              id="pheno1view"
              :transform="'translate(' + 112 + ',' + 2 + ')'"
            ></g>
           
            
          </svg>
          
        </div>
      </a-col>
    </a-row>
    <div id="tooltip-phenos" class="hidden">
      <p><span id="value-phenos"></span></p>
    </div>
    <div id="tooltip" class="hidden">
      <p><span id="value"></span></p>
    </div>
    <div id="tooltip-mrnas" class="hidden">
      <p><span id="value-mrnas"></span></p>
    </div>
    <div id="popOverBg" class="hidden"></div>
    <div id="popOverGroup" class="hidden"> 
    
     <h6> Create New Group <span class="close" id="popMenuClose">&times;</span> </h6>
      <form class="row no-gutters">
       
        <div class="col-auto">
          <div class="row mb-3">
            <label for="group_name" class="col-sm-5 col-form-label">Enter name:</label> 
            <div class="col-sm">
              <input id="group_name" class="form-control form-control-sm" type="text" placeholder="Test">
            </div>
          </div>
          
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary btn-sm">Create</button>
        </div>
      </form>
    </div>
   
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import _ from 'lodash'
import axios from 'axios'
import chroma from 'chroma-js'
import checkboxGroup from './checkboxGroup.vue'
import {
  PlusOutlined,
  SortAscendingOutlined,
  BgColorsOutlined,
  LinkOutlined,
  ColumnWidthOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue'

export default {
  name: 'Heatmap',
  components: {
    PlusOutlined,
    checkboxGroup,
    SortAscendingOutlined,
    BgColorsOutlined,
    LinkOutlined,
    ColumnWidthOutlined,
    SwapOutlined,

  },
  props: {
    title: String,
    data_heatmap: {},
    data_region: {},
    data_dendro: {},
    data_phenos: {},
    positionKey: null,
    bool_collapsed: Boolean,
    group_delete: null,
    group_decolor: null,
    group_color: null,
    group_collapse: null,
    group_expand: null,
    core_snp: {},
    data_nuc_structure: {},
    annotation_ref: String
  },
  data() {
    return {
      name: 'Locus View',
      cellSize: 10,
      margin: {
        top: 30,
        left: 150,
        right: 15,
      },
      transitionTime: 2000,
      svgWidth: null,
      heatmapWidth: null,
      bipartiteWidth: null,
      bipartiteWidthTotal: null,
      cellColors: 'clustal', //default
      dendroWidth: null,
      colFilter: 'all',
      colSortOrder: false,
      rowFilter: 'all',
      rowSort: 'dendro-default',
      rowSortSteps: ['dendro-default'],
      resetSort: false,
      currentSort: null,
      currentSortAll: null,
      buttonType: 'primary',
      toggleButton: true,
      dendroCustom: {},
      linkedDendro: 'dendro-default',
      metadataAttributes: ['FT10', 'FT16'],
      maxIndex: null,
      childsSelected: [],
      nodesAggArray: [],
      aggregatedSampleString: [],
      aggregatedChilds: [],
      aggregatedPhenos: [],
      aggrIndex: [],
      aggregatedRows: [],
      selectedGroups: [],
      counter: 0,
      visualRefSelected: 'none',
      boolGroups: false,
      selectionGroups: [],
      altSelection: [],
      selectionLst: [],
      levelCollapse: 12,
      boolSorted: {
        position: true,
        phenos: true
      },
      currentSortRow: null,
      showCoreSNP: false,
      colorsGroups: [
        {'color':'cbBrown', 'hexcode':'#b15928'},
        {'color':'cbYellow', 'hexcode':'#fbdb5a'},
        {'color':'cbDarkBlue', 'hexcode':'#1f78b4'},
        {'color':'cbGreen', 'hexcode':'#38c7a6'},
        {'color':'cbSalmon', 'hexcode':'#fb9a99'},
        {'color':'cbOrange', 'hexcode':'#ff7f00'},
        {'color':'cbDarkPurple', 'hexcode':'#766aaf'},
        {'color':'cbBrown2', 'hexcode':'#b15928'},
        {'color':'cbYellow2', 'hexcode':'#fbdb5a'},
        {'color':'cbDarkBlue2', 'hexcode':'#1f78b4'},
        {'color':'cbGreen2', 'hexcode':'#38c7a6'},
        {'color':'cbSalmon2', 'hexcode':'#fb9a99'},
        {'color':'cbOrange2', 'hexcode':'#ff7f00'},
        {'color':'cbBrown3', 'hexcode':'#b15928'},
        {'color':'cbYellow3', 'hexcode':'#fbdb5a'},
        {'color':'cbDarkBlue3', 'hexcode':'#1f78b4'},
        {'color':'cbGreen3', 'hexcode':'#38c7a6'},
        {'color':'cbSalmon3', 'hexcode':'#fb9a99'},
        {'color':'cbOrange3', 'hexcode':'#ff7f00'},
        {'color':'cbDarkPurple3', 'hexcode':'#766aaf'},
    ],
      colorsGroups2: [
        "Aqua",
        "Aquamarine",
        "Bisque",
        "BlueViolet",
        "BurlyWood",
        "CadetBlue",
        "Chartreuse",
        "Chocolate",
        "Coral",
        "CornflowerBlue",
        "Crimson",
        "DarkCyan",
        "DarkGoldenRod",
        "DarkGreen",
        "DarkKhaki",
        "DarkMagenta",
        "DarkOliveGreen",
        "DarkOrange",
        "DarkOrchid",
        "DarkRed",
        "DarkSalmon",
        "DarkSeaGreen",
        "DarkSlateBlue",
        "DarkSlateGray",
        "DarkTurquoise",
        "DarkViolet",
        "DeepPink",
        "DeepSkyBlue",
        "DodgerBlue",
        "FireBrick",
        "ForestGreen",
        "Fuchsia",
        "Gold",
        "GoldenRod",
        "Green",
        "GreenYellow",
        "HotPink",
        "IndianRed",
        "Indigo",
        "Khaki",
        "Lavender",
        "LavenderBlush",
        "LawnGreen",
        "LemonChiffon",
        "LightBlue",
        "LightCoral",
        "LightCyan",
        "LightGoldenRodYellow",
        "LightGreen",
        "LightPink",
        "LightSalmon",
        "LightSeaGreen",
        "LightSkyBlue",
        "LightSlateGray",
        "LightSteelBlue",
        "Lime",
        "LimeGreen",
        "Linen",
        "Magenta",
        "Maroon",
        "MediumAquaMarine",
        "MediumBlue",
        "MediumOrchid",
        "MediumPurple",
        "MediumSeaGreen",
        "MediumSlateBlue",
        "MediumSpringGreen",
        "MediumTurquoise",
        "MediumVioletRed",
        "MidnightBlue",
        "MistyRose",
        "Moccasin",
        "Navy",
        "Olive",
        "OliveDrab",
        "Orange",
        "OrangeRed",
        "Orchid",
        "PaleGoldenRod",
        "PaleGreen",
        "PaleTurquoise",
        "PaleVioletRed",
        "PapayaWhip",
        "PeachPuff",
        "Peru",
        "Pink",
        "Plum",
        "PowderBlue",
        "Purple",
        "RebeccaPurple",
        "Red",
        "RosyBrown",
        "RoyalBlue",
        "SaddleBrown",
        "Salmon",
        "SandyBrown",
        "SeaGreen",
        "Sienna",
        "SkyBlue",
        "SlateBlue",
        "SlateGray",
        "SpringGreen",
        "SteelBlue",
        "Tan",
        "Teal",
        "Thistle",
        "Tomato",
        "Turquoise",
        "Violet",
        "Wheat",
        "Yellow",
        "YellowGreen",
      ]

    }
  },
  computed: {
    nucStructureData() {

      let data = this.data_nuc_structure

      // console.log('data nuc structure', data)
      let chosen_ref = this.annotation_ref

      if (chosen_ref == 'no-choice'){

        chosen_ref = this.annotationRefs[0]

      }

      let data_ref = data.filter(({mRNA_id}) => mRNA_id == chosen_ref)  

      let region = this.data_region
      let lowEnd = Number(region.split("-")[0]);
      let highEnd = Number(region.split("-")[1]);
      function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd); 

      let dataHeatM = data_ref.filter(({ position }) =>
        regionArray.includes(Number(position))
      )

      let showPositions = this.colFilter

      let dataFiltered = dataHeatM.filter(function (d) {
        if (showPositions == 'all') {
          return d
        } if (showPositions == 'var') {
          return d.variable == 'True'
        } if (showPositions == 'var-inf') {
          return d.informative == 'True' //1
        } if (showPositions == 'no-choice') {
          return d
        }
      })
      return dataFiltered
      },
      annotationRefs(){
      let data = this.data_nuc_structure

      let refs = d3.map(data, d => d.mRNA_id)
      refs = new Set(refs)
      let refsArr = Array.from(refs)
      return refsArr.sort()
    },
    getCoreSNP(){
      let tree = this.core_snp

      // code to parse newick based on Jason Davies newick.js: https://github.com/jasondavies/newick.js/blob/master/src/newick.js
      function parseNewick(a) {
        for (
          var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0;
          t < s.length;
          t++
        ) {
          var n = s[t];
          switch (n) {
            case "(":
              var c = {};
              (r.children = [c]), e.push(r), (r = c);
              break;
            case ",":
              var d = {};
              e[e.length - 1].children.push(d), (r = d);
              break;
            case ")":
              r = e.pop();
              break;
            case ":":
              break;
            default:
              var h = s[t - 1];
              // append t to r.name in line below to deal with internal nodes of tree
              // with duplicate names. strip t from name before displaying in code below.
              ")" == h || "(" == h || "," == h
                ? (r.name = n +"+"+ t)
                : ":" == h && (r.length = parseFloat(n));
          }
        }
        return r;
      }

      let data = parseNewick(tree);
      // console.log("data tree parsed", data);
      
      return data
    },
    getCoreSNPLeafs(){
      let dataDendro = this.getCoreSNP

      //  assigns the data to a hierarchy using parent-child relationships
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
 
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        leafNames.push(e.data.name)
      })

      let leafNamesClean = []
      let mrnas = this.phenosNamesAll

      for (let i=0; i< leafNames.length; i++){
        let leaf = leafNames[i].split('+')[0]
        let mrna_name = mrnas.filter(d => d.split('_')[0] == leaf)[0]
        leafNamesClean.push(mrna_name)      


      }
      return leafNamesClean
    },
    groupToCollapse(){
      let data = this.group_collapse

      return data
    },
    groupToExpand(){
      let data = this.group_expand

      return data
    },
    groupToDelete(){
      let data = this.group_delete

      return data
    },
    groupToDecolor(){
      let data = this.group_decolor

      return data
    },
    groupToColor(){
      let data = this.group_color
      return data
    },
    bipartiteClass() {
      if (this.rowSort == 'dendro-custom' && this.toggleButton == true && this.aggregatedRows.length == 0) {
        
        return "hide-bp";

      } else {

        return "show-bp";

      }
    },
    disableDendroCalc() {

      let disableDendroCalc = true
      let selected = this.$store.getters.selectedPositions
      if (selected.length == 0) {
        disableDendroCalc = true
      } else {
        disableDendroCalc = false
      }

      return disableDendroCalc

    },
    svgHeight() {

      return this.svgWidth

    },
    subsetTest() {

      let mRNA_arr = ['OHGOGCPB_00390_mRNA','GPNGIIIH_02659_mRNA', 'HPCCBOLC_00315_mRNA', 'NEMGJIOM_02934_mRNA', 'JABGGEHE_02935_mRNA', 'HMLEEMND_02189_mRNA', 'JFCHIFII_02929_mRNA', 'EGNJAKAP_01922_mRNA']

      return mRNA_arr

    },
    dataPhenos(){

      let data = this.data_phenos

      for (let i=0;i < data.length; i++){
        data[i]['group'] = null
      }


      if (this.aggregatedRows.length !== 0){
        this.$store.dispatch('setGroups', this.aggregatedRows)

        let mrnaArr = d3.map(data, function (d) {
          return d.mRNA_id
          })

        for (let i=0;i < this.aggregatedRows.length; i++){

          let idx = mrnaArr.indexOf(this.aggregatedRows[i]['mRNA_id'])
          data[idx]['group'] = this.aggregatedRows[i]['group']
        }

        
      }
     
      return data
    },
    dataSequences(){

      return this.data_heatmap
    },
    dataPhenosFiltered() {

      let dataPheno = this.dataPhenos
      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let data_aggr_phenos = this.aggregatedPhenos
      let showRows = this.rowFilter

      let dataPhenos = dataPheno.filter(function (d){
        if (showRows == 'all') {
          return d
        }
        })
       
      if (showRows == 'subset') {

        dataPhenos = dataPheno.filter(({ mRNA_id }) =>
          mRNA_arr.includes(mRNA_id))

      }

      let dataPhenotypes = dataPhenos

       // delete aggregated 
      if (data_aggr.length !== 0){

        let dataPhenotypesDel = dataPhenos.filter(({ mRNA_id }) =>
          !this.nodesAggArray.includes(mRNA_id))

        dataPhenotypes = dataPhenotypesDel.concat(data_aggr_phenos)

      }      
      return dataPhenotypes

    },
    currentSortingOrder(){
      let sortingOrder;
      if (this.currentSort == null){
        sortingOrder = this.dendroLeaves
      }
      else{
        sortingOrder = this.currentSort
      }
      return sortingOrder
      
    },
    currentSortingOrderAll(){
      let sortingOrder;
      if (this.currentSortAll == null){
        sortingOrder = this.dendroLeavesAll
      }
      else{
        sortingOrder = this.currentSortAll
      }
      this.$store.dispatch('setCurrentSortingOrderRows', sortingOrder)
      return sortingOrder
      
    },
    dataPhenosFilteredSortedCurrent() {

     
      let sortingOrder = this.currentSortingOrderAll
      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let aggr_idx = this.aggrIndex;
      let phenos_by_current_order = []

      
      if (data_aggr.length !== 0){

        sortingOrder = sortingOrder.filter(d => !this.nodesAggArray.includes(d))

        for (let i= 0; i < aggr_idx.length; i++){
            let idx = this.aggrIndex[i]

            sortingOrder.splice(idx, 0, this.aggregatedSampleString[i])
        }

        sortingOrder = [... new Set(sortingOrder)]

      }

      if (this.rowFilter == 'all' && data_aggr.length == 0){


        sortingOrder = this.currentSortingOrderAll

      }

      if (this.rowFilter == 'subset'){

        sortingOrder = sortingOrder.filter(d => mRNA_arr.includes(d)) //???

      }


      for (let i = 0; i < this.phenosNames.length; i++) {

        let idx = this.phenosNames.indexOf(sortingOrder[i])
        phenos_by_current_order.push(this.dataPhenosFiltered[idx])
      
      }


      return phenos_by_current_order

    },
    dataPhenosSortedCurrent() {

      let phenos_by_current_order = []
     


      for (let i = 0; i < this.phenosNamesAll.length; i++) {

        let idx = this.phenosNamesAll.indexOf(this.currentSortingOrderAll[i])

        phenos_by_current_order.push(this.data_phenos[idx])
      
      }

      return phenos_by_current_order

    },
    metadataCurrentOrderIdx() {

      let data = this.dataPhenosSortedCurrent

      let values_idx = []

      for (let i = 0; i < data.length; i++) {
        let row = {'idx': i, 'FT10': data[i].FT10, 'FT16': data[i].FT16,'mRNA_id': data[i].mRNA_id, 'group': data[i].group}

        values_idx.push(row)

      }

      return values_idx

    },
    metadataFilteredCurrentOrderIdx() {

      let data = this.dataPhenosFilteredSortedCurrent

      let values_idx = []

      for (let i = 0; i < data.length; i++) {

        let row = {'idx': i, 'FT10': data[i].FT10, 'FT16': data[i].FT16, 'mRNA_id': data[i].mRNA_id, 'group': data[i].group}

        values_idx.push(row)

      }
      return values_idx

    },
   
    rowSorterCurrentAll() {

    let data = this.metadataCurrentOrderIdx
    let rowSorting;
  
    rowSorting = this.getRowSorting2(data, this.rowSort, 'median')


    return rowSorting

    },
    newSortwithAggregated(){

      let dataByGroup = d3.group(this.aggregatedRows, d => d.group)
      let keysGroups = [...dataByGroup.keys()]
      let tmpSortingArr = _.cloneDeep(this.currentSortingOrderAll)


      for (let i = 0; i < keysGroups.length; i++){
        let groupedIdxArr = [];
        let groupKey = keysGroups[i]
        let groupValues = d3.map(dataByGroup.get(groupKey), function (d) {
          return d['mRNA_id']
        })
        for (let i = 0; i < groupValues.length; i++){
          groupedIdxArr.push(tmpSortingArr.indexOf(groupValues[i]))

        }

        tmpSortingArr = tmpSortingArr.filter(d => !groupValues.includes(d))

        tmpSortingArr.splice(Math.round(d3.min(groupedIdxArr)), 0, [...groupValues].sort().join('+')) 


          let sortSecond = []
          if (this.rowSort === 'FT16' | this.rowSort === 'FT10'){
          let tmpSortingArrData = _.cloneDeep(this.dataPhenosFilteredSortedCurrent)

          for (i=0;i<tmpSortingArrData.length; i++){
            let id = tmpSortingArrData[i]['mRNA_id']
            let phenoFT10 =  parseFloat(tmpSortingArrData[i]['FT10'])
            if (phenoFT10.length > 1){ phenoFT10 = phenoFT10[1]}
            let phenoFT16 =  parseFloat(tmpSortingArrData[i]['FT16'])
            if (phenoFT16.length > 1){ phenoFT16 = phenoFT16[1]}

            sortSecond.push({'mRNA_id':id, 'FT10':phenoFT10, 'FT16':phenoFT16}
            )
          }

          }

          if (this.rowSort === 'FT10'){
            let sortedSecond =  this.sortDataBy(sortSecond, 'FT10') 
            tmpSortingArr = sortedSecond.map(el => el.mRNA_id)
          }

          if (this.rowSort === 'FT16'){
            sortSecond =  this.sortDataBy(sortSecond, 'FT16') 
            tmpSortingArr = sortSecond.map(el => el.mRNA_id)
          }

      }
      this.$store.dispatch('setCurrentSortingOrderWithAggr', tmpSortingArr)
      return tmpSortingArr

    },
    metadataDictCat() {

      let data = this.data_phenos

      let metadata_dict = {}

      for (let i = 0; i < this.metadataAttributes.length; i++) {
 
        let attr = this.metadataAttributes[i]
        let cat =  this.getCategories(data,attr)

        metadata_dict[attr] = cat
      }
      return metadata_dict

    },
    dataSequencesMaxIndex() {

      return this.dataSequences.length

    },
    dataSequencesFiltered() {

      let dataHeatmap = this.data_heatmap 
      let mRNA_arr = this.subsetTest
      let aggregatedChilds = this.aggregatedChilds

      let showRows = this.rowFilter

      let region = this.data_region
      let lowEnd = Number(region.split("-")[0]);
      let highEnd = Number(region.split("-")[1]);
      function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd); 
      let dataHeatM = dataHeatmap.filter(({ position }) =>
          regionArray.includes(Number(position))
      )

      let dataHeat = dataHeatM.filter(function (d){
        
        if (showRows == 'all') {
          return d
        }
      })
       
      if (showRows == 'subset') {

          dataHeat = dataHeatM.filter(({ mRNA_id }) =>
            mRNA_arr.includes(mRNA_id))
            
      }

      // add aggregated row
      if (aggregatedChilds.length !== 0){

        let aggregatedChildsRegion = aggregatedChilds.filter(({ position }) =>
          regionArray.includes(Number(position))
        )

        dataHeat = dataHeatM.concat(aggregatedChildsRegion)

      } 

      let showPositions = this.colFilter

      let dataFiltered = dataHeat.filter(function (d) {
        if (showPositions == 'all') {
          return d
        } if (showPositions == 'var') {
          return d.variable == 'True'
        } if (showPositions == 'var-inf') {
          return d.informative == 'True' //1
        } if (showPositions == 'no-choice') {
          return d
        }
      })

      if (showPositions == 'pheno-spec') {
        // get phenotype specific positions
        let positionsPheno = dataHeat.filter(function (d) {
          return d.pheno_specific == 'True' //1
        })
        positionsPheno = d3.map(positionsPheno, function (d) {
          return d.position
        })
        positionsPheno = new Set(positionsPheno)
        positionsPheno = Array.from(positionsPheno)
        
        dataFiltered = dataHeat.filter(({ position }) =>
          positionsPheno.includes(position)
        )
        return dataFiltered
      }

    
      return dataFiltered
    },
    dataSequencesFilteredAll() {

      let dataHeatmap = this.data_heatmap 

      let showRows = this.rowFilter
      let region = this.data_region
      let lowEnd = Number(region.split("-")[0]);
      let highEnd = Number(region.split("-")[1]);
      function range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd); 
      let dataHeat = dataHeatmap.filter(({ position }) =>
          regionArray.includes(Number(position))
      )

      let showPositions = this.colFilter
      let dataFiltered = dataHeat.filter(function (d) {
        if (showPositions == 'all') {
          return d
        } if (showPositions == 'var') {
          return d.variable == 'True'
        } if (showPositions == 'var-inf') {
          return d.informative == 'True' //1
        } if (showPositions == 'no-choice') {
          return d
        }
      })

      if (showPositions == 'pheno-spec') {
        let positionsPheno = dataHeat.filter(function (d) {
          return d.pheno_specific == 'True' //1
        })
        positionsPheno = d3.map(positionsPheno, function (d) {
          return d.position
        })
        positionsPheno = new Set(positionsPheno)
        positionsPheno = Array.from(positionsPheno)        
        dataFiltered = dataHeat.filter(({ position }) =>
          positionsPheno.includes(position)
        )
        return dataFiltered
      }


      return dataFiltered
      },

      visualRefData(){
        let data = this.dataSequencesFilteredSortedCurrent
      
        let dummyVR = this.phenosNamesCopy[0]['mRNA_id']
        let VR = this.visualRefSelected

        let dataVR = data.filter(function (d) {
          return d.mRNA_id == dummyVR 
          })


        if (VR !== 'none'){
          dataVR = data.filter(function (d) {
          return d.mRNA_id == VR 
          })

        }

        return dataVR

      },
    dataSequencesFilteredSortedCurrent() {

        let dataSortedCurrent = [];
        for (let i = 0; i < this.dendroLeaves.length; i++) {


          let row = this.dataSequencesFiltered.filter(({ mRNA_id }) =>
           mRNA_id == this.dendroLeaves[i]
          )

          Array.prototype.push.apply(dataSortedCurrent, row)

        }
        return dataSortedCurrent

    },
    phenosNames() {
      let phenosData = this.dataPhenosFiltered

      var phenosNames = d3.map(phenosData, function (d) {
        return d.mRNA_id
      })
      phenosNames = new Set(phenosNames)
      phenosNames = Array.from(phenosNames)

      return phenosNames

    },
    phenosNamesAll() {

      var phenosNames = d3.map(this.data_phenos, function (d) {
        return d.mRNA_id
      })
      phenosNames = new Set(phenosNames)
      phenosNames = Array.from(phenosNames)
      return phenosNames

    },
    phenosNamesCopy(){
      let data = _.cloneDeep(this.yLabelsNames);
      data.sort()
  

      let dataWithGroups = []
      for (let i=0; i<data.length; i++){

        let group = data[i]

        if (data[i].split('+').length > 1){
          let all_ids = data[i].split('+')
          group = this.$store.getters.getGroupsSelected.filter(({mRNA_id}) => all_ids.includes(mRNA_id))
          group = d3.map(group, d => d.group)
          group = [...new Set(group)][0]
         

        }

        dataWithGroups.push({'group':group, 'mRNA_id':data[i]})
        dataWithGroups = dataWithGroups.filter(({group}) => String(group).split('|').length == 1) //filter out VCF 


      }
      return dataWithGroups
    },
    yLabelsNames() {
    
      return this.phenosNames

    },
    numYLabels() {

      return this.yLabelsNames.length

    },
     numYLabelsNew() {

      return this.yLabelsNamesNew.length

    },
    numYLabelsAll(){

      return this.phenosNamesAll.length

    },
    dendroDefault() {

      return this.data_dendro

    },
    dendroLeavesDefault(){

      let dataDendro =  this.dendroDefault

      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        leafNames.push(e.data.name)
      })

      return leafNames //.reverse()

    },
    dendroLeavesDefaultFiltered(){

      let leafNames = this.dendroLeavesDefault

      let showRows = this.rowFilter
      if (showRows == 'subset'){
        leafNames = leafNames.filter(item => this.phenosNames.includes(item));
      }
      if (this.aggregatedSampleString.length !== 0){
        leafNames = leafNames.filter(item => this.phenosNames.includes(item));
      

        let aggr_idx = this.aggrIndex
        for (let i= 0; i < aggr_idx.length; i++){
            let idx = this.aggrIndex[i]


            leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }
         
      }

      return leafNames //.reverse()

    },
    dendroLeavesAll() {

      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default'){ 
        dataDendro = this.dendroDefault
      }

      else { 
        dataDendro = this.dendroCustom
      }

      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
 
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        leafNames.push(e.data.name)
      })

      return leafNames //.reverse()

    },
    dendroLeaves() {

      let leafNames = this.dendroLeavesAll
      let showRows = this.rowFilter
      if (showRows == 'subset'){
        leafNames = leafNames.filter(item => this.phenosNames.includes(item));
      }

      if (this.aggregatedSampleString.length !== 0){
        leafNames = leafNames.filter(item => this.phenosNames.includes(item));
     
        
        let aggr_idx = this.aggrIndex
        for (let i= 0; i < aggr_idx.length; i++){
            let idx = this.aggrIndex[i]

            leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }

      }

      return leafNames //.reverse()

    },
    root() {

      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default' && this.toggleButton == true){
        dataDendro = this.dendroDefault

      }
      if (this.linkedDendro == 'dendro-custom' && this.toggleButton == true){
        dataDendro = this.dendroCustom

      }

      if (this.toggleButton == false){

        if (this.showCoreSNP == true){
          dataDendro = this.getCoreSNP 

        }
        else{
         dataDendro = this.dendroDefault

        }

      }

      var root = d3.hierarchy(dataDendro, function (d) {

        return d.children

      })

      return root

    },
    dendroDepth() {

      let nodesArray = this.root.leaves()
      let leafDepths = []
      nodesArray.forEach((e) => {
        leafDepths.push(e.depth)
      })

      return leafDepths //.reverse()

    },
    dendroX() {

      let dataNodes = this.colCluster(this.root).descendants()
      let leafs = []
      dataNodes.forEach((e) => {
        leafs.push(e.x)
      })

      return leafs //.reverse()

    },
    dendroXgroups() {

      let dataNodes = this.colCluster(this.root).descendants()
      let lst_nodes = []
      let level = this.levelCollapse
      dataNodes.forEach((e) => {
        if (e.height <= level && e.height > 0){ //omit leafs 
              lst_nodes.push(e.data.name)
              
            }
      })
      lst_nodes.sort((a, b) => b.length - a.length)

      let lst_nodes_included = []
      let lst_nodes_aggr_initial = lst_nodes.filter(function (d) {

          let arr1 = d.split('+')

          const containsAll = arr1.every(element => {
            return lst_nodes_included.includes(element);
          });

            if (containsAll == true){
              return false

            }
            else{
              lst_nodes_included = [...lst_nodes_included.concat(d.split('+'))]
              return true
            }
          
        })
        
      return lst_nodes_aggr_initial //.reverse()

      },
    dendroHeight() {

      return ('translate(' + 10 + ',' + (Math.abs(d3.min(this.dendroX)) + 6) + ')')

    },
    colCluster() {
      
      return (
        d3
          .cluster()
          .nodeSize([
            this.cellSize,
            this.dendroWidth / d3.max(this.dendroDepth),
          ]) 

          .separation(function (a, b) {
            return a.parent == b.parent ? 1 : 1
          })
      )

    },
    
    xLabelsNames() {

      let starttime = new Date()
      var xLabelsNames = d3.map(this.dataSequencesFiltered, function (d) {
        return d.position
      })

      xLabelsNames = new Set(xLabelsNames)
      xLabelsNames = Array.from(xLabelsNames)

      this.$store.dispatch('setPositionsCheckboxes', xLabelsNames)

      return xLabelsNames

    },
    numXLabels() {

      return this.xLabelsNames.length

    },
    xLabelsNamesAll() {

      var xLabelsNames = d3.map(this.data_heatmap, function (d) {
        return d.position
      })
      xLabelsNames = new Set(xLabelsNames)
      xLabelsNames = Array.from(xLabelsNames)

      return xLabelsNames

    },
    numXLabelsAll() {

      return this.xLabelsNamesAll.length

    },
    chartWidth() {

      return this.cellSize * this.numXLabels + 10

    },
    chartHeight() {

      return this.cellSize * this.numYLabelsAll + 10

    },
    heatmapStyle() {

      let width = this.chartWidth + 5
      let mWidth = this.bipartiteWidthTotal * 5.75
      if (width < mWidth){
        return ('max-width:' + width + 'px')
      }
      else{
        return ('max-width:' + mWidth + 'px')
      }

    },
    chartHeightMax() {

      return (this.cellSize * this.dendroLeavesDefault.length) + 10

    },
    colorScaleNuc() {

      let cellColors = this.cellColors

      var scale

      if (cellColors == 'default') {
        scale = d3
          .scaleOrdinal()
          .domain(['A', 'C', 'G', 'T', 'a', 'c', 'g', 't', '-'])
          .range([
            '#c7ceea',
            '#dcbed4',
            '#d2dcc5',
            '#c5b8a6',

            '#c7ceea',
            '#dcbed4',
            '#d2dcc5',
            '#c5b8a6',

            '#f6ffff',
           
          ])
      }

      if (cellColors == 'default2') {
        scale = d3
          .scaleOrdinal()
          .domain(['A', 'C', 'G', 'T', 'a', 'c', 'g', 't', '-'])
          .range([
            '#89b2ff',
            '#8fca85',
            '#fdcffe',
            '#f99372',

            '#89b2ff',
            '#8fca85',
            '#fdcffe',
            '#f99372',

            '#f6ffff',
          ])
      } else if (cellColors == 'clustal') {
        scale = d3
          .scaleOrdinal()
          .domain(['A', 'C', 'G', 'T', 'a', 'c', 'g', 't', '-'])
          .range([

          "#fb8072",
          "#80b1d3",
          "#fdb462",
          "#b3de69",

          "#fb8072",
          "#80b1d3",
          "#fdb462",
          "#b3de69",

          ])
      } else if (cellColors == 'cg-at') {
        scale = d3
          .scaleOrdinal()
          .domain(['C', 'G', 'c', 'g', 'A', 'T', 'a', 't', '-'])
          .range([
            '#dfd266',
            '#dfd266',
            '#dfd266',
            '#dfd266',

            '#e29eb6',
            '#e29eb6',
            '#e29eb6',
            '#e29eb6',

            '#f6ffff',

          ])
      } else if (cellColors == 'pur-pyr') {
        scale = d3
          .scaleOrdinal()
          .domain(['A', 'G', 'a', 'g', 'C', 'T', 'c', 't', '-'])
          .range([
            '#a463ce',
            '#a463ce',
            '#a463ce',
            '#a463ce',

            '#9fd0cb',
            '#9fd0cb',
            '#9fd0cb',
            '#9fd0cb',

            '#f6ffff',
          ])
      }

      return scale

    },
  },
  methods: {

    sortDataBy (data, byKey){
        let sortedData;
        sortedData = data.sort(function(a,b){
          if (a[byKey] === b[byKey]) {
                return 0;
            }
            else {
                return (a[byKey] < b[byKey]) ? -1 : 1;
            }
        })

        return sortedData


    },

    initialCollapse(lst_nodes_aggr_initial){

      let vis = this;

       // get most recent file from store 
       vis.selectedGroups = vis.$store.getters.getGroupsSelected

      for (let j=0; j < lst_nodes_aggr_initial.length; j++){

          let nodeAggInit = lst_nodes_aggr_initial[j]
        
          let nodeAggArr = nodeAggInit.split("+");
          let nodeAgg = nodeAggArr.sort().join("+")

          let color = vis.colorsGroups.shift()

          let colorName =color['color']
          let colorHex =color['hexcode']

          for (let i =0; i < nodeAggArr.length; i++){
          let nr = vis.counter
          
          vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i], 'color': colorName, 'colorHex': colorHex, 'checkedColor': false, 'checkedCollapse': true})
          vis.selectedGroups.push({'group': nr, 'mRNA_id':nodeAggArr[i], 'color': colorName, 'colorHex': colorHex, 'checkedColor': false, 'checkedCollapse': true})
        
        }

        this.$store.dispatch('setGroups', vis.aggregatedRows)
        this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

        // make color classess 
        var styleText = document.createElement('style');
        styleText.type = 'text/css';
        styleText.innerHTML = 'text.group-selection-'+colorName+' { fill: '+colorHex+';   font-weight: bold; }';

        document.getElementsByTagName('head')[0].appendChild(styleText);

        var styleLinks = document.createElement('style');
        styleLinks.type = 'text/css';
        styleLinks.innerHTML = 'path.group-selection-'+colorName+' { stroke: '+colorHex+'; z-index: 2000;}';

        document.getElementsByTagName('head')[0].appendChild(styleLinks);

        var styleNodePheno = document.createElement('style');
        styleNodePheno.type = 'text/css';
        styleNodePheno.innerHTML = 'circle.group-selection-'+colorName+' { stroke: '+colorHex+'; }';

        document.getElementsByTagName('head')[0].appendChild(styleNodePheno);

        var styleRowAggr = document.createElement('style');
        styleRowAggr.type = 'text/css';
        styleRowAggr.innerHTML = 'rect.group-selection-'+colorName+' { stroke: '+colorHex+' !important; }';

        document.getElementsByTagName('head')[0].appendChild(styleRowAggr);

        var styleRow = document.createElement('style');
        styleRow.type = 'text/css';
        styleRow.innerHTML = 'rect.row-selection-'+colorName+' { stroke: '+colorHex+';  stroke-dasharray: 10,9,10,9 stroke-width: 1; stroke-linecap: square; }';

        document.getElementsByTagName('head')[0].appendChild(styleRow);


        if (vis.maxIndex == null){
          vis.maxIndex = vis.dataSequencesMaxIndex

        }


        let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id))

        let aggregatedChildsPhenos = []
          let ft10Sum = [];
          let ft10missing = [];
          let ft16Sum = [];
          let ft16missing= [];
          
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              ft10Sum.push(parseFloat(dataPhenosChilds[i]['FT10']))
              ft16Sum.push(parseFloat(dataPhenosChilds[i]['FT16']))
              if (dataPhenosChilds[i]['FT10'] == '?'){
                ft10missing.push('?')
              }
              if (dataPhenosChilds[i]['FT16'] == '?'){
                ft16missing.push('?')
              }
          }


          aggregatedChildsPhenos.push(
              { 
                mRNA_id: nodeAgg,
                FT10: ft10missing.length < 0 ? d3.mean(ft10Sum) : [d3.mean(ft10Sum),ft10missing.length],
                FT16: ft16missing.length < 0 ? d3.mean(ft16Sum) : [d3.mean(ft16Sum),ft16missing.length],
                group: vis.counter,
              }
            )

        vis.counter ++;

        let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id))

        let groupedChilds = d3.groups(
          dataFilteredChilds,
          d => d.position,
          d => d.nucleotide,
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable

        )
        let aggregatedChilds = []
        
        groupedChilds.forEach(function(el) {

            vis.maxIndex += 1

            let idx = vis.maxIndex
            let pos = el[0]
            let nuc = el[1]
            if (nuc.length > 1) {
              let multi = [];
              for (let i = 0; i < nuc.length; i++) {
                multi.push(nuc[i][0])

              }
              let multiCaseSort = multi.sort(function (a, b) {
                  return a.localeCompare(b);
              });
              
           
              nuc =multiCaseSort.join('|')


            }
            else{
              nuc = el[1][0][0]
            }
            let info = el[1][0][1]
            let infoSum = [];
            let phenoSum = [];
            let varSum = [];
              for (let i = 0; i < info.length; i++) {
                infoSum.push(info[i]['informative'])
                phenoSum.push(info[i]['pheno_specific'])
                varSum.push(info[i]['variable'])

            }
        
            // add elements to new array
            aggregatedChilds.push(
              { 
                index: String(idx),
                position: pos,  
                nucleotide: nuc,
                mRNA_id: nodeAgg,
                variable: [... new Set(varSum)].join("|"),
                informative: [... new Set(infoSum)].join("|"),
                pheno_specific: [... new Set(phenoSum)].join("|")
              }
            )
            
          }
        );

        
        let aggrIndeces = []

        for (let j = 0; j < nodeAggArr.length; j++) {
          aggrIndeces.push(vis.currentSortingOrderAll.indexOf(nodeAggArr[j]))
        } 



        vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
        vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
        vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
        vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]

        vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list


        vis.currentSortAll = vis.rowSorterCurrentAll
       
      }
      

    },
    drawView() {
      let vis = this;

      vis.groupToDelete
      vis.groupToDecolor

      let sortOrder = vis.rowSorterCurrentAll
      if (vis.rowFilter == 'subset' | vis.aggregatedSampleString.length !== 0){
        sortOrder = vis.rowSorterCurrent
      }

      vis.dataPhenos
      vis.dataSequences

      vis.drawDendro()
      vis.drawBipartite(sortOrder)
      vis.drawAnnotations()
      vis.drawHeatMap(sortOrder)
      vis.drawPhenotypes(sortOrder)

    },
    drawDendro() {

      // let starttime = new Date()
      // console.log('drawing dendrogram...')

      //// make dendro
      let vis = this;
      let dendroGraph = this.dendroGroup
      const t_dendro = dendroGraph.transition().duration(vis.transitionTime)

      let dataLinks = vis.colCluster(vis.root).links()

      let dataNodes = vis.root.descendants()

      let dendroDepth = vis.dendroDepth

      let dendroX = vis.dendroX

      const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

      dendroGraph
        .selectAll('path.linkDendro')
        .data(dataLinks)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linkDendro')
              .attr('fill', 'none')              
              .attr('stroke','rgba(192, 192, 192, 0.5)')
              .attr('d', (d) => vis.elbow(d)),
          (update) =>
            update
            .call((update) =>
              update.transition(t_dendro).attr('d', (d) => vis.elbow(d)).attr('stroke', 'rgba(192, 192, 192, 0.5)')
            ),
          (exit) => exit
          .call((exit) =>
              exit.transition(t_dendro).attr('stroke', 'rgba(192, 192, 192, 0)').remove())
        )

      dendroGraph
        .selectAll('circle.nodeDendro')
        .data(dataNodes)
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'nodeDendro')
              .attr('name', function (d) {
                return d.data.name
              })
              .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')'
              })
              .attr('r', 3.5)
              .style('fill', function (d) {
                if ((d.height == '0') | (d.depth == '0')) {
                  return 'none'
                } else {
                  return 'rgba(192, 192, 192, 0.5)'
                }
              }),
          (update) =>
            update
            .attr('name', function (d) {
                return d.data.name
              })
              .call((update) =>
              update.transition(t_dendro)
              .attr('transform', function (d) {
                return 'translate(' + d.y + ',' + d.x + ')'
              })
              .style('fill', function (d) {
                if ((d.height == '0') | (d.depth == '0')) {
                  return 'none'
                } else {
                  return 'rgba(192, 192, 192, 0.5)'

                }
              })
            ),
          (exit) => exit.remove()
        )
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){


          if ((event.altKey || event.ctrlKey)){
            event.preventDefault();
            let childs = d3.select(this).attr('name')
            vis.childs = childs;
            const childsSelected = childs.split("+").sort();
            vis.childsSelected = [...vis.childsSelected.concat(childsSelected)]


            if (d3.select(this).attr("class") == 'nodeDendro node-selection'){
              d3.select(this).classed('node-selection', false)
             

              d3.selectAll(".rowLabel")
              .filter(function() {
                return childsSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
              })
              .classed('text-selection', false)

              d3.selectAll(".linksBp")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('link-selection', false)

              d3.selectAll(".nodesSource")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('node-selection', false)

              d3.selectAll(".nodesTarget")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('node-selection', false)

              d3.selectAll(".cell")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('cell-selection', false)

              d3.selectAll(".pheno0")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('pheno-node-selection', false)

              d3.selectAll(".pheno1")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('text-selection', false)

              vis.childsSelected = [] //remove selection 

            }
            else {
              d3.selectAll(".nodeDendro")
              .filter(function(l) {
                  let arr = l.data.name.split("+").sort();    
                  return equals(childsSelected, arr) // filter by single attribute
              })
              .classed('node-selection', true)

              d3.selectAll(".rowLabel")
              .filter(function() {
                return childsSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
              })
              .classed('text-selection', true)

              d3.selectAll(".linksBp")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('link-selection', true)

              d3.selectAll(".nodesSource")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('node-selection', true)

              d3.selectAll(".nodesTarget")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('node-selection', true)

              d3.selectAll(".cell")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('cell-selection', true)

              d3.selectAll(".pheno0")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('pheno-node-selection', true)

              d3.selectAll(".pheno1")
              .filter(function(l) {
                return childsSelected.includes(l.mRNA_id)
              })
              .classed('text-selection', true)
            }

            let altSelection = []
            
              d3.selectAll(".pheno-node-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
              d3.selectAll(".text-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".aggr-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [... new Set(altSelection)]
          }
          else {
            let childs = d3.select(this).attr('name')
            vis.childs = childs;
            const childsSelected = childs.split("+").sort();
            vis.childsSelected = childsSelected

            // selection
            d3.selectAll('.nodeDendro').classed('node-selection', function (l, li) {
                
              let arr = l.data.name.split("+").sort();    
              return equals(childsSelected, arr)

            })

            d3.selectAll('.linksBp').classed('link-selection', function (l, li) {

              return childsSelected.includes(l.mRNA_id)

            })

            d3.selectAll('.nodesSource').classed('node-selection', function (l, li) {

            return childsSelected.includes(l.mRNA_id)

            })

            d3.selectAll('.nodesTarget').classed('node-selection', function (l, li) {

            return childsSelected.includes(l.mRNA_id)

            })

            d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
              
              return childsSelected.includes(l)

            })

            d3.selectAll('.cell').classed('cell-selection', function (l, li) {
              
              return childsSelected.includes(l.mRNA_id)

            })

            d3.selectAll('.pheno0').classed('pheno-node-selection', function (l, li) {
              
              return childsSelected.includes(l.mRNA_id)

            })

            d3.selectAll('.pheno1').classed('text-selection', function (l, li) {
              
              return childsSelected.includes(l.mRNA_id)

            })

            let altSelection = []
              d3.selectAll(".aggr-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".text-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".pheno-node-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [... new Set(altSelection)]

          }
        })
       

    },
    drawPhenotypes(sortingOrderArray) {

      // let starttime = new Date()
      // console.log('drawing phenotypes..')

      let dataMeta = this.dataPhenosFilteredSortedCurrent 
      
      let vis = this;

      let maxFT10 = d3.map(vis.data_phenos, (d) => d.FT10)  //global max
        maxFT10 = maxFT10.filter(d => d !== '?')
        let maxFT10nr = d3.map(maxFT10, (d) => parseFloat(d))
        let maxFT10nrSorted =  maxFT10nr.sort(function(a,b){
            if( !isFinite(a) && !isFinite(b) ) {
                return 0;
            }
            if( !isFinite(a) ) {
                return 1;
            }
            if( !isFinite(b) ) {
                return -1;
            }
            return a-b;
        });
        maxFT10nr = d3.max(maxFT10nr)

      //// make FT10 plot
      let pheno0Graph = this.pheno0Group
      const t_phenos0 = pheno0Graph.transition().duration(vis.transitionTime)
      pheno0Graph
        .selectAll('rect.pheno0')
        .data(dataMeta, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
        (enter) =>
            enter
            .append('rect')
              .attr('height', vis.cellSize-1)
              .attr('width', function (d) { 

                if( d.FT10 == '?'){
                  return 0
                }
                if (Array.isArray(d.FT10)){

                if( isNaN(d.FT10[0])){

                  return 0
                }

                }
                return (100)/maxFT10nr * parseFloat(d.FT10)})
       
              .attr('fill', function (d) {
                
                return '#878787' 
              })
              .attr('class', 'pheno0')
   
              .attr('x', 0)
              .attr('transform', 'translate(0,' + -0.5 + ')')

              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((enter) => enter.transition(t_phenos0).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos0)
                .attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos0).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);

          
          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))
          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }

          let sum = [];
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT10'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 20
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
               + groupNrSelected + '<br>' +
              '<strong>FT10: </strong>' +
              '<br>' + myStringCounts

            )
          
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
          }
        })
        .on('mouseout', function(event, d){
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)
          }
          else {
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
      
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          if ((event.altKey || event.ctrlKey)){
            event.preventDefault();
            d3.select(this).classed('aggr-selection', true)

            
            let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

            d3.selectAll('.rowLabel').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.rowAggr').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('aggr-selection', true)

                    d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

              d3.selectAll('.cell').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('cell-selection', true)

              d3.selectAll('.nodesSource').filter(function(d) {

                return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.nodesTarget').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.linksBp').filter(function(d) {
                return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('link-selection', true)


            let altSelection = []
               
                d3.selectAll(".text-selection").each(function(d,i) {
                let mrna = d3.select(this).attr("mRNA_id").split("+")
                altSelection = [...altSelection.concat(mrna)]
              })
              d3.selectAll(".aggr-selection").each(function(d,i) {
                let mrna = d3.select(this).attr("mRNA_id").split("+")
                altSelection = [...altSelection.concat(mrna)]
              })
              vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)){

                    
          const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
          const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
          const bbox = brush_selection.getBoundingClientRect();


          
              if (brush_selection.style.display !== 'none'
                && event.pageX > bbox.left
                && event.pageX < (bbox.left + bbox.width)
                && event.pageY > bbox.top
                && event.pageY < (bbox.top + bbox.height)) {

              return;

              
            }

            // Click happened on a dot, with no rectangle selection or outside the rectangle selection
            // so let's start a new selection :
            const new_click_event = new MouseEvent('mousedown', {
              pageX: event.pageX,
              pageY: event.pageY,
              clientX: event.clientX,
              clientY: event.clientY,
              layerX: event.layerX,
              layerY: event.layerY,
              bubbles: true,
              cancelable: true,
              view: window });
            brush_elm.dispatchEvent(new_click_event);
                
          }
          });

        pheno0Graph
        .selectAll('text.pheno0Label')
        .data(dataMeta, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
          (enter) =>
            enter
            .append('text')
              .attr('fill', function (d) {

                let nr =  parseFloat(d.FT10)
                nr = Math.round(nr) 
                if (d.FT10 == '?'){
                  return '#878787'
                }
                else{
                  return 'white'
                }

                })
              .attr('class', 'pheno0Label')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {

                let nr =  parseFloat(d.FT10)
                nr = Math.round(nr) 
                if (d.FT10 == '?'){
                  return 'start'
                }
                else{
                  return 'end'
                }
                
              })
              .text(function (d) {            
                let nr =  parseFloat(d.FT10)
                nr = Math.round(nr) 

                if (Array.isArray(d.FT10)){

                  if (d.FT10[0] == undefined){

                    return ''
                  }
                  else{
                    return  nr
                  }
                }
                else{
                  if (d.FT10 == '?'){
                  return d.FT10
                  }
                  else{
                    return  nr
                  }

                }
              })
              .attr('transform', function(d) {
                let widthBar
                let nr =  parseFloat(d.FT10)
                nr = Math.round(nr) 

                if (Array.isArray(d.FT10)){

                  if (d.FT10[0] == undefined){
                  widthBar = ((100)/maxFT10nr * 0)
                  }
                  else{
                    widthBar = ((100)/maxFT10nr * nr)-2
                  }


                  }
                  else{
                  if (d.FT10 == '?'){
                  widthBar = ((100)/maxFT10nr * 0)
                  }
                  else{
                  widthBar = ((100)/maxFT10nr * nr)-2
                  }

                  }
                return 'translate('+ widthBar + ',' + vis.cellSize / 1.4 + ')'

              })
              .attr('x', 0)
              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
         
              .call((enter) => enter.transition(t_phenos0).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos0).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos0).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);

          
          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }

          let sum = [];
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT10'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 20
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
               + groupNrSelected + '<br>' +
              '<strong>FT10: </strong>' +
              '<br>' + myStringCounts

            )
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function(event, d){
          event.preventDefault();
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)

          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

          if ((event.altKey || event.ctrlKey)){
            event.preventDefault();
            d3.select(this).classed('text-selection', true)
            d3.selectAll('.rowLabel').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.rowAggr').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('aggr-selection', true)

            d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

              d3.selectAll('.cell').filter(function() {
                return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
              }).classed('cell-selection', true)

            d3.selectAll('.nodesSource').filter(function(d) {

            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.nodesTarget').filter(function() {
            return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.linksBp').filter(function(d) {
            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('link-selection', true)

            let altSelection = []
              
                d3.selectAll(".text-selection").each(function(d,i) {
                let mrna = d3.select(this).attr("mRNA_id").split("+")
                altSelection = [...altSelection.concat(mrna)]
              })
              d3.selectAll(".aggr-selection").each(function(d,i) {
                let mrna = d3.select(this).attr("mRNA_id").split("+")
                altSelection = [...altSelection.concat(mrna)]
              })
              vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)){

                    
          const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
          const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
          const bbox = brush_selection.getBoundingClientRect();


             
              if (brush_selection.style.display !== 'none'
                && event.pageX > bbox.left
                && event.pageX < (bbox.left + bbox.width)
                && event.pageY > bbox.top
                && event.pageY < (bbox.top + bbox.height)) {

              return;

              
            }

           
            const new_click_event = new MouseEvent('mousedown', {
              pageX: event.pageX,
              pageY: event.pageY,
              clientX: event.clientX,
              clientY: event.clientY,
              layerX: event.layerX,
              layerY: event.layerY,
              bubbles: true,
              cancelable: true,
              view: window });
            brush_elm.dispatchEvent(new_click_event);
              
          }
          });

      
        let dataMissingFT10 = dataMeta.filter(({FT10}) => Array.isArray(FT10))

        pheno0Graph
        .selectAll('text.pheno0LabelMissing')
        .data(dataMissingFT10, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
          (enter) =>
            enter
            .append('text')
              .attr('fill', function (d) {

                return '#878787'

                })
              .attr('class', 'pheno0LabelMissing')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {

                return 'start'
                
              })
              .text(function (d) {

                let missing=""

                if (d.FT10[1] > 0) {
                  missing = '+'+d.FT10[1]+'?'

                  if (d.FT10[0] == undefined){

                    missing = '?'
                  }

                }

                return missing

              })
              .attr('transform', function(d) {
                let widthBar
                let nr =  parseFloat(d.FT10)
                nr = Math.round(nr) 

                widthBar = ((100)/maxFT10nr * nr)+1


                if (Array.isArray(d.FT10)){

                if (d.FT10[0] == undefined){

                  widthBar = ((100)/maxFT10nr * 0) 
                }
                }
                
                return 'translate('+ widthBar + ',' + vis.cellSize / 1.4 + ')'

              })
              .attr('x', 0)
              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
         
              .call((enter) => enter.transition(t_phenos0).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos0).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos0).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);

          
          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }

          let sum = [];
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT10'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 20
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
               + groupNrSelected + '<br>' +
              '<strong>FT10: </strong>' +
              '<br>' + myStringCounts

            )
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function(event, d){
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)

          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
         .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

              if ((event.altKey || event.ctrlKey)){
                event.preventDefault();
                d3.select(this).classed('text-selection', true)
                d3.selectAll('.rowLabel').filter(function() {
                    return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
                  }).classed('text-selection', true)

                  d3.selectAll('.rowAggr').filter(function() {
                    return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
                  }).classed('aggr-selection', true)

                d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.cell').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('cell-selection', true)

            d3.selectAll('.nodesSource').filter(function(d) {

            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.nodesTarget').filter(function() {
            return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.linksBp').filter(function(d) {
            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('link-selection', true)

                let altSelection = []
                  
                    d3.selectAll(".text-selection").each(function(d,i) {
                    let mrna = d3.select(this).attr("mRNA_id").split("+")
                    altSelection = [...altSelection.concat(mrna)]
                  })
                  d3.selectAll(".aggr-selection").each(function(d,i) {
                    let mrna = d3.select(this).attr("mRNA_id").split("+")
                    altSelection = [...altSelection.concat(mrna)]
                  })
                  vis.altSelection = [...new Set(altSelection)]
              }

              if (!(event.altKey || event.ctrlKey)){

                        
              const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
              const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
              const bbox = brush_selection.getBoundingClientRect();


               
                  if (brush_selection.style.display !== 'none'
                    && event.pageX > bbox.left
                    && event.pageX < (bbox.left + bbox.width)
                    && event.pageY > bbox.top
                    && event.pageY < (bbox.top + bbox.height)) {

                  return;

                  
                }

                const new_click_event = new MouseEvent('mousedown', {
                  pageX: event.pageX,
                  pageY: event.pageY,
                  clientX: event.clientX,
                  clientY: event.clientY,
                  layerX: event.layerX,
                  layerY: event.layerY,
                  bubbles: true,
                  cancelable: true,
                  view: window });
                brush_elm.dispatchEvent(new_click_event);
                  
              }
              });


      
      let maxFT16 = d3.map(vis.data_phenos, (d) => d.FT16)  //global max
      maxFT16 = maxFT16.filter(d => d !== '?')
      let maxFT16nr = d3.map(maxFT16, (d) => parseFloat(d))
      maxFT16nr = d3.max(maxFT16nr)

      let pheno1Graph = this.pheno1Group
      const t_phenos1 = pheno1Graph.transition().duration(vis.transitionTime)
      pheno1Graph
        .selectAll('rect.pheno1')
        .data(dataMeta, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
        (enter) =>
            enter
            .append('rect')
              .attr('height', vis.cellSize-1)
              .attr('width', function (d) { 

                if( d.FT16 == '?'){
                  return 0
                }

                return (100)/maxFT16nr * parseFloat(d.FT16)})
       
              .attr('fill', function (d) {
                
                return '#878787' 
              })
              .attr('class', 'pheno1')
   
              .attr('x', 0)
              .attr('transform', 'translate(0,' + -0.5 + ')')

              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((enter) => enter.transition(t_phenos1).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos1).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos1).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);


          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let sum = [];

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT16'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 100
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
              + groupNrSelected + '<br>' +
              '<strong>FT16: </strong>' +
              '<br>' + myStringCounts

            )
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function(event, d){
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)

          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

        if ((event.altKey || event.ctrlKey)){
          event.preventDefault();
          d3.select(this).classed('aggr-selection', true)
          d3.selectAll('.rowLabel').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.rowAggr').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

          d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.cell').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('cell-selection', true)

            d3.selectAll('.nodesSource').filter(function(d) {

            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.nodesTarget').filter(function() {
            return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.linksBp').filter(function(d) {
            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('link-selection', true)


          let altSelection = []
            
              d3.selectAll(".text-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".aggr-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
        }

        if (!(event.altKey || event.ctrlKey)){

                  
        const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
        const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
        const bbox = brush_selection.getBoundingClientRect();


            if (brush_selection.style.display !== 'none'
              && event.pageX > bbox.left
              && event.pageX < (bbox.left + bbox.width)
              && event.pageY > bbox.top
              && event.pageY < (bbox.top + bbox.height)) {

            return;

            
          }


          const new_click_event = new MouseEvent('mousedown', {
            pageX: event.pageX,
            pageY: event.pageY,
            clientX: event.clientX,
            clientY: event.clientY,
            layerX: event.layerX,
            layerY: event.layerY,
            bubbles: true,
            cancelable: true,
            view: window });
          brush_elm.dispatchEvent(new_click_event);
            
        }
        });

        pheno1Graph
        .selectAll('text.pheno1Label')
        .data(dataMeta, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
          (enter) =>
            enter
            .append('text')
              .attr('fill', function (d) {

                let nr =  parseFloat(d.FT16)
                nr = Math.round(nr) 
                if (d.FT16 == '?'){
                  return '#878787'
                }
                else{
                  return 'white'
                }

                })
              .attr('class', 'pheno1Label')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {

                let nr =  parseFloat(d.FT16)
                nr = Math.round(nr) 
                if (d.FT16 == '?'){
                  return 'start'
                }
                else{
                  return 'end'
                }
                
              })
              .text(function (d) {
                let nr =  parseFloat(d.FT16)
                nr = Math.round(nr) 

                if (Array.isArray(d.FT16)){

                  if (d.FT16[0] == undefined){
                 
                    return ''
                  }
                  else{
                    return  nr
                  }
                }
                else{
                  if (d.FT16 == '?'){
                  return d.FT16
                  }
                  else{
                    return  nr
                  }

                }
                
              })
              .attr('transform', function(d) {
                let widthBar
                let nr =  parseFloat(d.FT16)
                nr = Math.round(nr) 
                if (Array.isArray(d.FT16)){

                  if (d.FT16[0] == undefined){
                  widthBar = ((100)/maxFT16nr * 0)
                  }
                  else{
                    widthBar = ((100)/maxFT16nr * nr)-2
                  }


                }
                else{
                  if (d.FT16 == '?'){
                  widthBar = ((100)/maxFT16nr * 0)
                }
                else{
                  widthBar = ((100)/maxFT16nr * nr)-2
                }

                }
                
                return 'translate('+ widthBar + ',' + vis.cellSize / 1.4 + ')'

              })
              .attr('x', 0)
              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
         
              .call((enter) => enter.transition(t_phenos1).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos1).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos1).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);


          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let sum = [];

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT16'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){

          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 100
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
              + groupNrSelected + '<br>' +
              '<strong>FT16: </strong>' +
              '<br>' + myStringCounts

            )
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function(event, d){
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)

          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

        if ((event.altKey || event.ctrlKey)){
          event.preventDefault();
          d3.select(this).classed('text-selection', true)
          d3.selectAll('.rowLabel').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.rowAggr').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

          d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.cell').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('cell-selection', true)


            d3.selectAll('.nodesSource').filter(function(d) {

            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.nodesTarget').filter(function() {
            return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.linksBp').filter(function(d) {
            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('link-selection', true)

          let altSelection = []
            
              d3.selectAll(".text-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".aggr-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
        }

        if (!(event.altKey || event.ctrlKey)){

                  
        const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
        const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
        const bbox = brush_selection.getBoundingClientRect();


            if (brush_selection.style.display !== 'none'
              && event.pageX > bbox.left
              && event.pageX < (bbox.left + bbox.width)
              && event.pageY > bbox.top
              && event.pageY < (bbox.top + bbox.height)) {

            return;

            
          }

          const new_click_event = new MouseEvent('mousedown', {
            pageX: event.pageX,
            pageY: event.pageY,
            clientX: event.clientX,
            clientY: event.clientY,
            layerX: event.layerX,
            layerY: event.layerY,
            bubbles: true,
            cancelable: true,
            view: window });
          brush_elm.dispatchEvent(new_click_event);
            
        }
        });

        let dataMissingFT16 = dataMeta.filter(({FT16}) => Array.isArray(FT16))

        pheno1Graph
        .selectAll('text.pheno1LabelMissing')
        .data(dataMissingFT16, (d) => d.mRNA_id) 
        .attr('x', 0)
        .join(
          (enter) =>
            enter
            .append('text')
              .attr('fill', function (d) {

                return '#878787'

                })
              .attr('class', 'pheno1LabelMissing')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {

                return 'start'
                
              })
              .text(function (d) {

                let missing=""

                if (d.FT16[1] > 0) {
                  missing = '+'+d.FT16[1]+'?'

                  if (d.FT16[0] == undefined){

                    missing = '?'
                  }

                }

                return missing

              })
              .attr('transform', function(d) {
                let widthBar
                let nr =  parseFloat(d.FT16)
                nr = Math.round(nr) 

                widthBar = ((100)/maxFT10nr * nr) + 3


                if (Array.isArray(d.FT16)){

                if (d.FT16[0] == undefined){

                  widthBar = ((100)/maxFT10nr * 0) 
                }
                }
                
                return 'translate('+ widthBar + ',' + vis.cellSize / 1.4 + ')'

              })
              .attr('x', 0)
              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
         
              .call((enter) => enter.transition(t_phenos1).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_phenos1).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_phenos1).attr('x', 30).remove())
        )
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);


          let nodeAggArr = mrna.split("+")
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let sum = [];

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => nodeAggArr.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (groupNrSelected == undefined){
            groupNrSelected = ''
          }
      
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              let nr = parseFloat(dataPhenosChilds[i]['FT16'])
              nr = Math.round(nr* 100) / 100
              sum.push(nr)
          }

          let counts = {};

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let items = Object.keys(counts).map(
            (key) => { return [key, counts[key]] });

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort(
            (first, second) => { return first[0] - second[0] }
          );

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map(
            (e) => { return e[0] });
      
          let myStringCounts = ""
          for (let i=0; i<keys.length; i++){
            myStringCounts = myStringCounts + (keys[i] + ": "+ '<i>'+counts[keys[i]]+ '</i>' + "<br>");

          }

          if (!((event.altKey && event.ctrlKey))){

          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                + document.getElementById('heatmap-cells').offsetWidth
                + 100
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>'
              + groupNrSelected + '<br>' +
              '<strong>FT16: </strong>' +
              '<br>' + myStringCounts

            )
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function(event, d){
          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip-phenos').classed('hidden', false)

          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')

        if ((event.altKey || event.ctrlKey)){
          event.preventDefault();
          d3.select(this).classed('text-selection', true)
          d3.selectAll('.rowLabel').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.rowAggr').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno1Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno1LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('aggr-selection', true)

            d3.selectAll('.pheno0Label').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.pheno0LabelMissing').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('text-selection', true)

            d3.selectAll('.cell').filter(function() {
              return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('cell-selection', true)

            d3.selectAll('.nodesSource').filter(function(d) {

            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.nodesTarget').filter(function() {
            return d3.select(this).attr("mRNA_id") == d.mRNA_id; // filter by single attribute
            }).classed('node-selection', true)

            d3.selectAll('.linksBp').filter(function(d) {
            return mrna.includes(d.mRNA_id); // filter by single attribute
            }).classed('link-selection', true)


          let altSelection = []
            
              d3.selectAll(".text-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll(".aggr-selection").each(function(d,i) {
              let mrna = d3.select(this).attr("mRNA_id").split("+")
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
        }

        if (!(event.altKey || event.ctrlKey)){

                  
        const brush_elm = d3.select('#brushview').select('.phenoBrush > .overlay').node();
        const brush_selection = d3.select('#brushview').select('.phenoBrush > .selection').node();
        const bbox = brush_selection.getBoundingClientRect();


            if (brush_selection.style.display !== 'none'
              && event.pageX > bbox.left
              && event.pageX < (bbox.left + bbox.width)
              && event.pageY > bbox.top
              && event.pageY < (bbox.top + bbox.height)) {

            return;

            
          }

          const new_click_event = new MouseEvent('mousedown', {
            pageX: event.pageX,
            pageY: event.pageY,
            clientX: event.clientX,
            clientY: event.clientY,
            layerX: event.layerX,
            layerY: event.layerY,
            bubbles: true,
            cancelable: true,
            view: window });
          brush_elm.dispatchEvent(new_click_event);
            
        }
        });

      // console.log('[DONE] drawing phenotypes')
      // console.log('time drawing phenotypes', (new Date().getTime() - starttime.getTime())/1000)

    },
    drawBipartite(sortingOrderArray) {
       //// make bipartite

      let starttime = new Date()

      let dataMeta =this.dataPhenosFiltered 
      let vis = this;
  

      let bipartiteGraph = this.bipartiteGroup
      const t_bipartite = bipartiteGraph.transition().duration(vis.transitionTime)



      bipartiteGraph
        .selectAll('circle.nodesSource')
        .data(vis.dataPhenosSortedCurrent, (d) => d.mRNA_id) //dataMeta
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'nodesSource')
              .attr('label-r', function (d, i) {
              
                if (vis.linkedDendro == 'dendro-custom'){

                return vis.dendroLeavesCustom.indexOf(d.mRNA_id)

                }
                else{

                  if (vis.showCoreSNP == true){
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                  }
                  else{
                    return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }
                

                }
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('cx', 0)
              .attr('cy', function (d, i) {
            
                if (vis.linkedDendro == 'dendro-custom'){

                  let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                  return row * vis.cellSize

                }
                else {

                  let row;
                  if (vis.showCoreSNP == true){
                    row = vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                  }
                  else{
                    row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }
                
                  return row * vis.cellSize

                }
              })
              .attr('r', 2)
              .style('fill', '#ccc')
              .call((enter) => enter.transition(t_bipartite).attr('cx', 2)),
          (update) =>
            update
            .attr('label-r', function (d, i) {
           
              if (vis.linkedDendro == 'dendro-custom'){

              return vis.dendroLeavesCustom.indexOf(d.mRNA_id)

              }
              else{


                if (vis.showCoreSNP == true){
                  return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                }
                else{
                  return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                }    

            }
            })
            .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
            })
            .call((update) =>
              update.transition(t_bipartite).style('fill', '#ccc')
              .attr('cy', function (d, i) {
            
                if (vis.linkedDendro == 'dendro-custom'){

                let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                return row * vis.cellSize

                }
                else {

                  let row;
                    if (vis.showCoreSNP == true){
                      row = vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                    }
                    else{
                      row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                    }
                  
                    return row * vis.cellSize


                }

              })
            ),

          (exit) =>
            exit
              .style('fill', 'brown')
              .call((exit) =>
                exit.transition(t_bipartite).attr('cx', 22).remove()
              )
        )
        .on('mouseover', function(event, d){
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);
          if (vis.showCoreSNP == true){
            mrna = mrna.split('_')[0]
          }
       
        //Update the tooltip position and value
        d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('bipartiteCol').offsetLeft 
                             
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                + 30
                + 'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>mRNA_id/genome_nr: </strong>' +
              mrna +
              '<br>' 

            )
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on("mouseout", function(d){
          return d3.select('#tooltip-phenos').classed('hidden', true)
        })

      bipartiteGraph
        .selectAll('circle.nodesTarget')
        .data(dataMeta, (d) => d.mRNA_id)
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'nodesTarget')
              .attr('label-r', function (d, i) {

                return vis.newSortwithAggregated.indexOf(d.mRNA_id)

              })
              .attr('mRNA_id', function (d, i) {

                return d.mRNA_id

              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('cx', 0)
              .attr('cy', function (d, i) {
                
                let row =  vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize

              })
              .attr('r', 2)
              .style('fill', '#ccc')
              .call((enter) =>
                enter.transition(t_bipartite).attr('cx', vis.bipartiteWidth)
              ),
          (update) =>
            update
            .attr('label-r', function (d, i) {

                return vis.newSortwithAggregated.indexOf(d.mRNA_id)

              })
            .attr('mRNA_id', function (d) {

                return d.mRNA_id

            })
            .call((update) =>
              update.transition(t_bipartite).style('fill', '#ccc')
              .attr('cy', function (d, i) {

                let row =  vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
                
              })
              .attr('cx', vis.bipartiteWidth)
            ),
          (exit) =>
            exit
              .style('fill', 'brown')
              .call((exit) =>
                exit.transition(t_bipartite).attr('cx', 140).remove()
              )
        )
        .on('mouseover', function(event, d){
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);
        })
        .on("contextmenu", function (event, i) {
          event.preventDefault();

          let nodeAgg = d3.select(this).attr('mRNA_id')

          let nodeAggArr = nodeAgg.split("+");

          if (vis.aggregatedSampleString.includes(nodeAgg)){

            let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
             d !== nodeAgg)

            vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
            ! nodeAggArr.includes(mRNA_id))


            vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
            ! nodeAggArr.includes(d))

            vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)
            
            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
              mRNA_id !== nodeAgg)


              vis.currentSortAll = vis.rowSorterCurrentAll
             
              vis.drawHeatMap(vis.newSortwithAggregated)
              vis.drawPhenotypes(vis.newSortwithAggregated)
              vis.drawBipartite(vis.newSortwithAggregated)



          }

          
        })

      // filter data for links when core snp is loaded 
      let dataSourceNodes = vis.dataPhenosSortedCurrent
      let dataSourceNodesCopy = vis.dataPhenosSortedCurrent
      let coreSNPLeafsClean = d3.map(vis.getCoreSNPLeafs, d => d.split('_')[0])
      if (vis.showCoreSNP == true && vis.toggleButton == false){
        dataSourceNodesCopy = vis.dataPhenosSortedCurrent.filter(({mRNA_id}) => mRNA_id.split('|').length < 2)

        dataSourceNodes = vis.dataPhenosSortedCurrent.filter(({mRNA_id}) => vis.getCoreSNPLeafs.includes(mRNA_id))

      }
      


      bipartiteGraph
        .selectAll('path.linksBp')
        .data(dataSourceNodesCopy, (d) => d.mRNA_id) 
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linksBp')
              .attr('label-r', function (d, i) {
                if (vis.toggleButton == true){

                return vis.dendroLeavesAll.indexOf(d.mRNA_id)

                }
                else{

                if (vis.showCoreSNP == true){
                  return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                }
                else{
                  return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                }
                

                }
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('d', function (d, i) {

                return vis.drawLine(vis.dendroLeavesAll.indexOf(d.mRNA_id), vis.dendroLeavesAll.indexOf(d.mRNA_id))


              })
              .attr('stroke', 'rgba(192, 192, 192, 0.5)')
              .attr('stroke-width', '1px')
              .attr('fill', 'none')
              .call((enter) =>
                enter.transition(t_bipartite).attr('d', function (d, i) {

                  if (vis.toggleButton == true){
                  
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                
                    if (vis.nodesAggArray.includes(d.mRNA_id)){
                    
                      for (let i=0; i < vis.aggregatedSampleString.length; i++){
                       
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split("+")
                        if (arr.includes(d.mRNA_id)) {
                        
                          row = vis.newSortwithAggregated.indexOf(str)


                        }
                      }

                    }
                    
                    return vis.drawLine(vis.dendroLeavesAll.indexOf(d.mRNA_id), row)

                  }
                  else{

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)){

                      for (let i=0; i < vis.aggregatedSampleString.length; i++){
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split("+")
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)


                        }
                      }
                    }
                    
                    if (vis.showCoreSNP == true){
                      let start = d.mRNA_id.split('_')[0]
                      let start_node = vis.getCoreSNPLeafs.filter(d => d.split('_')[0] == start)[0]

                      return vis.drawLine(vis.getCoreSNPLeafs.indexOf(start_node), row)

                    }
                    else {

                      return vis.drawLine(vis.dendroLeavesDefault.indexOf(d.mRNA_id), row)
                    }
                    
                

                  }

                })
              ),
          (update) =>
            update.attr('stroke', 'rgba(192, 192, 192, 0.5)')
            .attr('label-r', function (d) {
              if (vis.toggleButton == true){

                return vis.dendroLeavesAll.indexOf(d.mRNA_id)

                }
                else {

                  if (vis.showCoreSNP == true){
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)

                    }
                    else {
                      return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                    }               

                }
              })
            .attr('mRNA_id', function (d) {
                return d.mRNA_id
            })
            .call((update) =>
              update.transition(t_bipartite).attr('d', function (d, i) {

                if (vis.toggleButton == true){
                   
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)){

                      for (let i=0; i < vis.aggregatedSampleString.length; i++){
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split("+")
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)


                        }
                      }

                    }
                   
                    
                    return vis.drawLine(vis.dendroLeavesAll.indexOf(d.mRNA_id), row)

                  }
                  else {

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)){

                      for (let i=0; i < vis.aggregatedSampleString.length; i++){
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split("+")
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)


                        }
                      }
                    }
                    
                    if (vis.showCoreSNP == true){
                      let start = d.mRNA_id.split('_')[0]
                      let start_node = vis.getCoreSNPLeafs.filter(d => d.split('_')[0] == start)[0]

                      return vis.drawLine(vis.getCoreSNPLeafs.indexOf(start_node), row)

                    }
                    else {
                      return vis.drawLine(vis.dendroLeavesDefault.indexOf(d.mRNA_id), row)
                    }
                  }
              })
            ),
          (exit) => exit
          .call((exit) =>
                exit.transition(t_bipartite).attr('stroke', 'rgba(255, 99, 71, 0.2)').remove()
           )
        )
        .on('mouseover', function(event, d){
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);
        })
        
    },
    drawAnnotations() {

      // let starttime = new Date()
      // console.log('drawing annotations...')

      let vis = this;

      vis.nucStructureData

      //// make annotations plot
      let colAnnotations = this.colAnnotationsGroup
      const t_annot = colAnnotations.transition().duration(vis.transitionTime)

      vis.nucStructureData.sort(function(a, b) {
        var keyA = a.position,
          keyB = b.position;
        if (parseInt(keyA) < parseInt(keyB)) return -1;
        if (parseInt(keyA) > parseInt(keyB)) return 1;
        return 0;
      });

      colAnnotations
        .selectAll('rect.annotation')
        .data(vis.nucStructureData, (d) => d.index)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('height', vis.cellSize-0.5)
              .attr('width', vis.cellSize-0.5)
              .attr('fill', function(d){
                if (d.feature =='cds'){
                  return '#C860EA'

                }
                else{
                  return '#eee'
                }
              })
              .attr('class', 'annotation')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + ((i * vis.cellSize)) + ', 2)'
              })
              .attr('y', -30)
              .attr('x', 0)
              .attr('id', function (d) {
                return 'colLabel_' + vis.xLabelsNames.indexOf(d)
              })
              .attr('label-c', function (d) {
                return vis.xLabelsNames.indexOf(d)
              })
              .call((enter) => enter.transition(t_annot).attr('y', 0)),
          (update) =>
            update
              .attr('fill', function(d){
                if (d.feature =='cds'){
                  return '#C860EA'

                }
                else{
                  return '#eee'
                }
              })
              .attr('y', 0)
              .call((update) =>
                update.transition(t_annot).attr('transform', function (d, i) {
                  return 'translate(' + ((i * vis.cellSize)) + ', 2)'
                }
                )
              )
              ,
          (exit) =>
            exit.attr('fill', 'brown').call(
              (exit) => exit.transition(t_annot).attr('y', 30).remove()
            )
        )

      // console.log('[DONE] drawing annotations')
      //// console.log('time drawing annotations', (new Date().getTime() - starttime.getTime())/1000)

      //// make visual ref plot
      let visRef = this.visualRefGroup
      const t_visref = visRef.transition().duration(vis.transitionTime)
 
      visRef
        .selectAll('rect.visRef')
        .data(vis.visualRefData, (d) => d.index)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('height', vis.cellSize-0.5)
              .attr('width', vis.cellSize-0.5)
              .attr('fill', function (d) {

                if (vis.visualRefSelected == 'none'){

                    return ' #e9ecef'
                  }
                  else{
                  if (d.nucleotide == '-|A') {
                  return 'url(#patternA-)'
                  }
                  if (d.nucleotide == '-|C') {
                  return 'url(#patternC-)'
                  }
                  if (d.nucleotide == '-|G') {
                  return 'url(#patternG-)'
                  }
                  if (d.nucleotide == '-|T') {
                  return 'url(#patternT-)'
                  }
                  if (d.nucleotide == 'A|C') {
                  return 'url(#patternAC)'
                  }
                  if (d.nucleotide == 'A|G') {
                  return 'url(#patternAG)'
                  }
                  if (d.nucleotide == 'A|T') {
                  return 'url(#patternAT)'
                  }
                  if (d.nucleotide == 'C|G') {
                  return 'url(#patternCG)'
                  }
                  if (d.nucleotide == 'C|T') {
                  return 'url(#patternCT)'
                  }
                  if (d.nucleotide == 'G|T') {
                  return 'url(#patternGT)'
                  }
                  if (d.nucleotide == '-|A|C') {
                  return 'url(#patternAC-)'
                  }
                  if (d.nucleotide == '-|A|G') {
                  return 'url(#patternAG-)'
                  }
                  if (d.nucleotide == '-|A|T') {
                  return 'url(#patternAT-)'
                  }
                  if (d.nucleotide == '-|C|G') {
                  return 'url(#patternCG-)'
                  }
                  if (d.nucleotide == '-|C|T') {
                  return 'url(#patternCT-)'
                  }
                  if (d.nucleotide == '-|G|T') {
                  return 'url(#patternGT-)'
                  }
                  if (d.nucleotide == 'A|C|G') {
                  return 'url(#patternACG)'
                  }
                  if (d.nucleotide == 'A|C|T') {
                  return 'url(#patternACT)'
                  }
                  if (d.nucleotide == 'A|G|T') {
                  return 'url(#patternAGT)'
                  }
                  if (d.nucleotide == 'C|G|T') {
                  return 'url(#patternCGT)'
                  }
                  if (d.nucleotide == '-|A|C|G') {
                  return 'url(#patternACG-)'
                  }
                  if (d.nucleotide == '-|A|C|T') {
                  return 'url(#patternACT-)'
                  }
                  if (d.nucleotide == '-|A|G|T') {
                  return 'url(#patternAGT-)'
                  }
                  if (d.nucleotide == '-|C|G|T') {
                  return 'url(#patternCGT-)'
                  }
                  if (d.nucleotide == 'A|C|G|T|-') {
                    return 'url(#patternACGT-)'
                  }
                  if (d.nucleotide == 'A|C|G|T') {
                    return 'url(#patternACGT)'
                  }


                 return vis.colorScaleNuc(d.nucleotide)
                }
              })
              .attr('class', 'visRef')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + ((i * vis.cellSize)) + ', 2)'
              })
              .attr('y', -30)
              .attr('x', 0)
              .attr('id', function (d) {
                return 'visref_' + vis.xLabelsNames.indexOf(d.position)
              })
              .attr('label-c', function (d) {
                return vis.xLabelsNames.indexOf(d.position)
              })
              .call((enter) => enter.transition(t_visref).attr('y', 0)),
          (update) =>
            update
              .attr('fill', function (d) {
                if (vis.visualRefSelected == 'none'){

                    return ' #e9ecef'
                  }
                  else{
                  if (d.nucleotide == '-|A') {
                  return 'url(#patternA-)'
                  }
                  if (d.nucleotide == '-|C') {
                  return 'url(#patternC-)'
                  }
                  if (d.nucleotide == '-|G') {
                  return 'url(#patternG-)'
                  }
                  if (d.nucleotide == '-|T') {
                  return 'url(#patternT-)'
                  }
                  if (d.nucleotide == 'A|C') {
                  return 'url(#patternAC)'
                  }
                  if (d.nucleotide == 'A|G') {
                  return 'url(#patternAG)'
                  }
                  if (d.nucleotide == 'A|T') {
                  return 'url(#patternAT)'
                  }
                  if (d.nucleotide == 'C|G') {
                  return 'url(#patternCG)'
                  }
                  if (d.nucleotide == 'C|T') {
                  return 'url(#patternCT)'
                  }
                  if (d.nucleotide == 'G|T') {
                  return 'url(#patternGT)'
                  }
                  if (d.nucleotide == '-|A|C') {
                  return 'url(#patternAC-)'
                  }
                  if (d.nucleotide == '-|A|G') {
                  return 'url(#patternAG-)'
                  }
                  if (d.nucleotide == '-|A|T') {
                  return 'url(#patternAT-)'
                  }
                  if (d.nucleotide == '-|C|G') {
                  return 'url(#patternCG-)'
                  }
                  if (d.nucleotide == '-|C|T') {
                  return 'url(#patternCT-)'
                  }
                  if (d.nucleotide == '-|G|T') {
                  return 'url(#patternGT-)'
                  }
                  if (d.nucleotide == 'A|C|G') {
                  return 'url(#patternACG)'
                  }
                  if (d.nucleotide == 'A|C|T') {
                  return 'url(#patternACT)'
                  }
                  if (d.nucleotide == 'A|G|T') {
                  return 'url(#patternAGT)'
                  }
                  if (d.nucleotide == 'C|G|T') {
                  return 'url(#patternCGT)'
                  }
                  if (d.nucleotide == '-|A|C|G') {
                  return 'url(#patternACG-)'
                  }
                  if (d.nucleotide == '-|A|C|T') {
                  return 'url(#patternACT-)'
                  }
                  if (d.nucleotide == '-|A|G|T') {
                  return 'url(#patternAGT-)'
                  }
                  if (d.nucleotide == '-|C|G|T') {
                  return 'url(#patternCGT-)'
                  }
                  if (d.nucleotide == 'A|C|G|T|-') {
                    return 'url(#patternACGT-)'
                  }
                  if (d.nucleotide == 'A|C|G|T') {
                    return 'url(#patternACGT)'
                  }

                 return vis.colorScaleNuc(d.nucleotide)
                }
              })
              .attr('y', 0)
              .call((update) =>
                update.transition(t_visref).attr('transform', function (d, i) {
                  return 'translate(' + ((i * vis.cellSize)) + ', 2)'
                })
              )
              ,
          (exit) =>
            exit.attr('fill', 'brown').call(
              (exit) => exit.transition(t_visref).attr('y', 30).remove()
            )
        )         


    },
    drawHeatMap(sortingOrderArray) {

      // let starttime = new Date()
      // console.log('drawing heatmap...')
      let vis = this

      //// make row labels
      let rowLabels = this.rowLabelGroup
      const t_rows = rowLabels.transition().duration(vis.transitionTime)

      rowLabels
        .selectAll('text.rowLabel')
        .data(vis.yLabelsNames, (d) => d)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', 'darkgrey')
              .attr('class', 'rowLabel')
              .attr('font-weight', 'normal')
              .attr('font-size', '10px')
              .style('text-anchor', 'start')
              .attr('transform', 'translate(-6,' + vis.cellSize / 1.5 + ')')
              .attr('x', -30)
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d)
              })
              .attr('y', function (d, i) {
                let row = vis.newSortwithAggregated.indexOf(d)

                return row * vis.cellSize
                
              })
              .text(function (d) {
                if (d.split("+").length > 1){
                  return '' //should show bar instead 
                }
                return d
              })
              .attr('mRNA_id', function (d) {
                return d
              })
              .attr('id', function (d) {
                return 'rowLabel_' + vis.dendroLeaves.indexOf(d)
              })
              .call((enter) => enter.transition(t_rows).attr('x', 0)),
          (update) =>
            update
              .attr('fill', 'darkgrey')
              .attr('x', 0)
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d)
              })
              .attr('mRNA_id', function (d) {
                return d
              })
              .call((update) =>
                update.transition(t_rows).attr('y', function (d, i) {

                  let row = vis.newSortwithAggregated.indexOf(d)

                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_rows).attr('x', 30).remove())
        )
      
        .on('mouseover', function(event, d){
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)

          if (!((event.altKey && event.ctrlKey))){
          d3.select('#tooltip-mrnas')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('bipartiteCol').offsetLeft 
                + document.getElementById('bipartiteCol').offsetWidth * 0.9
              
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            d3.select('#tooltip-mrnas').classed('hidden', true)

          }
        })
        .on('mouseout', function(event){
          if (((event.altKey && event.ctrlKey))){
              d3.select('#tooltip-mrnas').classed('hidden', false)
          }
          else {
              d3.select('#tooltip-mrnas').classed('hidden', true)

          }

        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
            mrna = mrna.split('+')
     
       
          if ((event.altKey || event.ctrlKey)){
            event.preventDefault();
    
            if (d3.select(this).attr("class") == 'rowLabel text-selection text-highlight'){
              d3.select(this).classed('text-selection', false)
            }
            else {
              d3.select(this).classed('text-selection', true)
              vis.selectionLst.push(d)

              d3.selectAll('.strain').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno1').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('aggr-selection', true)

              d3.selectAll('.pheno0').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('aggr-selection', true)

              d3.selectAll('.pheno1Label').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno0Label').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno1LabelMissing').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno0LabelMissing').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.cell').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('cell-selection', true)

              d3.selectAll('.nodesSource').filter(function(d) {
              return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.nodesTarget').filter(function() {
              return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.linksBp').filter(function(d) {
              return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('link-selection', true)

  
            }

            let altSelection = []
            d3.selectAll(".text-selection").each(function(d,i) {
            let mrna = d3.select(this).attr("mRNA_id").split("+")
            altSelection = [...altSelection.concat(mrna)]
          })
          d3.selectAll(".aggr-selection").each(function(d,i) {
            let mrna = d3.select(this).attr("mRNA_id").split("+")
            altSelection = [...altSelection.concat(mrna)]
          })

          vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)){

            const brush_elm = rowLabels.select('.rowBrush > .overlay').node();
            const brush_selection = rowLabels.select('.rowBrush > .selection').node();
            const bbox = brush_selection.getBoundingClientRect();
    
              if (brush_selection.style.display !== 'none'
                && event.pageX > bbox.left
                && event.pageX < (bbox.left + bbox.width)
                && event.pageY > bbox.top
                && event.pageY < (bbox.top + bbox.height)) {

              return;

              
            }

            const new_click_event = new MouseEvent('mousedown', {
              pageX: event.pageX,
              pageY: event.pageY,
              clientX: event.clientX,
              clientY: event.clientY,
              layerX: event.layerX,
              layerY: event.layerY,
              bubbles: true,
              cancelable: true,
              view: window });
            brush_elm.dispatchEvent(new_click_event);
        


          }

 
         
        });


        //// make row labels aggregated
        let rowsAggr = this.rowLabelGroup
        const t_rows_aggr = rowsAggr.transition().duration(vis.transitionTime)

        rowsAggr
        .selectAll('rect.rowAggr')
        .data(vis.aggregatedSampleString, (d) => d)
        .join(
          (enter) =>
            enter
            .append('rect')
              .attr('height', vis.cellSize-1)
              .attr('width', function (d) { 
                return vis.rowLabelWidth/vis.numYLabelsAll * d.split("+").length})
       
              .attr('fill', function (d) {
                
                return '#878787' 
              })
              .attr('class', 'rowAggr')
   
              .attr('x', 0)
              .attr('transform', 'translate(-6,' + -0.5 + ')')

              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d
              })
              .call((enter) => enter.transition(t_rows_aggr).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_rows_aggr).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_rows_aggr).attr('x', 30).remove())
        )
        .on("contextmenu", function (event, i) {
          event.preventDefault();

          let nodeAgg = d3.select(this).attr('mRNA_id')
          let nodeAggArr = nodeAgg.split("+");

          if (vis.aggregatedSampleString.includes(nodeAgg)){

            let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
             d !== nodeAgg)

            vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
            ! nodeAggArr.includes(mRNA_id))


            vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
            ! nodeAggArr.includes(d))

            vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)
            
            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
              mRNA_id !== nodeAgg)


              vis.currentSortAll = vis.rowSorterCurrentAll

              vis.drawHeatMap(vis.newSortwithAggregated)
              vis.drawPhenotypes(vis.newSortwithAggregated)
              vis.drawBipartite(vis.newSortwithAggregated)



          }

          
        })
        .on('mouseover', function(event, d){
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna);
          let values =  d.split("+")
          let myString = ""
          for (let i=0; i<values.length; i++){
            myString = myString + (values[i] + "<br>");

          }

          let groupNrSelected = ""
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(({mRNA_id}) => values.includes(mRNA_id))
            let groupArr = d3.map(groupSelected, d => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          if (!((event.altKey && event.ctrlKey))){
          d3.select('#tooltip-mrnas')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('bipartiteCol').offsetLeft 
                + document.getElementById('bipartiteCol').offsetWidth * 0.9
              
                // - document.getElementById('heatmap').scrollLeft
               
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop 
                - 40
                + 'px'
            )
            .select('#value-mrnas')
            .html(
              '<strong>group: </strong>' +
              groupNrSelected +
              '<br> <strong>mRNA_id: </strong>' +

              '<br>' + myString

            )
          //Show the tooltip
          d3.select('#tooltip-mrnas').classed('hidden', false)
          }
        })
        .on('mouseout', function(event,d){
          if (((event.altKey && event.ctrlKey))){
            return  d3.select('#tooltip-mrnas').classed('hidden', false)
          }
          else {
            return  d3.select('#tooltip-mrnas').classed('hidden', true)

          }

        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function(event, d){

          let mrna = d3.select(this).attr("mRNA_id")
          mrna = mrna.split('+')

          if ((event.altKey || event.ctrlKey)){
            event.preventDefault();
            if (d3.select(this).attr("class") == 'rowAggr aggr-selection aggr-highlight'){
              d3.select(this).classed('aggr-selection', false)
            }
            else{
              d3.select(this).classed('aggr-selection', true)
              d3.selectAll('.strain').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno1').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('aggr-selection', true)

              d3.selectAll('.pheno0').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('aggr-selection', true)

              d3.selectAll('.pheno1Label').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno0Label').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno1LabelMissing').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.pheno0LabelMissing').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('text-selection', true)

              d3.selectAll('.cell').filter(function() {
                return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('cell-selection', true)

              d3.selectAll('.nodesSource').filter(function(d) {
              return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.nodesTarget').filter(function() {
              return d3.select(this).attr("mRNA_id") == d; // filter by single attribute
              }).classed('node-selection', true)

              d3.selectAll('.linksBp').filter(function(d) {
              return mrna.includes(d.mRNA_id); // filter by single attribute
              }).classed('link-selection', true)
            }

            let altSelection = []
            d3.selectAll(".aggr-selection").each(function(d,i) {
            let mrna = d3.select(this).attr("mRNA_id").split("+")
            altSelection = [...altSelection.concat(mrna)]
          })
          d3.selectAll(".text-selection").each(function(d,i) {
            let mrna = d3.select(this).attr("mRNA_id").split("+")
            altSelection = [...altSelection.concat(mrna)]
          })

          vis.altSelection = [...new Set(altSelection)]
          
          }

          if (!(event.altKey || event.ctrlKey)){

          
          const brush_elm = rowsAggr.select('.rowBrush > .overlay').node();
          const brush_selection = rowsAggr.select('.rowBrush > .selection').node();
          const bbox = brush_selection.getBoundingClientRect();

              if (brush_selection.style.display !== 'none'
                && event.pageX > bbox.left
                && event.pageX < (bbox.left + bbox.width)
                && event.pageY > bbox.top
                && event.pageY < (bbox.top + bbox.height)) {

              return;

              
            }


            const new_click_event = new MouseEvent('mousedown', {
              pageX: event.pageX,
              pageY: event.pageY,
              clientX: event.clientX,
              clientY: event.clientY,
              layerX: event.layerX,
              layerY: event.layerY,
              bubbles: true,
              cancelable: true,
              view: window });
            brush_elm.dispatchEvent(new_click_event);

          }

                
          });

        rowsAggr
        .selectAll('text.rowAggrLabel')
        .data(vis.aggregatedSampleString, (d) => d)
        .join(
          (enter) =>
            enter
            .append('text')
            .attr('fill', function (d) {

                let nr = d.split("+").length
                if (nr > vis.numYLabelsAll/2){
                  return 'white'
                }
                else{
                  return '#878787'
                }

                })
              .attr('class', 'rowAggrLabel')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {

                let nr = d.split("+").length
                if (nr > vis.numYLabelsAll/2){
                  return 'end'
                }
                else{
                  return 'start'
                }
                
              })
              .text(function (d) {
                return d.split("+").length})
              .attr('transform', function(d) {
                let widthBar
                let nr = d.split("+").length
                if (nr > vis.numYLabelsAll/2){
                  widthBar = (vis.rowLabelWidth/vis.numYLabelsAll * d.split("+").length)-8
                }
                else{
                  widthBar = (vis.rowLabelWidth/vis.numYLabelsAll * d.split("+").length)-5
                }
                return 'translate('+ widthBar + ',' + vis.cellSize / 1.4 + ')'

              })
              .attr('x', 0)
              .attr('y', function (d, i) {
   
                let row = vis.newSortwithAggregated.indexOf(d)
                 
                return row * vis.cellSize
                
              })
              .attr('mRNA_id', function (d) {
                return d
              })
         
              .call((enter) => enter.transition(t_rows_aggr).attr('x', 0)),
          (update) =>
            update
              .call((update) =>
                update.transition(t_rows_aggr).attr('y', function (d, i) {
   
                  let row = vis.newSortwithAggregated.indexOf(d)
                 
                  return row * vis.cellSize

                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_rows_aggr).attr('x', 30).remove())
        )
        

      //// make col labels
      let colLabels = this.colLabelGroup
      const t_cols = colLabels.transition().duration(vis.transitionTime)

      colLabels
        .selectAll('text.colLabel')
        .data(vis.xLabelsNames, (d) => d)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', 'darkgrey')
              .attr('class', 'colLabel')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + (+(i+1)* vis.cellSize)  + ', 2) rotate(-90)'
              })

              .attr('dx', '.8em')
              .attr('y', -30)
              .attr('x', 0)
              .text((d) => d)
              .attr('id', function (d) {
                return 'colLabel_' + vis.xLabelsNames.indexOf(d)
              })
              .attr('label-c', function (d) {
                return vis.xLabelsNames.indexOf(d)
              })
              .attr('value', function (d) {
                return d
              })
              .call((enter) => enter.transition(t_cols).attr('y', 0)),
          (update) =>
            update
              .attr('fill', 'darkgrey')
              .attr('y', 0)
              .call((update) =>
                update.transition(t_cols)
                .attr('transform', function (d, i) {
                return 'translate(' + (+(i+1)* vis.cellSize)  + ', 2) rotate(-90)'
              })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_cols).attr('y', 30).remove())
        )
        .on('click', function (d, i) {

          let clickedValue = i;

          d3.select('#rowSorting').property('selectedIndex', 4).node().focus()
 
          vis.boolSorted.position =! vis.boolSorted.position
          if (i !== vis.currentSortRow){
            vis.boolSorted.position = false // start with best sorting
          }
          sortByValues(i, vis.colSortOrder)


          d3.selectAll('.colLabel').classed('text-selected', function(d){
          return d == clickedValue
          })
          d3.selectAll('.phenoLabel').classed('text-selected', false)

          vis.$store.dispatch('setAccessionsSort', vis.rowSort) // update store  

        })
        .on('mouseover', function (d) {
          d3.select(this).classed('text-hover', true)

          var idr = d3.select(this).attr('label-c') // row

        })
        .on('mouseout', function (d) {
          d3.select(this).classed('text-hover', false)
          d3.selectAll('.cell').classed('cell-highlight-col', false)

        })


      
      //// make matrix
      let cells = d3.select('#heatmapview')
      const t_cells = cells.transition().duration(vis.transitionTime)

      cells
        .selectAll('.cell')
        .data(vis.dataSequencesFilteredSortedCurrent, function (d, i) {
          return d.index
        })
        .join(
          (enter) =>
            enter
            .append('rect')
              .attr('height', vis.cellSize-0.5)
              .attr('width', vis.cellSize-0.5)
              .style('fill', 'rgba(255,255,255, 0)')

              .attr('data-value', function (d) {
                return d.nucleotide
              })
              .attr('data-r', function (d, i) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('data-c', function (d, i) {
                return vis.xLabelsNames.indexOf(d.position)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .attr('class', function () {
                var idr = d3.select(this).attr('data-r') // row
                var idc = d3.select(this).attr('data-c') // column
                if (vis.cellSize > 9) {
                  return 'cell cr' + idr + ' cc' + idc
                } else {
                  return 'cell cr' + idr + ' cc' + idc
                }
              })
              .attr('x', function (d, i) {
                let c = d3.select(this).attr('data-c')
                return c * vis.cellSize 
              })
              .attr('y', function (d) {

                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)
                
                return row * vis.cellSize 
              })

              .call((enter) =>
                enter.transition(t_cells).style('fill', function (d) {

                  let posRef = d.position
                let nucVR = 'dummy'
                if (vis.visualRefSelected !== 'none'){

                nucVR = vis.visualRefData.filter(function (d) {
                return d.position == posRef //make interactive
                })[0].nucleotide

                }
                let nucVRlist = nucVR.split('|')
                let nuc = d.nucleotide.toUpperCase();

                if (nuc == nucVR && d.mRNA_id !== vis.visualRefSelected){

                  return ' #e9ecef'
                }
                if (nucVRlist.includes(nuc) && d.mRNA_id !== vis.visualRefSelected){

                  return ' #e9ecef'
                }
                if (nuc == '-|A') {
                return 'url(#patternA-)'
                }
                if (nuc == '-|C') {
                return 'url(#patternC-)'
                }
                if (nuc == '-|G') {
                return 'url(#patternG-)'
                }
                if (nuc == '-|T') {
                return 'url(#patternT-)'
                }
                if (nuc == 'A|C') {
                return 'url(#patternAC)'
                }
                if (nuc == 'A|G') {
                return 'url(#patternAG)'
                }
                if (nuc == 'A|T') {
                return 'url(#patternAT)'
                }
                if (nuc == 'C|G') {
                return 'url(#patternCG)'
                }
                if (nuc == 'C|T') {
                return 'url(#patternCT)'
                }
                if (nuc == 'G|T') {
                return 'url(#patternGT)'
                }
                if (nuc == '-|A|C') {
                return 'url(#patternAC-)'
                }
                if (nuc == '-|A|G') {
                return 'url(#patternAG-)'
                }
                if (nuc == '-|A|T') {
                return 'url(#patternAT-)'
                }
                if (nuc == '-|C|G') {
                return 'url(#patternCG-)'
                }
                if (nuc == '-|C|T') {
                return 'url(#patternCT-)'
                }
                if (nuc == '-|G|T') {
                return 'url(#patternGT-)'
                }
                if (nuc == 'A|C|G') {
                return 'url(#patternACG)'
                }
                if (nuc == 'A|C|T') {
                return 'url(#patternACT)'
                }
                if (nuc == 'A|G|T') {
                return 'url(#patternAGT)'
                }
                if (nuc == 'C|G|T') {
                return 'url(#patternCGT)'
                }
                if (nuc == '-|A|C|G') {
                return 'url(#patternACG-)'
                }
                if (nuc == '-|A|C|T') {
                return 'url(#patternACT-)'
                }
                if (nuc == '-|A|G|T') {
                return 'url(#patternAGT-)'
                }
                if (nuc == '-|C|G|T') {
                return 'url(#patternCGT-)'
                }
                if (nuc == 'A|C|G|T|-') {
                  return 'url(#patternACGT-)'
                }
                if (nuc == 'A|C|G|T') {
                  return 'url(#patternACGT)'
                }

                if (nuc == nucVR && d.mRNA_id !== vis.visualRefSelected){
 
                  return ' #e9ecef'
                }

                if (nuc == 'A|A' | nuc == 'C|C' | nuc == 'G|G' | nuc == 'T|T' ){
                  let nucStripped = nuc.split('|')[0]
                  return vis.colorScaleNuc(nucStripped)
                }

                return vis.colorScaleNuc(nuc)
                })
              ),
          (update) =>
            update
              .attr('data-r', function (d, i) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('data-c', function (d, i) {
                return vis.xLabelsNames.indexOf(d.position)
              })
              .attr('class', function () {
                var idr = d3.select(this).attr('data-r') // row
                var idc = d3.select(this).attr('data-c') // column
                if (vis.cellSize > 9) {
                  return 'cell cr' + idr + ' cc' + idc
                } else {
                  return 'cell cr' + idr + ' cc' + idc
                }
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .style('fill', function (d) {

                let posRef = d.position
                let nucVR = 'dummy'
                if (vis.visualRefSelected !== 'none'){

                nucVR = vis.visualRefData.filter(function (d) {
                return d.position == posRef //make interactive
                })[0].nucleotide

                }
                let nucVRlist = nucVR.split('|')

                let nuc = d.nucleotide.toUpperCase();

                if (nuc == nucVR && d.mRNA_id !== vis.visualRefSelected){

                  return ' #e9ecef'
                }
                if (nucVRlist.includes(nuc) && d.mRNA_id !== vis.visualRefSelected){

                  return ' #e9ecef'
                }
                if (nuc == '-|A') {
                return 'url(#patternA-)'
                }
                if (nuc == '-|C') {
                return 'url(#patternC-)'
                }
                if (nuc == '-|G') {
                return 'url(#patternG-)'
                }
                if (nuc == '-|T') {
                return 'url(#patternT-)'
                }
                if (nuc == 'A|C') {
                return 'url(#patternAC)'
                }
                if (nuc == 'A|G') {
                return 'url(#patternAG)'
                }
                if (nuc == 'A|T') {
                return 'url(#patternAT)'
                }
                if (nuc == 'C|G') {
                return 'url(#patternCG)'
                }
                if (nuc == 'C|T') {
                return 'url(#patternCT)'
                }
                if (nuc == 'G|T') {
                return 'url(#patternGT)'
                }
                if (nuc == '-|A|C') {
                return 'url(#patternAC-)'
                }
                if (nuc == '-|A|G') {
                return 'url(#patternAG-)'
                }
                if (nuc == '-|A|T') {
                return 'url(#patternAT-)'
                }
                if (nuc == '-|C|G') {
                return 'url(#patternCG-)'
                }
                if (nuc == '-|C|T') {
                return 'url(#patternCT-)'
                }
                if (nuc == '-|G|T') {
                return 'url(#patternGT-)'
                }
                if (nuc == 'A|C|G') {
                return 'url(#patternACG)'
                }
                if (nuc == 'A|C|T') {
                return 'url(#patternACT)'
                }
                if (nuc == 'A|G|T') {
                return 'url(#patternAGT)'
                }
                if (nuc == 'C|G|T') {
                return 'url(#patternCGT)'
                }
                if (nuc == '-|A|C|G') {
                return 'url(#patternACG-)'
                }
                if (nuc == '-|A|C|T') {
                return 'url(#patternACT-)'
                }
                if (nuc == '-|A|G|T') {
                return 'url(#patternAGT-)'
                }
                if (nuc == '-|C|G|T') {
                return 'url(#patternCGT-)'
                }
                if (nuc == 'A|C|G|T|-') {
                  return 'url(#patternACGT-)'
                }
                if (nuc == 'A|C|G|T') {
                  return 'url(#patternACGT)'
                }

                if (nuc == nucVR && d.mRNA_id !== vis.visualRefSelected){

                  return ' #e9ecef'
                }

                if (nuc == 'A|A' | nuc == 'C|C' | nuc == 'G|G' | nuc == 'T|T' ){
                  let nucStripped = nuc.split('|')[0]
                  return vis.colorScaleNuc(nucStripped)
                }

                return vis.colorScaleNuc(nuc)
              }
           
              )           
              .call((update) =>
                update.transition(t_cells).attr('x', function (d, i) {
                  let c = d3.select(this).attr('data-c')
                  return c * vis.cellSize 
                })
                .attr('y', function (d) {

                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                
                return row * vis.cellSize 
              })
         
              ),
          (exit) =>
            exit    
              .call((exit) => 
                exit.transition(t_cells)
                .style('fill', function (d) {
                return 'rgba(255,255,255, 0)'
              })
              .style('stroke-opacity', function (d) {
                return '0.0'
              })
                .remove()
              )
        )
        .on('mouseover', function (event, d) {

          var idr = d3.select(this).attr('data-r') // row
          var idc = d3.select(this).attr('data-c') // column
          var value = d3.select(this).attr('data-value') // data value
          let mrna = d3.select(this).attr('mRNA_id')
          
          vis.highlightRow(mrna);

          d3.select(this).classed('cell-hover', true)

          d3.selectAll('.colLabel').classed('text-highlight', function (c, ci) {

            return ci == idc
          })

          let values =  d.mRNA_id.split("+")
          let myString = ""
          for (let i=0; i<values.length; i++){
            myString = myString + (values[i] + "<br>");

          }

          let pos = d.position
          let mRNA_id_arr = mrna.split("+")

          
          let valuesNucl = vis.data_heatmap.filter(function(d) {
          return d['position'] == pos && mRNA_id_arr.includes(d['mRNA_id'])
          })

          let allNucs = d3.map(valuesNucl, function(d){
            return d.nucleotide.toUpperCase()
          })

          let counts = {};

          for (let num of allNucs) {
            counts[num] = counts[num] ? counts[num] + 1 : 1;
          }

          let nucArr = d.nucleotide.split('|')

      
          let myStringCounts = ""
          for (let i=0; i<nucArr.length; i++){
            myStringCounts = myStringCounts + (nucArr[i] + ": "+ '<i>'+counts[nucArr[i].toUpperCase()]+'</i>' + ", "); //to uppercase added for vcf inferred variants otherwise undefined

          }
         
          if (!((event.altKey && event.ctrlKey))){
          //Update the tooltip position and value
          d3.select('#tooltip')
            .style(
              'left',
              d3.pointer(event)[0] 
                + document.getElementById('heatmap-cells').offsetLeft 
                - document.getElementById('heatmap').scrollLeft  
                + 30
                + 'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] 
                + document.getElementById('heatmap').getBoundingClientRect().top 
                - document.getElementById('heatmap').scrollTop -
                40 
                + 'px'
            )
            .select('#value')
            .html(
                '<strong>base: </strong>' +
                myStringCounts + '<br>' +
                '<strong>position: </strong>' +
                d.position +
                '<br>' +
                '<strong>mRNA_id: </strong>' +
                '<br>' + myString

            )
          }
          d3.select('#tooltip').classed('hidden', false)
        })
        .on('mouseout', function (event, d, i) {
          // on mouseout rect
          d3.select(this).classed('cell-hover', false)

          d3.selectAll('.rowLabel').classed('text-highlight', false)
          d3.selectAll('.colLabel').classed('text-highlight', false)

          if (((event.altKey && event.ctrlKey))){
            d3.select('#tooltip').classed('hidden', false)
          }
          else{
            d3.select('#tooltip').classed('hidden', true)
          }
        })
      
        d3.selectAll('.cell').classed('cell-selection', function (l, li) {
            
            return vis.childsSelected.includes(l.mRNA_id)

        })

      // Change ordering of cells
      function sortByValues(i, sortOrder) {
   
        let dataColSelected = []
        let dataColSelectedAll = []


        let dataSeqPos = vis.dataSequencesFilteredAll.filter(({ position }) =>
           position == i
          )


        d3.selectAll('.cc' + vis.xLabelsNames.indexOf(i)).filter(function (d) {

          dataColSelected.push({'mRNA_id': d.mRNA_id, 'nucleotide': d.nucleotide.toUpperCase()}) //to uppercase for better sort

        })

  
      for (let i = 0; i < vis.numYLabels; i++) {
          let mrna = dataColSelected[i]['mRNA_id']

          let idx = vis.newSortwithAggregated.indexOf(mrna) 

          dataColSelected[i]['idx'] = idx

        }
        dataColSelected = dataColSelected.sort(function(a,b){ //sort data before index computation 
            return a.idx - b.idx;
        })


        

        for (let i = 0; i < dataSeqPos.length; i++) {
          let mrna = dataSeqPos[i]['mRNA_id']
          let idx = vis.rowSorterCurrentAll.indexOf(mrna) 
          dataColSelectedAll.push({'idx': idx, 'mRNA_id': dataSeqPos[i]['mRNA_id'], 'nucleotide': dataSeqPos[i]['nucleotide'].toUpperCase()}) // to uppercase for better sort

        }
        dataColSelectedAll = dataColSelectedAll.sort(function(a,b){ //sort data before index computation
            return a.idx - b.idx;
        })


        let categoriesColSelected =vis.getCategories(dataColSelected, 'nucleotide')

        let mRNAs = vis.getArraySortedCategorical(dataColSelected, categoriesColSelected, 'nucleotide', 'median')

        let categoriesColSelectedAll =vis.getCategories(dataColSelectedAll, 'nucleotide')

        let mRNAsAll = vis.getArraySortedCategorical(dataColSelectedAll, categoriesColSelectedAll, 'nucleotide', 'median')

        vis.currentSort = mRNAs
        vis.currentSortAll = mRNAsAll

       if  (vis.boolSorted.position == true){

          let reverse_mrnas_all = _.cloneDeep(mRNAsAll);
          let reverse_mrnas = _.cloneDeep( mRNAs);
          reverse_mrnas_all.reverse()
          reverse_mrnas.reverse()

          vis.currentSort = reverse_mrnas
          vis.currentSortAll = reverse_mrnas_all

       }

        vis.rowSort = 'position'
        vis.rowSortSteps.push(vis.rowSort)

        vis.drawView()

        // reverse order again for update 
        if  (vis.boolSorted.position == true){

          vis.currentSort = mRNAs
          vis.currentSortAll = mRNAsAll


        }
        vis.currentSortRow = i;

      }
     
      // console.log('[DONE] drawing heatmap')
      //// console.log('time drawing heatmap', (new Date().getTime() - starttime.getTime())/1000)

    },
    highlightRow(mrna) {

      d3.selectAll('.nodesSource').classed('node-highlight',function (l, li) {

          return mrna.split("+").includes(l.mRNA_id)

      })

      d3.selectAll('.linksBp').classed('link-highlight', function (l, li) {

        return mrna.split("+").includes(l.mRNA_id)

      })

      d3.selectAll('.nodesTarget').classed('node-highlight',function (l, li) {


        if (l.mRNA_id.split("+").length > 1 && mrna.split("+").length > 1) {

          return mrna == l.mRNA_id

        }
          return l.mRNA_id.split("+").includes(mrna)



      })

      d3.selectAll('.rowLabel').classed('text-highlight', function (l, li) {


        if (l.split("+").length > 1 && mrna.split("+").length > 1) {

          return mrna == l

        }

          return l.split("+").includes(mrna)
          

      })

      d3.selectAll('.rowAggr').classed('aggr-highlight', function (l, li) {

        return mrna == l
        
        })

      d3.selectAll('.cell').classed('cell-highlight', function (l, li) {

          if (l.mRNA_id.split("+").length > 1 && mrna.split("+").length > 1) {

            return mrna == l.mRNA_id

          }

          return l.mRNA_id.split("+").includes(mrna)

      })

      d3.selectAll('.pheno0').classed('node-highlight', function (l, li) {

          if (l.mRNA_id.split("+").length > 1 && mrna.split("+").length > 1) {

            return mrna == l.mRNA_id

          }       
          return l.mRNA_id.split("+").includes(mrna)

      })

      d3.selectAll('.pheno1').classed('text-highlight', function (l, li) {

          if (l.mRNA_id.split("+").length > 1 && mrna.split("+").length > 1) {

            return mrna == l.mRNA_id

          }  

          return l.mRNA_id.split("+").includes(mrna)
      })

      d3.selectAll('.strain').classed('text-highlight', function (l, li) {

      if (l.mRNA_id.split("+").length > 1 && mrna.split("+").length > 1) {

        return mrna == l.mRNA_id

      }  

      return l.mRNA_id.split("+").includes(mrna)
      })

    },
    getFormValues() {
      var selected = []
      for (var option of document.getElementById('dendro-select').options) {
        if (option.selected) {
          selected.push(option.value)
        }
      }

      return selected
    },
    getDendroLeavesUpdated(dataDendro) {
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        leafNames.push(e.data.name)
      })
      return leafNames //.reverse()
    },
    toggleLinkDendro() {
      let vis = this

      if (vis.toggleButton == true) {
       
        vis.buttonType = 'dashed'
        vis.toggleButton = false
        vis.linkedDendro = 'dendro-default'
       
        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) 



      } else {

        vis.buttonType = 'primary'
        vis.toggleButton = true
        vis.linkedDendro = 'dendro-custom'
        let sortOrder = vis.dendroLeavesCustom

        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) 

      }

    },
    toggleLinkCoreSNP() {
      let vis = this

      if (vis.toggleButton == false) {

        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) 

      }

    },
    drawLine(sourceNodeIds,targetNodeIds){

      let vis = this;

      return d3.linkHorizontal()({
            source: [2, sourceNodeIds * vis.cellSize],
            target: [vis.bipartiteWidth, targetNodeIds * vis.cellSize],
      
      })

    },
    toggleGroupCreate() {
      let vis = this;

      let selection = vis.selectionGroups

        let brushSelection = []
        if (selection !== null) {

          let selectedRegion = [Math.round(selection[0]), Math.round(selection[1])]
          let idx_start = Math.floor(selectedRegion[0]/vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1]/vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end+1)
          for (let i=0; i<rangeSlice.length; i++){
            brushSelection = brushSelection.concat(rangeSlice[i].split('+'))
          }

        }
      

      // 1. get all current selected elements
      let allSelected = []
      allSelected = Array.from(new Set(brushSelection.concat(vis.altSelection, vis.childsSelected)))

      // get most recent file from store 
      vis.selectedGroups = vis.$store.getters.getGroupsSelected  

      // delete group if items in new selection
      let group_del = vis.selectedGroups.filter(function(d) {
                return allSelected.includes(d.mRNA_id)
              })
      let color_del = d3.map(group_del, function (d) {
                return d['color']
              })
      let colorcode_del = d3.map(group_del, function (d) {
                return d['colorHex']
              })
      let group_nr_del = d3.map(group_del, function (d) {
                return d['group']
              })
      let colorsDel = [... new Set(color_del)]
      let groupsDel = [... new Set(group_nr_del)]

      if (colorsDel.length > 0){

        // re append colors
        vis.colorsGroups = [...vis.colorsGroups.concat(colorsDel)]

        for (let i=0; i < colorsDel.length; i++){
          let color = colorsDel[i]
          d3.selectAll('.rowLabel').classed('group-selection-'+color, false)
          d3.selectAll('.linksBp').classed('group-selection-'+color, false)
          d3.selectAll('.nodesSource').classed('group-selection-'+color, false)
          d3.selectAll('.nodesTarget').classed('group-selection-'+color, false)
          d3.selectAll('.pheno0').classed('group-selection-'+color, false)
          d3.selectAll('.pheno1').classed('group-selection-'+color, false)
          d3.selectAll('.pheno0Label').classed('group-selection-'+color, false)
          d3.selectAll('.pheno1Label').classed('group-selection-'+color, false)
          d3.selectAll('.pheno0LabelMissing').classed('group-selection-'+color, false)
          d3.selectAll('.pheno1LabelMissing').classed('group-selection-'+color, false)
          d3.selectAll('.strain').classed('group-selection-'+color, false)
          d3.selectAll('.cell').classed('group-selection-'+color, false)

        }
        
      }

      vis.selectedGroups = vis.selectedGroups.filter(function(d) {
                return ! colorsDel.includes(d.color)
              })

      let color = vis.colorsGroups.shift()
      let colorName = color['color']
      let colorHex = color['hexcode']

      let nr;
      for (let i =0; i < allSelected.length; i++){
            nr = vis.counter
            vis.selectedGroups.push({'group': nr, 'mRNA_id':allSelected[i], 'color': colorName,'colorHex': colorHex,'checkedColor': false, 'checkedCollapse': false})
      }
      vis.counter = vis.counter+ 1;
      
      this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

      // 2. assign color and make classes 
      var styleText = document.createElement('style');
      styleText.type = 'text/css';
      styleText.innerHTML = 'text.group-selection-'+colorName+' { fill: '+colorHex+';   font-weight: bold; }';

      document.getElementsByTagName('head')[0].appendChild(styleText);

      var styleLinks = document.createElement('style');
      styleLinks.type = 'text/css';
      styleLinks.innerHTML = 'path.group-selection-'+colorName+' { stroke: '+colorHex+'; z-index: 2000;}';

      document.getElementsByTagName('head')[0].appendChild(styleLinks);

      var styleNodePheno = document.createElement('style');
      styleNodePheno.type = 'text/css';
      styleNodePheno.innerHTML = 'circle.group-selection-'+colorName+' { stroke: '+colorHex+'; }';

      document.getElementsByTagName('head')[0].appendChild(styleNodePheno);

      var styleRowAggr = document.createElement('style');
      styleRowAggr.type = 'text/css';
      styleRowAggr.innerHTML = 'rect.group-selection-'+colorName+' { stroke: '+colorHex+' !important; }';

      document.getElementsByTagName('head')[0].appendChild(styleRowAggr);

      var styleRow = document.createElement('style');
      styleRow.type = 'text/css';
      styleRow.innerHTML = 'rect.row-selection-'+colorName+' { stroke: '+colorHex+';  stroke-dasharray: 10,9,10,9 stroke-width: 0.5; stroke-linecap: square; }';

      document.getElementsByTagName('head')[0].appendChild(styleRow);

      // always collapse group after created
      let nodeAggArr = allSelected.sort();
      let nodeAgg = allSelected.sort().join('+')


          const checkAlreadyAggr = nodeAggArr.some(r=> vis.nodesAggArray.includes(r))

          if (checkAlreadyAggr){

              vis.visualRefSelected = 'none' 

              let groupDel;
              groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
              nodeAggArr.includes(mRNA_id))

              let indexDel = d3.map(groupDel, function (d) {
                return d['group']
              })


              indexDel = [... new Set(indexDel)][0]
              
              let samplesDel = []
              let indecesDel = []
              let indexVals = [] 
              let allVals = []
              

              for (let i=0; i< vis.aggregatedSampleString.length; i++){

                let ag_idx = vis.aggrIndex[i]
                let ag_str = vis.aggregatedSampleString[i]
                let ag_samples = vis.aggregatedSampleString[i].split('+')

                allVals.push({'aggr_idx': ag_idx, 'aggr_string': ag_str, 'aggr_samples': ag_samples })

                let arr = vis.aggregatedSampleString[i].split('+')


                const checkAlreadyAggr = nodeAggArr.some(r=> arr.includes(r))
                if (checkAlreadyAggr){
                  samplesDel.push(vis.aggregatedSampleString[i])


                }
              }


              let test_vals = allVals.filter(({aggr_string}) => ! samplesDel.includes(aggr_string))
              let test_string = d3.map(test_vals, d => d.aggr_string)
              let test_idx = d3.map(test_vals, d => d.aggr_idx)
              let test_samples = d3.map(test_vals, d => d.aggr_samples)
              test_samples = test_samples.flat()

              vis.aggregatedSampleString = test_string

              vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
                test_samples.includes(mRNA_id))

              vis.nodesAggArray = test_samples

              vis.aggrIndex = test_idx

              vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({ mRNA_id }) =>
              test_string.includes(mRNA_id))

          }

          
          // add new group 
          for (let i =0; i < nodeAggArr.length; i++){
            // let nr = vis.counter
            vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i]})


          }

          if (vis.maxIndex == null){
            vis.maxIndex = vis.dataSequencesMaxIndex

          }


          let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id))

        let aggregatedChildsPhenos = []
          let ft10Sum = [];
          let ft10missing = [];
          let ft16Sum = [];
          let ft16missing= [];
          
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              ft10Sum.push(parseFloat(dataPhenosChilds[i]['FT10']))
              ft16Sum.push(parseFloat(dataPhenosChilds[i]['FT16']))
              if (dataPhenosChilds[i]['FT10'] == '?'){
                ft10missing.push('?')
              }
              if (dataPhenosChilds[i]['FT16'] == '?'){
                ft16missing.push('?')
              }
          }


          aggregatedChildsPhenos.push(
              { 
                mRNA_id: nodeAgg,
                FT10: ft10missing.length < 0 ? d3.mean(ft10Sum) : [d3.mean(ft10Sum),ft10missing.length],
                FT16: ft16missing.length < 0 ? d3.mean(ft16Sum) : [d3.mean(ft16Sum),ft16missing.length],
                group: nr,
              }
            )

          let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let groupedChilds = d3.groups(
            dataFilteredChilds,
            d => d.position,
            d => d.nucleotide,
            // d => d.informative,
            // d => d.pheno_specific,
            // d => d.variable

          )
          let aggregatedChilds = []
          
          groupedChilds.forEach(function(el) {

              vis.maxIndex += 1

              let idx = vis.maxIndex
              let pos = el[0]
              let nuc = el[1]
              if (nuc.length > 1) {
                let multi = [];
                for (let i = 0; i < nuc.length; i++) {
                  multi.push(nuc[i][0])

                }
                let upper = multi.map(element => {
                  return element.toUpperCase();
                });
                upper = Array.from(new Set(upper))
                nuc =upper.sort().join('|')
                // nuc =multi.sort().join('|')

              }
              else{
                nuc = el[1][0][0]
              }
              let info = el[1][0][1]
              let infoSum = [];
              let phenoSum = [];
              let varSum = [];
                for (let i = 0; i < info.length; i++) {
                  infoSum.push(info[i]['informative'])
                  phenoSum.push(info[i]['pheno_specific'])
                  varSum.push(info[i]['variable'])

              }
          
              // add elements to new array
              aggregatedChilds.push(
                { 
                  index: String(idx),
                  position: pos,  
                  nucleotide: nuc,
                  mRNA_id: nodeAgg,
                  variable: [... new Set(varSum)].join("|"),
                  informative: [... new Set(infoSum)].join("|"),
                  pheno_specific: [... new Set(phenoSum)].join("|")
                }
              )
              
            }
          );

          let aggrIndeces = []

          for (let j = 0; j < nodeAggArr.length; j++) {
            aggrIndeces.push(vis.currentSortingOrderAll.indexOf(nodeAggArr[j]))
          } 

          vis.aggrIndex = [...vis.aggrIndex.concat(Math.round(d3.mean(aggrIndeces)))]
          vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
          vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
          vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]

          vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

          vis.currentSortAll = vis.rowSorterCurrentAll

          if (vis.nodesAggArray.includes(vis.visualRefSelected)){
            // console.log('ref in group')
              // set VR back to none
              vis.visualRefSelected = 'none'

          }

          vis.drawAnnotations()
          vis.drawBipartite(vis.newSortwithAggregated)
          vis.drawHeatMap(vis.newSortwithAggregated)
          vis.drawPhenotypes(vis.newSortwithAggregated)


          // give color to highlight change
          d3.selectAll('.rowLabel')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
                
                d3.selectAll('.pheno0')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
 
                d3.selectAll('.pheno0Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesSource')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesTarget')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.linksBp')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.cell')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)


                // aggregated rows
                d3.selectAll('.rowAggr')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0Label')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1Label')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0LabelMissing')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1LabelMissing')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)
                
                d3.selectAll('.linksBp')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.nodesSource')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)


                d3.selectAll('.nodesTarget')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.vir')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.cell')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

                let dataPrevious  = _.cloneDeep(this.$store.getters.getGroupsSelected)

                //update value in dict
                for (let i=0; i< dataPrevious.length; i++){
                if (dataPrevious[i]['group'] == nr){
                dataPrevious[i]['checkedColor'] = false 
                dataPrevious[i]['checkedCollapse'] = true

                }
              }
              this.$store.dispatch('setGroupsSelected', dataPrevious)

      // reset selections
      vis.altSelection = []
      vis.childsSelected = []
      vis.boolGroups = false
      vis.selectionGroups = []
      selection = []
      brushSelection = []

      d3.selectAll('.rowLabel').classed('text-selection', false)
      d3.selectAll('.specie').classed('text-selection', false)
      d3.selectAll('.vir').classed('pheno-node-selection', false)
      d3.selectAll('.strain').classed('text-selection', false)
      d3.selectAll('.linksBp').classed('link-selection', false)
      d3.selectAll('.nodesSource').classed('node-selection', false)
      d3.selectAll('.nodesTarget').classed('node-selection', false)
      d3.selectAll('.nodeDendro').classed('node-selection', false)
      d3.selectAll('.cell').classed('cell-selection', false)


      d3.select('.phenoBrush > .selection').attr('height','0').attr('y','-30') //make invisible
      d3.select('.phenoBrush > .handle').attr('height','0').attr('y','-30') //make invisible

      d3.select('.rowBrush > .selection').attr('height','0').attr('y','-30') //make invisible
      d3.select('.rowBrush > .handle').attr('height','0').attr('y','-30') //make invisible


    },
    toggleGroupCollapse() {
      let vis = this;

      vis.boolGroups = true

      let selection = vis.selectionGroups

      if ((selection !== null && vis.boolGroups == true) || (vis.altSelection.length >0 && vis.boolGroups == true) ) {

        let nodeAggArr = []
        if (selection !== null) {

          let selectedRegion = [Math.round(selection[0]), Math.round(selection[1])]
  
          let idx_start = Math.floor(selectedRegion[0]/vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1]/vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end+1)

          for (let i=0; i<rangeSlice.length; i++){
            nodeAggArr = nodeAggArr.concat(rangeSlice[i].split("+"))
          }

        }
       
          // include items alt
          if (vis.altSelection.length >0) {

            let difference = vis.altSelection.filter(x => !nodeAggArr.includes(x))
            nodeAggArr = [...nodeAggArr.concat(difference)]

            vis.altSelection = []


          }
          // include items from dendro/tree
          if (vis.childsSelected.length >0) {

            nodeAggArr = [...new Set([...nodeAggArr.concat(vis.childsSelected)])]

          }
         
          let nodeAgg = nodeAggArr.sort().join("+")
        

          const checkAlreadyAggr = nodeAggArr.some(r=> vis.nodesAggArray.includes(r))


          if (checkAlreadyAggr){

              let groupDel;
              groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
              nodeAggArr.includes(mRNA_id))

              let indexDel = d3.map(groupDel, function (d) {
                return d['group']
              })
              indexDel = [... new Set(indexDel)][0]

              let nodeDel = vis.aggregatedSampleString[indexDel]

              let samplesDel = []
              let indecesDel = []
              let indexVals = []

              for (let i=0; i< vis.aggregatedSampleString.length; i++){

                let arr = vis.aggregatedSampleString[i].split("+")


                const checkAlreadyAggr = nodeAggArr.some(r=> arr.includes(r))
                if (checkAlreadyAggr){
                  samplesDel.push(vis.aggregatedSampleString[i])
                  indecesDel.push(vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i]))
                  indexVals.push(vis.aggrIndex[i])

                }


              }

              for (let i=0; i<samplesDel.length; i++){

                let nodeDel = samplesDel[i]
                let childsDel = samplesDel[i].split("+")
                let indexDel = indecesDel[i]
               

                vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
                d !== nodeDel)

                vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
                ! childsDel.includes(mRNA_id))

                vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
                ! childsDel.includes(d))

                vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
                          mRNA_id !== nodeDel)

              }
              
              vis.aggrIndex = vis.aggrIndex.filter(n => ! indexVals.includes(n))



            }


          for (let i =0; i < nodeAggArr.length; i++){
            let nr = vis.counter
            vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i]})
          }

          if (vis.maxIndex == null){
            vis.maxIndex = vis.dataSequencesMaxIndex

          }


          let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let aggregatedChildsPhenos = []
          let virSum = [];
          let specieSum = [];
          let strainSum = [];
          
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              virSum.push(dataPhenosChilds[i]['virulence'])
              specieSum.push(dataPhenosChilds[i]['species'])
              strainSum.push(dataPhenosChilds[i]['strain_name'])
          }

          aggregatedChildsPhenos.push(
              { 
                mRNA_id: nodeAgg,
                virulence: [... new Set(virSum)].join("|"),
                species: [... new Set(specieSum)].join("|"),
                strain_name: [... new Set(strainSum)].join("|"),
                group: vis.counter,
              }
            )

          vis.counter ++;


          let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let groupedChilds = d3.groups(
            dataFilteredChilds,
            d => d.position,
            d => d.nucleotide,
            // d => d.informative,
            // d => d.pheno_specific,
            // d => d.variable

          )
          let aggregatedChilds = []
          
          groupedChilds.forEach(function(el) {

              vis.maxIndex += 1

              let idx = vis.maxIndex
              let pos = el[0]
              let nuc = el[1]
              if (nuc.length > 1) {
                let multi = [];
                for (let i = 0; i < nuc.length; i++) {
                  multi.push(nuc[i][0])

                }
                let upper = multi.map(element => {
                  return element.toUpperCase();
                });
                upper = Array.from(new Set(upper))
                nuc =upper.sort().join('|')


              }
              else{
                nuc = el[1][0][0]
              }
              let info = el[1][0][1]
              let infoSum = [];
              let phenoSum = [];
              let varSum = [];
                for (let i = 0; i < info.length; i++) {
                  infoSum.push(info[i]['informative'])
                  phenoSum.push(info[i]['pheno_specific'])
                  varSum.push(info[i]['variable'])

              }
          
              // add elements to new array
              aggregatedChilds.push(
                { 
                  index: String(idx),
                  position: pos,  
                  nucleotide: nuc,
                  mRNA_id: nodeAgg,
                  variable: [... new Set(varSum)].join("|"),
                  informative: [... new Set(infoSum)].join("|"),
                  pheno_specific: [... new Set(phenoSum)].join("|")
                }
              )
              
            }
          );

          let aggrIndeces = []

          for (let j = 0; j < nodeAggArr.length; j++) {
            aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
          } 


          vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
          vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
          vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
          vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]

          vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list


          vis.currentSortAll = vis.rowSorterCurrentAll

          vis.drawHeatMap(vis.newSortwithAggregated)
          vis.drawBipartite(vis.newSortwithAggregated)

          d3.select('.phenoBrush > .selection').attr('height','0').attr('y','-30') //make invisible
          d3.select('.phenoBrush > .handle').attr('height','0').attr('y','-30') //make invisible

          d3.select('.rowBrush > .selection').attr('height','0').attr('y','-30') //make invisible
          d3.select('.rowBrush > .handle').attr('height','0').attr('y','-30') //make invisible


          vis.boolGroups = false
          vis.selectionGroups = []
          vis.childsSelected = []

          // remove selection
          d3.selectAll('.nodeDendro').classed('node-selection', false)
          d3.selectAll('.nodesSource').classed('node-selection', false)
          d3.selectAll('.nodesTarget').classed('node-selection', false)
          d3.selectAll('.linksBp').classed('link-selection', false)
          d3.selectAll('.cell').classed('cell-selection', false)
        }

    },
    async toggleCheckedDendro() {

      let vis = this

      d3.select('#rowSorting').property('selectedIndex', 3).node().focus() // set button to dendro-custom
      d3.selectAll('.phenoLabel').classed('text-selected', false)
     
      vis.rowSort = 'dendro-custom'
      vis.rowSortSteps = [vis.rowSort]; //reset steps

      vis.linkedDendro = 'dendro-custom'
      
      let selected = this.$store.getters.selectedPositions

      let selected_id = this.$store.getters.chosenHomologyId

      let res = await axios.post(
        `${process.env.VUE_APP_FLASK_URL}/${selected_id}/d3dendro`,
        { selected_items: selected }
      ) 

      let data = res.data
      vis.dendroCustom = data

      let dendroLeavesCustom = vis.getDendroLeavesUpdated(data)
      vis.dendroLeavesCustom = dendroLeavesCustom

      vis.currentSort = vis.dendroLeaves
      vis.currentSortAll = vis.dendroLeavesAll //important!! 

      // update views
      vis.drawView();

    },
    elbow(d, i) {

    return (
      'M' +
      d.source.y +
      ',' +
      d.source.x +
      'V' +
      d.target.x +
      'H' +
      d.target.y
    )

    },
    getCategories(data, attr){

    var categories = d3.map(data, function (d) {

      return d[attr]
    })

    categories = new Set(categories)
    categories = Array.from(categories)

    return categories

    },
    getCategoryDict(data, categories, attr){

    let cat_dict = [];
    for (let i = 0; i < categories.length; i++) {
      let indices = []
      var total_class = data.filter(function (d){
        if (d[attr] == categories[i]) {
          indices.push(d.idx)
          return d
        }
      })
    let mean_idx = d3.mean(indices)
    let median_idx = d3.median(indices)
    cat_dict.push({'cat':categories[i], 'count': total_class.length, 'mean_idx': mean_idx, 'median_idx': median_idx, 'items': total_class})
    }

    return cat_dict

    },
    addIdxComp(data, categoriesDict, attr){

    let data_class;
    let comp_values;

    for (let i = 0; i < data.length; i++) {

      data_class = data[i][attr]

      comp_values = categoriesDict.filter(function (d){
        if (d.cat == data_class) {
          return d
        }
      })

      data[i][attr+'_mean_idx'] = comp_values[0].mean_idx
      data[i][attr+'_median_idx'] = comp_values[0].median_idx
    }

    return data

    },
    getArraySortedCategorical(data, categories, orderNew, mode = 'median'){

      let categories_dict = this.getCategoryDict(data, categories, orderNew)
      let dataWithCompIdx  = this.addIdxComp(data, categories_dict, orderNew)

      let orderKey = orderNew+'_'+mode+'_idx'

      dataWithCompIdx.sort(function(a, b) {
        var keyA = a[orderKey],
            keyB = b[orderKey];
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        })

      let mRNAs = d3.map(dataWithCompIdx, function (d) {
        return d.mRNA_id
        })

      return mRNAs

    },
    getRowSorting(dataCurrent, orderNew, mode = 'median'){

    let data = _.cloneDeep(dataCurrent);
    let dataSorted;

    if (this.metadataAttributes.includes(orderNew)){
        let mRNAs = this.getArraySortedCategorical(data, this.metadataDictCat[orderNew], orderNew, mode)
        dataSorted = mRNAs;

      }
      if (orderNew == 'dendro-default'){
        dataSorted = this.dendroLeavesDefaultFiltered

      }
      if (orderNew == 'dendro-custom') {
        dataSorted = this.dendroLeavesCustom

      }
      if (orderNew == 'initial') {
        dataSorted = this.yLabelsNames

      }
      if (orderNew == 'position') {

        if (this.rowFilter == 'subset'){
          dataSorted = this.currentSort.filter(d => this.subsetTest.includes(d))
        }
        if (this.aggregatedSampleString !== null){
          dataSorted = this.currentSort.filter(d => !this.aggregatedSamples.includes(d))

        }
        else {
          dataSorted = this.currentSort 
        }
      }
      return dataSorted

    },
    getRowSorting2(dataCurrent, orderNew, mode = 'median'){

    let data = _.cloneDeep(dataCurrent);
    let dataSorted;


    if (this.metadataAttributes.includes(orderNew)){


        let arrayFT = d3.map(data, (d) => d[orderNew])
        let arrayFTSorted = _.cloneDeep(data).sort(function(a,b){
            if( !isFinite(a[orderNew]) && !isFinite(b[orderNew]) ) {
                return 0;
            }
            if( !isFinite(a[orderNew]) ) {
                return 1;
            }
            if( !isFinite(b[orderNew]) ) {
                return -1;
            }
            return a[orderNew]-b[orderNew];
        });

        let mRNAs = d3.map(arrayFTSorted, (d) => d.mRNA_id)
        
        dataSorted = mRNAs;

      }
      if (orderNew == 'dendro-default'){
        dataSorted = this.dendroLeavesDefault

      }
      if (orderNew == 'dendro-custom') {
        dataSorted = this.dendroLeavesCustom

      }
      if (orderNew == 'initial') {
        dataSorted = this.yLabelsNamesAll

      }
      if (orderNew == 'position') {

        dataSorted = this.currentSortAll //? correct?
      }

      return dataSorted

    },
   
  },
  created() {
    // console.log(this.name + ' created')

  },
  mounted() {
    // console.log(this.name + ' mounted')

    // initialize svg's
    this.bipartiteWidth =
      document.getElementById('bipartite').offsetWidth * 0.95

    this.initialBipartiteWidth =
      document.getElementById('bipartite').offsetWidth * 0.95

    this.newBipartiteWidth =
      document.getElementById('bipartite').offsetWidth * 0.95

    this.bipartiteWidthTotal =
      document.getElementById('bipartite').offsetWidth
    this.dendroWidth = document.getElementById('dendro').offsetWidth * 0.93

    this.initialBipartiteWidthTotal =
      document.getElementById('bipartite').offsetWidth * 0.93
    
    this.newBipartiteWidthTotal =
      document.getElementById('bipartite').offsetWidth * 0.93

    let initialDendroWith = document.getElementById('dendro').offsetWidth * 0.93
    this.initialDendroWith = initialDendroWith;

    let newDendroWith = document.getElementById('dendro').offsetWidth * 0.93
    this.newDendroWith = newDendroWith;

    let phenoBrushGroup = d3.select('#brushview')
      .append('g')
      .attr('class', 'phenoBrush')

    let pheno0Group = d3
      .select('#pheno0view')
      .append('g')
      .attr('class', 'phenos0')

    let pheno1Group = d3
      .select('#pheno1view')
      .append('g')
      .attr('class', 'phenos1')

    let rowLabelGroup = d3
      .select('#heatmapviewRow')
      .append('g')
      .attr('class', 'rowLabels')

      rowLabelGroup
      .append('g')
      .attr('class', 'rowBrush')
      .attr('transform', 'translate(0,' + -5 + ')')

      rowLabelGroup
      .append('g')
      .attr('class', 'rowAggr')

    let cellBrushGroup = d3.select('#heatmapview')
      .append('g')
      .attr('class', 'cellBrush')

    let bipartiteGroup = d3
      .select('#bipartiteview')
      .append('g')
      .attr('class', 'bipartite')

    let colLabelGroup = d3
      .select('#heatmapviewCol')
      .append('g')
      .attr('class', 'colLabels')

    let colAnnotationsGroup = d3
      .select('#heatmapviewColCheck')
      .append('g')
      .attr('class', 'colLabelChecks')

    let visualRefGroup = d3
      .select('#heatmapviewVisRef')
      .append('g')
      .attr('class', 'visualRef')

    let dendroGroup = d3
      .select('#dendroview')
      .append('g')
      .attr('class', 'dendro')

    this.rowLabelGroup = rowLabelGroup
    this.bipartiteGroup = bipartiteGroup
    this.pheno0Group = pheno0Group
    this.pheno1Group = pheno1Group
    this.colLabelGroup = colLabelGroup
    this.colAnnotationsGroup = colAnnotationsGroup
    this.visualRefGroup = visualRefGroup
    this.dendroGroup = dendroGroup

    let rowLabelWidth =
      document.getElementById('heatmapRow').offsetWidth


    this.rowLabelWidth = rowLabelWidth

    // initalize brush rowLabels
    let brushRowLabels = d3.brushY()                   
        .extent( [ [-5,-20], [this.rowLabelWidth,this.chartHeightMax-10] ] )  

    this.brushRowLabels = brushRowLabels

     // initalize brush cells
     let brushCells = d3.brushY()                   
        .extent( [ [0,0], [this.rowLabelWidth*7,this.chartHeightMax-10] ] )  

    this.brushCells = brushCells

    let phenoWidth =
      document.getElementById('phenotypes').deviceWidth

     // initalize brush 
     let brushPhenos= d3.brushY()                   
        .extent( [ [-10,0], [phenoWidth,this.chartHeightMax-10] ] )     
      
  
    this.brushPhenos = brushPhenos

    ///////////////////////////////////
    //// interactions once mounted ////
    ///////////////////////////////////
    let vis = this

    vis.drawView()

    // Add brush before rowlabels
    vis.rowLabelGroup
      .selectAll('.rowBrush')
      .call( vis.brushRowLabels)

      d3.select("#heatmapview")
      .selectAll('.cellBrush')
      .call( vis.brushCells)

     // Add brush before rowlabels
     d3.select('#brushview')
      .selectAll('.phenoBrush')
      .call( vis.brushPhenos)

      vis.brushRowLabels.on('start brush', brushedSelection) //change 'end' to 'brush' if want to see inbetween
      vis.brushRowLabels.on('end', aggregateRows) //change 'end' to 'brush' if want to see inbetween


      vis.brushPhenos.on('start brush', brushedSelectionPhenos) 
      vis.brushPhenos.on('end', aggregateRows) 


      function aggregateRows({selection}){

        vis.selectionGroups = selection

        if (selection !== null && vis.boolGroups == true){

          let selectedRegion = [Math.round(selection[0]), Math.round(selection[1])]
          let idx_start = Math.floor(selectedRegion[0]/vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1]/vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end+1)
          let nodeAggArr = []
          for (let i=0; i<rangeSlice.length; i++){
            nodeAggArr = nodeAggArr.concat(rangeSlice[i].split("+"))
          }
          let nodeAgg = nodeAggArr.sort().join("+")

          const checkAlreadyAggr = nodeAggArr.some(r=> vis.nodesAggArray.includes(r))

          if (checkAlreadyAggr){

              let groupDel;
              groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
              nodeAggArr.includes(mRNA_id))

              let indexDel = d3.map(groupDel, function (d) {
                return d['group']
              })

              indexDel = [... new Set(indexDel)][0]
              
              let nodeDel = vis.aggregatedSampleString[indexDel]

              let samplesDel = []
              let indecesDel = []

              for (let i=0; i< vis.aggregatedSampleString.length; i++){

                let arr = vis.aggregatedSampleString[i].split("+")

                const checkAlreadyAggr = nodeAggArr.some(r=> arr.includes(r))
                if (checkAlreadyAggr){
                  samplesDel.push(vis.aggregatedSampleString[i])
                  indecesDel.push(vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i]))
                }


              }

              for (let i=0; i<samplesDel.length; i++){

                let nodeDel = samplesDel[i]
                let childsDel = samplesDel[i].split("+")
                let indexDel = indecesDel[i]

                vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
                d !== nodeDel)

                vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
                ! childsDel.includes(mRNA_id))

                vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
                ! childsDel.includes(d))

                vis.aggrIndex = vis.aggrIndex.filter((d) => ! indecesDel.includes(vis.aggrIndex.indexOf(d)))


                vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
                          mRNA_id !== nodeDel)

              }



          }
  
          for (let i =0; i < nodeAggArr.length; i++){
            let nr = vis.counter
            vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i]})
          }
         
          if (vis.maxIndex == null){
            vis.maxIndex = vis.dataSequencesMaxIndex

          }

          let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let aggregatedChildsPhenos = []
          let ft10Sum = [];
          let ft10missing = [];
          let ft16Sum = [];
          let ft16missing= [];
          
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              ft10Sum.push(parseFloat(dataPhenosChilds[i]['FT10']))
              ft16Sum.push(parseFloat(dataPhenosChilds[i]['FT16']))
              if (dataPhenosChilds[i]['FT10'] == '?'){
                ft10missing.push('?')
              }
              if (dataPhenosChilds[i]['FT16'] == '?'){
                ft16missing.push('?')
              }
          }


          aggregatedChildsPhenos.push(
              { 
                mRNA_id: nodeAgg,
                FT10: ft10missing.length < 0 ? d3.mean(ft10Sum) : [d3.mean(ft10Sum),ft10missing.length],
                FT16: ft16missing.length < 0 ? d3.mean(ft16Sum) : [d3.mean(ft16Sum),ft16missing.length],
                group: vis.counter,
              }
            )

          vis.counter ++;

          let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          // group nucleotides 
          let groupedChilds = d3.groups(
            dataFilteredChilds,
            d => d.position,
            d => d.nucleotide,
            // d => d.informative,
            // d => d.pheno_specific,
            // d => d.variable

          )
          let aggregatedChilds = []
          
          groupedChilds.forEach(function(el) {

              vis.maxIndex += 1

              let idx = vis.maxIndex
              let pos = el[0]
              let nuc = el[1]
              if (nuc.length > 1) {
                let multi = [];
                for (let i = 0; i < nuc.length; i++) {
                  multi.push(nuc[i][0])
      
                }
                let upper = multi.map(element => {
                  return element.toUpperCase();
                });
                upper = Array.from(new Set(upper))
                nuc =upper.sort().join('|')
    
              }
              else{
                nuc = el[1][0][0]
              }
              let info = el[1][0][1]
              let infoSum = [];
              let phenoSum = [];
              let varSum = [];
                for (let i = 0; i < info.length; i++) {
                  infoSum.push(info[i]['informative'])
                  phenoSum.push(info[i]['pheno_specific'])
                  varSum.push(info[i]['variable'])
      
              }
           
              aggregatedChilds.push(
                { 
                  index: String(idx),
                  position: pos,  
                  nucleotide: nuc,
                  mRNA_id: nodeAgg,
                  variable: [... new Set(varSum)].join("|"),
                  informative: [... new Set(infoSum)].join("|"),
                  pheno_specific: [... new Set(phenoSum)].join("|")
                }
              )
              
            }
          );

          let aggrIndeces = []

          for (let j = 0; j < nodeAggArr.length; j++) {
            aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
          } 

          vis.aggrIndex = [...vis.aggrIndex.concat(Math.round(d3.mean(aggrIndeces)))] //d3.min(aggrIndeces)
          vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
          vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
          vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]
    
          vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list
        
          vis.currentSortAll = vis.rowSorterCurrentAll

          vis.drawHeatMap(vis.newSortwithAggregated)
          vis.drawPhenotypes(vis.newSortwithAggregated)
          vis.drawBipartite(vis.newSortwithAggregated)


          d3.select('.phenoBrush > .selection').attr('height','0').attr('y','-30') //make invisible
          d3.select('.phenoBrush > .handle').attr('height','0').attr('y','-30') //make invisible

          d3.select('.rowBrush > .selection').attr('height','0').attr('y','-30') //make invisible
          d3.select('.rowBrush > .handle').attr('height','0').attr('y','-30') //make invisible

          vis.boolGroups = false
        }

      }

    function brushedSelection({ selection }) {
        if (selection !== null){
          let selectedRegion = [Math.round(selection[0]), Math.round(selection[1])]
          let idx_start = Math.floor(selectedRegion[0]/vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1]/vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end+1)

          let rangeItemsArr = []
          vis.rangeItemsArr = rangeItemsArr
          let rangeItems = d3.filter(rangeSlice, function(d) {

            return d.split("+").length > 1
          })

          for (let i=0; i< rangeItems.length; i++){
            let items = rangeItems[i].split("+")
            vis.rangeItemsArr = [...vis.rangeItemsArr.concat(items)]
          }

          d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
            
            return rangeSlice.includes(l)

          })

          d3.selectAll('.rowAggr').classed('aggr-selection', function (l, li) {
            
            return rangeSlice.includes(l)

          })

          d3.selectAll('.pheno1').classed('aggr-selection', function (l, li) {


          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0').classed('aggr-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.pheno1Label').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0Label').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.pheno1LabelMissing').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0LabelMissing').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.cell').classed('cell-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesSource').classed('node-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesSource')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('node-selection', true)

          d3.selectAll('.nodesTarget').classed('node-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesTarget')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('node-selection', true)

          d3.selectAll('.linksBp').classed('link-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.linksBp')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('link-selection', true)

        }

      }

      function brushedSelectionPhenos({ selection }) {
        if (selection !== null){
          let selectedRegion = [Math.round(selection[0]), Math.round(selection[1])]
          let idx_start = Math.floor(selectedRegion[0]/vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1]/vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end+1)

          let rangeItems = d3.filter(rangeSlice, function(d) {

          let rangeItemsArr = []
          vis.rangeItemsArr = rangeItemsArr
            return d.split("+").length > 1
          })
          for (let i=0; i< rangeItems.length; i++){
            let items = rangeItems[i].split("+")
            vis.rangeItemsArr = [...vis.rangeItemsArr.concat(items)]
          }
    
          d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
            
            return rangeSlice.includes(l)

          })

          d3.selectAll('.rowAggr').classed('aggr-selection', function (l, li) {
            
            return rangeSlice.includes(l)

          })

          d3.selectAll('.pheno1').classed('aggr-selection', function (l, li) {


          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0').classed('aggr-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.pheno1Label').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0Label').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.pheno1LabelMissing').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })
          d3.selectAll('.pheno0LabelMissing').classed('text-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.cell').classed('cell-selection', function (l, li) {

          return rangeSlice.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesSource').classed('node-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesSource')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('node-selection', true)

          d3.selectAll('.nodesTarget').classed('node-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.nodesTarget')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('node-selection', true)

          d3.selectAll('.linksBp').classed('link-selection', function (l, li) {
            
            return vis.rangeItemsArr.includes(l.mRNA_id)

          })

          d3.selectAll('.linksBp')
        .filter(function() {
                  return rangeSlice.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('link-selection', true)



        }

      }


    // select labels
    let phenosLabel0 = d3
      .select('#phenosLabel0G')
      .data(['FT10'])
      .append('text')
      .attr('class', 'phenoLabel')
      .style('text-anchor', 'left')
      .style('font-size', '10px')

      .attr('transform', 'translate(' + 0 + ', 15) rotate(-45)')
      .attr('dx', '.8em')
      .text('FT10')
      .on('click', function (event) {
        let selectValue = 'FT10'
        vis.rowSort = 'FT10'

        d3.selectAll('.phenoLabel').classed('text-selected', function(d, i){
          return selectValue == d
        })
        d3.selectAll('.colLabel').classed('text-selected', false)


        sortRows(selectValue)
        d3.select('#rowSorting').property('selectedIndex', 5).node().focus()

        })
        .on('mouseover', function (event) {
            d3.select(this).classed('text-hover', true)
        })
        .on('mouseout', function (event) {
            // on mouseout rect
            d3.select(this).classed('text-hover', false)
        })
    

    let phenosLabel1 = d3
      .select('#phenosLabel1G')
      .data(['FT16'])
      .append('text')
      .attr('class', 'phenoLabel')
      .style('text-anchor', 'left')
      .style('font-size', '10px')
      .attr('transform', 'translate(' + 0 + ', 15) rotate(-45)')
      .attr('dx', '.8em')
      .text('FT16')
      .on('click', function () {
        let selectValue = 'FT16'
        vis.rowSort = 'FT16'

        d3.selectAll('.phenoLabel').classed('text-selected', function(d, i){

        return selectValue == d
        })

        sortRows(selectValue)
        d3.select('#rowSorting').property('selectedIndex', 6).node().focus()
          
        })
        .on('mouseover', function (d) {
            d3.select(this).classed('text-hover', true)

          })
          .on('mouseout', function (d) {
            // on mouseout rect
            d3.select(this).classed('text-hover', false)

          })

        var span = document.getElementsByClassName("close")[0];
      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        d3.select('#popOverGroup').classed('hidden', true)
        d3.select('#popOverBg').classed('hidden', true)
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        let text_input = document.getElementById('group_name')
        if (event.target !== text_input){
          d3.select('#popOverGroup').classed('hidden', true)
          d3.select('#popOverBg').classed('hidden', true)
        }
      }

    var svgPattern = d3.select("body").append("svg");
      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
      .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACGT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACGT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACGT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACGT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAC')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AC.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25)

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAG')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AG.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25)

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25)

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCG')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CG.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternGT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_GT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACG')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACG.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAGT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AGT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCGT')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CGT.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternA-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_A-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternC-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_C-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternG-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_G-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

      svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_T-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAC-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AC-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAG-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AG-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCG-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CG-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternGT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_GT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACG-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACG-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternACT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_ACT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);


        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternAGT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_AGT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);


        svgPattern.append('defs')
      .append('pattern')
        .attr('id', 'patternCGT-')
        .attr("width", 10)
        .attr("height", 10)
        .attr('patternUnits', 'userSpaceOnUse')
        .append("svg:image")
        .attr("xlink:href", '../ps_CGT-.png')
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", 0.25)
        .attr("y", 0.25);

    // filter columns
    d3.select('#colFilter').on('change', function () {
      let selectValue = d3.select('#colFilter').property('value')
      vis.$store.dispatch('setPositionsFilter', selectValue) //update store

      vis.drawHeatMap(vis.newSortwithAggregated) 
      vis.drawAnnotations()
    })

    d3.select('#rowFilter').on('change', function () {
      let selectValue = d3.select('#rowFilter').property('value')

      if (selectValue == 'subset'){


        vis.drawBipartite(vis.newSortwithAggregated)
        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)

      }
      if (selectValue == 'all'){

        vis.drawBipartite(vis.newSortwithAggregated) 
        vis.drawHeatMap(vis.newSortwithAggregated) 
        vis.drawPhenotypes(vis.newSortwithAggregated) 

      }

     
    })

    // change cell color
    d3.select('#cellColors').on('change', function () {
      let selectValue = d3.select('#cellColors').property('value')

      vis.drawHeatMap(vis.newSortwithAggregated) 
    })

     // change VR
     d3.select('#visualReference').on('change', function () {

      let selectValue = d3.select('#visualReference').property('value')
      vis.visualRefSelected = selectValue
      d3.selectAll('.rowLabel').classed('text-ref', function(d){
        return d == selectValue // make label pop out
      })

      vis.drawHeatMap(vis.newSortwithAggregated) 
      vis.drawAnnotations(vis.newSortwithAggregated) 

    })

    // change sorting rows 
    d3.select('#rowSorting').on('change', function () {
      let selectValue = d3.select('#rowSorting').property('value')

      vis.rowSort = selectValue; //update rowSort
      vis.$store.dispatch('setAccessionsSort', selectValue) //update store

      if (vis.rowSort == 'dendro-default' | vis.rowSort == 'dendro-custom'){
        vis.linkedDendro = vis.rowSort

      }
      
      sortRows(selectValue)

      //selected labels
      d3.selectAll('.phenoLabel').classed('text-selected', function(d, i){
        return selectValue == d
        })
    })

  
    // row sort function
    function sortRows(selectValue) {

      vis.rowSort = selectValue
      if (vis.rowSort == 'dendro-default' | vis.rowSort == 'dendro-custom'){
        vis.rowSortSteps = [vis.rowSort] // reset steps 

      }
      else{
        vis.rowSortSteps.push(vis.rowSort)
      }

      vis.currentSortAll = vis.rowSorterCurrentAll
      
      vis.drawView()

      vis.currentSortRow = selectValue;


    }

    ////////////////////////
    //// sync scrolling ////
    ////////////////////////
    var isSyncingRowLabelScroll = false
    var isSyncingHeatmapVerticalScroll = false
    var rowLabelDiv = document.getElementById('heatmapRow')
    var heatmapDiv = document.getElementById('heatmap')

    var isSyncingColLabelScroll = false
    var isSyncingHeatmapHorizontalScroll = false
    var colLabelDiv = document.getElementById('heatmapCol')

    var isSyncingDendroScroll = false
    var dendroDiv = document.getElementById('dendro')

    var isSyncingBipartiteScroll = false
    var bipartiteDiv = document.getElementById('bipartite')

    var isSyncingPhenosScroll = false
    var phenosDiv = document.getElementById('phenotypes')

    phenosDiv.onscroll = function () {
      if (!isSyncingPhenosScroll) {
        isSyncingRowLabelScroll = true
        isSyncingHeatmapVerticalScroll = true
        isSyncingDendroScroll = true
        isSyncingBipartiteScroll = true
        rowLabelDiv.scrollTop = this.scrollTop
        heatmapDiv.scrollTop = this.scrollTop
        dendroDiv.scrollTop = this.scrollTop
        bipartiteDiv.scrollTop = this.scrollTop
      }
      isSyncingPhenosScroll = false
    }

    bipartiteDiv.onscroll = function () {
      if (!isSyncingBipartiteScroll) {
        isSyncingRowLabelScroll = true
        isSyncingHeatmapVerticalScroll = true
        isSyncingDendroScroll = true
        isSyncingPhenosScroll = true
        rowLabelDiv.scrollTop = this.scrollTop
        heatmapDiv.scrollTop = this.scrollTop
        dendroDiv.scrollTop = this.scrollTop
        phenosDiv.scrollTop = this.scrollTop
      }
      isSyncingBipartiteScroll = false
    }

    dendroDiv.onscroll = function () {
      if (!isSyncingDendroScroll) {
        isSyncingRowLabelScroll = true
        isSyncingHeatmapVerticalScroll = true
        isSyncingBipartiteScroll = true
        isSyncingPhenosScroll = true

        rowLabelDiv.scrollTop = this.scrollTop
        heatmapDiv.scrollTop = this.scrollTop
        bipartiteDiv.scrollTop = this.scrollTop
        phenosDiv.scrollTop = this.scrollTop
      }
      isSyncingDendroScroll = false
    }

    rowLabelDiv.onscroll = function () {
      if (!isSyncingRowLabelScroll) {
        isSyncingHeatmapVerticalScroll = true
        isSyncingDendroScroll = true
        isSyncingBipartiteScroll = true
        isSyncingPhenosScroll = true

        heatmapDiv.scrollTop = this.scrollTop
        dendroDiv.scrollTop = this.scrollTop
        bipartiteDiv.scrollTop = this.scrollTop
        phenosDiv.scrollTop = this.scrollTop
      }
      isSyncingRowLabelScroll = false
    }

    heatmapDiv.onscroll = function () {
      if (!isSyncingHeatmapVerticalScroll) {
        isSyncingRowLabelScroll = true
        isSyncingDendroScroll = true
        isSyncingBipartiteScroll = true
        isSyncingPhenosScroll = true
        rowLabelDiv.scrollTop = this.scrollTop
        dendroDiv.scrollTop = this.scrollTop
        bipartiteDiv.scrollTop = this.scrollTop
        phenosDiv.scrollTop = this.scrollTop
      }
      isSyncingHeatmapVerticalScroll = false

      if (!isSyncingHeatmapHorizontalScroll) {
        isSyncingColLabelScroll = true
        colLabelDiv.scrollLeft = this.scrollLeft
      }
      isSyncingHeatmapHorizontalScroll = false
    }

    colLabelDiv.onscroll = function () {
      if (!isSyncingColLabelScroll) {
        isSyncingHeatmapHorizontalScroll = true
        heatmapDiv.scrollLeft = this.scrollLeft
      }
      isSyncingColLabelScroll = false
    }

  
  },
  updated() {
    // console.log(this.name + ' updated')
    let vis = this;


    // delete group 
    if (vis.groupToDelete !== null){

      let group = vis.groupToDelete //this.$store.getters.getGroupToDelete
      let groupMembers = vis.selectedGroups.filter(function(d) {
                  return d.group == group
                })
        let color = d3.map(groupMembers, function (d) {
            return d.color
            })
        color = Array.from(new Set(color))[0]

        let groupDeleted = d3.map(groupMembers, function (d) {
            return d.mRNA_id
        })

        d3.selectAll('.rowLabel')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno1')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.strain')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)
        
        d3.selectAll('.linksBp')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.nodesSource')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)


        d3.selectAll('.nodesTarget')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)


        d3.selectAll('.pheno0')
        .filter(function() {
                  return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)
   
        d3.selectAll('.pheno1Label')
        .filter(function() {
        return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0Label')
        .filter(function() {
        return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.pheno1LabelMissing')
        .filter(function() {
        return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0LabelMissing')
        .filter(function() {
        return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.cell')
        .filter(function() {
        return groupDeleted.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 
          
        

        // update groups
        vis.selectedGroups = vis.selectedGroups.filter(function(d) {
                  return d.color != color
                })

        vis.colorsGroups = [...vis.colorsGroups.concat([color])] // re-append color

       
         // expand if was aggregated 
        let nodeAggArr = groupDeleted.sort();
        let nodeAgg = groupDeleted.sort().join("+")
       
        if (vis.aggregatedSampleString.includes(nodeAgg)){

          let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

          vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
          d !== nodeAgg)

          vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
          ! nodeAggArr.includes(mRNA_id))


          vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
          ! nodeAggArr.includes(d))

          vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)
          
          vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
            mRNA_id !== nodeAgg)


            vis.currentSortAll = vis.rowSorterCurrentAll

            vis.drawHeatMap(vis.newSortwithAggregated)
            vis.drawPhenotypes(vis.newSortwithAggregated)
            vis.drawBipartite(vis.newSortwithAggregated)



        }
        
        this.$store.dispatch('setGroupsSelected', vis.selectedGroups)
        this.$store.dispatch('setGroupDelete', null) 

    }

   

    //// decolor group
    if (vis.groupToDecolor !== null){

      let group = vis.groupToDecolor //this.$store.getters.getGroupToDecolor

      
      let groupMembers = vis.selectedGroups.filter(function(d) {
                  return d.group == group
                })
        let color = d3.map(groupMembers, function (d) {
            return d.color
            })
        color = Array.from(new Set(color))[0]

        let groupDecolor = d3.map(groupMembers, function (d) {
            return d.mRNA_id
        })
        let groupString = groupDecolor.sort().join("+")

        d3.selectAll('.rowLabel')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno1')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.strain')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)
        
        d3.selectAll('.linksBp')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.nodesSource')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)


        d3.selectAll('.nodesTarget')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)


        d3.selectAll('.pheno0')
        .filter(function() {
                  return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno1Label')
        .filter(function() {
        return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0Label')
        .filter(function() {
        return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.pheno1LabelMissing')
        .filter(function() {
        return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0LabelMissing')
        .filter(function() {
        return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.cell')
        .filter(function() {
        return groupDecolor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        
        // aggregated rows
        d3.selectAll('.rowAggr')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id")// filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno1')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id")// filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.linksBp')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.nodesSource')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.nodesTarget')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno0')
        .filter(function() {
        return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
        }).classed('group-selection-'+color, false)

        d3.selectAll('.pheno1Label')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0Label')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.pheno1LabelMissing')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false)
        
        d3.selectAll('.pheno0LabelMissing')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, false) 

        d3.selectAll('.cell')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('row-selection-'+color, false) 

        //reset 
        this.$store.dispatch('setGroupDecolor', null) 

    }

    // recolor group 
    if (vis.groupToColor !== null){

      let group = vis.groupToColor //this.$store.getters.getGroupToDecolor

      let groupMembers = vis.selectedGroups.filter(function(d) {
                  return d.group == group
                })
        let color = d3.map(groupMembers, function (d) {
            return d.color
            })
        color = Array.from(new Set(color))[0]

        let groupColor = d3.map(groupMembers, function (d) {
            return d.mRNA_id
        })
        let groupString = groupColor.sort().join("+")


        d3.selectAll('.rowLabel')
        .filter(function() {
                  return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.pheno1')
        .filter(function() {
                  return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.pheno1Label')
        .filter(function() {
        return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true)
        
        d3.selectAll('.pheno0Label')
        .filter(function() {
        return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true) 

        d3.selectAll('.pheno1LabelMissing')
        .filter(function() {
        return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true)
        
        d3.selectAll('.pheno0LabelMissing')
        .filter(function() {
        return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true) 
        
        d3.selectAll('.linksBp')
        .filter(function() {
                  return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.nodesSource')
        .filter(function() {
                  return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)


        d3.selectAll('.nodesTarget')
        .filter(function() {
                  return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.pheno0')
        .filter(function() {
          return groupColor.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

     
        // aggregated rows
        d3.selectAll('.rowAggr')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id")// filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.pheno1')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id")// filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.strain')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)
        
        d3.selectAll('.linksBp')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.nodesSource')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)


        d3.selectAll('.nodesTarget')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

        d3.selectAll('.pheno0')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1Label')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true)
        
        d3.selectAll('.pheno0Label')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true) 

        d3.selectAll('.pheno1LabelMissing')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true)
        
        d3.selectAll('.pheno0LabelMissing')
        .filter(function() {
        return groupString.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
        }).classed('group-selection-'+color, true) 

       d3.selectAll('.cell')
        .filter(function() {
          return groupString == d3.select(this).attr("mRNA_id")// filter by single attribute
                }).classed('row-selection-'+color, true);

      
        // reset
        this.$store.dispatch('setGroupColor', null) 

      }

      // collapse group 
      if (vis.groupToCollapse !== null){

        let group = vis.groupToCollapse //this.$store.getters.getGroupToDecolor


        let groupMembers = vis.selectedGroups.filter(function(d) {
                    return d.group == group
                  })
          let color = d3.map(groupMembers, function (d) {
              return d.color
              })
          color = Array.from(new Set(color))[0]

          let groupCollapse = d3.map(groupMembers, function (d) {
              return d.mRNA_id
          })

          if (groupCollapse.includes(vis.visualRefSelected)){
              // set VR back to none
              vis.visualRefSelected = 'none'

          }

          let nodeAggArr = groupCollapse.sort();
          let nodeAgg = groupCollapse.sort().join("+")


          const checkAlreadyAggr = nodeAggArr.some(r=> vis.nodesAggArray.includes(r))

          if (checkAlreadyAggr){

              let groupDel;
              groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
              nodeAggArr.includes(mRNA_id))
              let indexDel = d3.map(groupDel, function (d) {
                return d['group']
              })

              indexDel = [... new Set(indexDel)][0]
              
              let nodeDel = vis.aggregatedSampleString[indexDel]

              let samplesDel = []
              let indecesDel = []

              for (let i=0; i< vis.aggregatedSampleString.length; i++){

                let arr = vis.aggregatedSampleString[i].split("+")

                const checkAlreadyAggr = nodeAggArr.some(r=> arr.includes(r))
                if (checkAlreadyAggr){
                  samplesDel.push(vis.aggregatedSampleString[i])
                  indecesDel.push(vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i]))
                }


              }

              for (let i=0; i<samplesDel.length; i++){

                let nodeDel = samplesDel[i]
                let childsDel = samplesDel[i].split("+")
                let indexDel = indecesDel[i]

                vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
                d !== nodeDel)

                vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
                ! childsDel.includes(mRNA_id))

                vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
                ! childsDel.includes(d))

                vis.aggrIndex = vis.aggrIndex.filter((d) => ! indecesDel.includes(vis.aggrIndex.indexOf(d)))


                vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
                          mRNA_id !== nodeDel)

              }



          }

          

          for (let i =0; i < nodeAggArr.length; i++){
            // let nr = vis.counter
            vis.aggregatedRows.push({'group': group, 'mRNA_id':nodeAggArr[i]})

          }

          if (vis.maxIndex == null){
            vis.maxIndex = vis.dataSequencesMaxIndex

          }


          let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let aggregatedChildsPhenos = []
          let ft10Sum = [];
          let ft10missing = [];
          let ft16Sum = [];
          let ft16missing= [];
          
          for (let i = 0; i < dataPhenosChilds.length; i++) {
              ft10Sum.push(parseFloat(dataPhenosChilds[i]['FT10']))
              ft16Sum.push(parseFloat(dataPhenosChilds[i]['FT16']))
              if (dataPhenosChilds[i]['FT10'] == '?'){
                ft10missing.push('?')
              }
              if (dataPhenosChilds[i]['FT16'] == '?'){
                ft16missing.push('?')
              }
          }


          aggregatedChildsPhenos.push(
              { 
                mRNA_id: nodeAgg,
                FT10: ft10missing.length < 0 ? d3.mean(ft10Sum) : [d3.mean(ft10Sum),ft10missing.length],
                FT16: ft16missing.length < 0 ? d3.mean(ft16Sum) : [d3.mean(ft16Sum),ft16missing.length],
                group: group,
              }
            )

          let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id))

          let groupedChilds = d3.groups(
            dataFilteredChilds,
            d => d.position,
            d => d.nucleotide,
            // d => d.informative,
            // d => d.pheno_specific,
            // d => d.variable

          )
          let aggregatedChilds = []
          
          groupedChilds.forEach(function(el) {

              vis.maxIndex += 1

              let idx = vis.maxIndex
              let pos = el[0]
              let nuc = el[1]
              if (nuc.length > 1) {
                let multi = [];
                for (let i = 0; i < nuc.length; i++) {
                  multi.push(nuc[i][0])

                }
                let upper = multi.map(element => {
                  return element.toUpperCase();
                });
                upper = Array.from(new Set(upper))
                nuc =upper.sort().join('|')

              }
              else{
                nuc = el[1][0][0]
              }
              let info = el[1][0][1]
              let infoSum = [];
              let phenoSum = [];
              let varSum = [];
                for (let i = 0; i < info.length; i++) {
                  infoSum.push(info[i]['informative'])
                  phenoSum.push(info[i]['pheno_specific'])
                  varSum.push(info[i]['variable'])

              }
          
              // add elements to new array
              aggregatedChilds.push(
                { 
                  index: String(idx),
                  position: pos,  
                  nucleotide: nuc,
                  mRNA_id: nodeAgg,
                  variable: [... new Set(varSum)].join("|"),
                  informative: [... new Set(infoSum)].join("|"),
                  pheno_specific: [... new Set(phenoSum)].join("|")
                }
              )
              
            }
          );

          let aggrIndeces = []

          for (let j = 0; j < nodeAggArr.length; j++) {
            aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
          } 

          vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
          vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
          vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
          vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]

          vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

          vis.currentSortAll = vis.rowSorterCurrentAll

          // vis.drawView()
          vis.drawBipartite(vis.newSortwithAggregated)
          vis.drawHeatMap(vis.newSortwithAggregated)
          vis.drawPhenotypes(vis.newSortwithAggregated)


          // give color to highlight change
          d3.selectAll('.rowLabel')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
                d3.selectAll('.pheno1')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesSource')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesTarget')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.linksBp')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.cell')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)


                // aggregated rows
                d3.selectAll('.rowAggr')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id")// filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno1Label')
                .filter(function() {
                return nodeAgg.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0Label')
                .filter(function() {
                return nodeAgg.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1LabelMissing')
                .filter(function() {
                return nodeAgg.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0LabelMissing')
                .filter(function() {
                return nodeAgg.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 
                
                d3.selectAll('.linksBp')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.nodesSource')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)


                d3.selectAll('.nodesTarget')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                        }).classed('group-selection-'+color, true)

                d3.selectAll('.pheno0')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.cell')
                .filter(function() {
                  return nodeAgg == d3.select(this).attr("mRNA_id") // filter by single attribute
                }).classed('group-selection-'+color, true)

                let dataPrevious  = _.cloneDeep(this.$store.getters.getGroupsSelected)

                //update value in dict

                for (let i=0; i< dataPrevious.length; i++){
                if (dataPrevious[i]['group'] == group){
                dataPrevious[i]['checkedColor'] = true

                }
              }
              this.$store.dispatch('setGroupsSelected', dataPrevious)

          //reset 
          this.$store.dispatch('setGroupCollapse', null) 
         

        }

        // expand group 
        if (vis.groupToExpand !== null){

            let group = vis.groupToExpand //this.$store.getters.getGroupToDecolor

            let groupMembers = vis.selectedGroups.filter(function(d) {
                        return d.group == group
                      })
              let color = d3.map(groupMembers, function (d) {
                  return d.color
                  })
              color = Array.from(new Set(color))[0]

              let checkColor = d3.map(groupMembers, function (d) {
                  return d.checkedColor
                  })
              checkColor = Array.from(new Set(checkColor))[0]

              let groupExpand = d3.map(groupMembers, function (d) {
                  return d.mRNA_id
              })

              if (groupExpand.includes(vis.visualRefSelected)){
                    // set VR back to none
                    vis.visualRefSelected = 'none'

                }
            

              let nodeAggArr = groupExpand.sort();
              let nodeAgg = groupExpand.sort().join("+")

              if (vis.aggregatedSampleString.includes(nodeAgg)){

                let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

                vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
                d !== nodeAgg)

                vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
                ! nodeAggArr.includes(mRNA_id))


                vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
                ! nodeAggArr.includes(d))

                vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)
                
                vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
                  mRNA_id !== nodeAgg)

                  vis.currentSortAll = vis.rowSorterCurrentAll

                  vis.drawHeatMap(vis.newSortwithAggregated)
                  vis.drawPhenotypes(vis.newSortwithAggregated)
                  vis.drawBipartite(vis.newSortwithAggregated)



              }

              // give color to highlight change
                d3.selectAll('.rowLabel')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
                d3.selectAll('.pheno1')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0Label')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.pheno1LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)
               
                d3.selectAll('.pheno0LabelMissing')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesSource')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.nodesTarget')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true) 

                d3.selectAll('.linksBp')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)

                d3.selectAll('.cell')
                .filter(function() {
                return nodeAggArr.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
                }).classed('group-selection-'+color, true)


                let dataPrevious  = _.cloneDeep(this.$store.getters.getGroupsSelected)

                //update value in dict
                for (let i=0; i< dataPrevious.length; i++){
                if (dataPrevious[i]['group'] == group){
                dataPrevious[i]['checkedColor'] = true

                }
              }
              this.$store.dispatch('setGroupsSelected', dataPrevious)

            //reset 
            this.$store.dispatch('setGroupExpand', null) 

        }


    if (vis.bool_collapsed){
      vis.dendroWidth = vis.newDendroWith
      vis.bipartiteWidth = vis.newBipartiteWidth
      vis.bipartiteWidthTotal = vis.newBipartiteWidthTotal

    }
    else{

   
      vis.newDendroWith = document.getElementById('dendro').offsetWidth * 0.93
      vis.newBipartiteWidth =  document.getElementById('bipartite').offsetWidth * 0.95
      vis.newBipartiteWidthTotal =  document.getElementById('bipartite').offsetWidth * 0.93
      vis.dendroWidth = vis.initialDendroWith
      vis.bipartiteWidth = vis.initialBipartiteWidth
      vis.bipartiteWidthTotal = vis.initialBipartiteWidthTotal

    }
    

    vis.drawView()



  },
}
</script>

<style>

.ant-btn .anticon.anticon-plus > svg {
    color: #ff4d4f;
}

.ant-btn .anticon > svg {
    margin-bottom: 6px !important;
    color: #1890ff;
}


.ant-btn-icon-only.ant-btn-sm > * {
    font-size: 10px !important;
}

.ant-btn-icon-only {
  width: 17px !important;
  height: 17px !important;
  font-size: 8px !important;
  border-radius: 0.25rem !important;

}

.rowBrush .selection {
  stroke: white;
  fill: #ff4d4f;
  /* fill: #ff6251; */
  fill-opacity: 0.0;
}

.phenoBrush .selection {
  stroke: white;
  fill: #ff4d4f;
  /* fill: #ff6251; */
  fill-opacity: 0.0;
}

circle.border{
  stroke: black;
}

text.text-hover {

  fill: black;
  font-weight: bold;
}

text.text-normal {
  fill: darkgrey;
}


text.text-similar-highlight{

fill: black !important;
font-weight: bold;

}

text.text-selection {

  fill: #ff6251 !important;
  font-weight: bold;
}

text.text-ref {

  font-weight: bold;
  font-style: italic;
}


text.text-highlight {
  fill: #1890ff !important;
  font-weight: bold;
}

text.text-selected{
  fill: #1890ff;
  font-weight: bold;
}

circle.node-selection {
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

circle.pheno-node-selection {
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

path.link-selection {
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

path.link-highlight {
  stroke: #1890ff !important;
  z-index: 2;
  stroke-width: 0.5px;
}

path.link-hover {
  stroke: #1890ff;
  stroke-width: 2px;
}

circle.node-highlight {
  stroke: #1890ff;
}

rect.cell-border {
  stroke: white;
  stroke-width: 0.25px;
  paint-order: fill;
  shape-rendering: crisp-edges;
}

rect.cell-selection {
  stroke: #ff6251 !important;
  stroke-dasharray: 10,9,10,9;
  stroke-width: 0.2;
  stroke-linecap: square;
}

rect.cell-highlight {
  stroke: #1890ff;
  stroke-width: 0.5px;
  stroke-dasharray: 10,9,10,9;
  stroke-linecap: square;
  
}

rect.cell-hover {
  stroke: yellow;
  stroke-width: 0.5px;

}

rect.aggr-selection {
  stroke: #ff6251 !important;
  stroke-width: 0.8px;

}

rect.aggr-highlight {
  stroke: #1890ff;
  stroke-width: 0.5px;

}

rect.cell-highlight-col {
  stroke: #1890ff;
  stroke-dasharray: 0, 9, 10, 9, 10;
  stroke-width: 0.5px;
}

.rowLabel {
  font-size: 9px;
}

.colLabel {
  font-size: 8px;
}


/* The Modal (background) */
#popOverBg {
  position: fixed; /* Stay in place */
  z-index: 3; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

#popOverBg.hidden {
  display: none;
}

#popOverGroup {
  position: absolute;
  width: 40%;
  margin-left: 30%;
  margin-top: 10%;
  height: auto;
  padding: 10px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 1);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
}
#popOverGroup.hidden {
  display: none;
}
/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

#tooltip-mrnas {
  position: absolute;
  width: 250px;
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8) !important;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  /* pointer-events: none; */
}

#tooltip-mrnas.hidden {
  display: none;
}

#tooltip-mrnas p {
  margin: 0;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 20px;
}

#tooltip {
  position: absolute;
  width: 250px;
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8) !important;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  /* pointer-events: none; */
}

#tooltip.hidden {
  display: none;
}

#tooltip p {
  margin: 0;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 20px;
}

#tooltip-phenos {
  position: absolute;
  width: 250px;
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.9) !important;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  /* pointer-events: none; */
}

#tooltip-phenos.hidden {
  display: none;
}

#tooltip-phenos p {
  margin: 0;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 20px;
}

#heatmapRow {
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
}

#heatmapCol {
  height: 100px;
  width: 100%;
}

.emptyDiv {
  height: 100px;
  width: 100%;

}

#heatmapEmpty {
  height: 100px;
  width: 100%;

}

#dendroEmpty {
  height: 100px;
  width: 100%;
}

#dendro {
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
}

#bipartite {
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
}

#phenotypes {
  width: 100%;
}

.rnode {
  font-size: 8px;
  font-family: sans-serif;
  fill: #2c3e50;
}

.container {
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
}

.leftContainer {
  float: left; 
  scrollbar-width: none; /*to hide scrollbars in FireFox */
  -ms-overflow-style: none; /*to hide scrollbars in Edge, IE */
}

.variantView {
  height: 800px;
}

.form-select-sm {

  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 6px;

}

.iconsDiv {

  margin-right: 10px;

}

.iconsSelect {

  display: inline;

}



.hide-bp {

  position: relative;
  flex: 0 0 8.33333333%;
  max-width: 0%;
  transition: max-width 0.8s, ease;

}

.show-bp {

  position: relative;
  flex: 0 0 8.33333333%;
  max-width: 8.33333333%; 
  transition:  max-width 0.8s ease;

}

#phenosLabel0G {

  cursor: pointer

}

#phenosLabel1G {

  cursor: pointer

}

#strainlabelG {

cursor: pointer

}

.colLabel{

  cursor: pointer

}

.nodeDendro{

  cursor: pointer
  
}

.rowLabel {

  cursor: crosshair
}

.rowAggr {

  cursor: crosshair

}

.pheno1 {

cursor: crosshair

}

.pheno1Label {

cursor: crosshair

}

.pheno1LabelMissing {

cursor: crosshair

}


.pheno0 {

cursor: crosshair

}

.pheno0Label {

cursor: crosshair;

}

.pheno0LabelMissing {

cursor: crosshair

}

.overlay{
  visibility: hidden;
  cursor: crosshair;
}

.form-check-label{
  font-size: 10px;
}

</style>
