<template>
  <div class="card" id="heatmap-view" style="width: 100%">
    <div class="card-header" style="padding: 0 1em">
      {{ title }}
    </div>
    <a-row>
      <a-col :span="3">
        <div
          class="container leftContainer emptyDiv"
          style="padding-right: 0px"
        >
          <div class="iconsSelect" style="float: left">
            <div class="iconsDiv" style="float: left">
              <BgColorsOutlined />
            </div>
            <div style="width: calc(100% - 30px); float: left">
              <select
                id="cellColors"
                v-model="cellColors"
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
              >
                <option value="no-choice" selected disabled>
                  Color cells by
                </option>
                <option value="default">Default</option>
                <option value="clustal">Clustal</option>
                <option value="cg-at">CG vs AT</option>
                <option value="pur-pyr">Purine vs Pyrimidine</option>
              </select>
            </div>
          </div>
          <div class="iconsSelect" style="float: left">
            <div class="iconsDiv" style="float: left">
              <!-- <FilterOutlined /> -->
              <ColumnWidthOutlined />
            </div>
            <div style="width: calc(100% - 30px); float: left">
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
                <option value="pheno-spec">Phenotype Specific</option>
              </select>
            </div>
            <!-- <div style="width: 35%; display: inline-block; float:left">
                <select
                  id="rowFilter"
                  v-model="rowFilter"
                  class="form-select form-select-sm select-style-small"
                  aria-label=".form-select-sm example"
                >
                  <option selected disabled>Filter Rows by</option>
                  <option value="all">All</option>
                  <option value="subset">Subset</option>
                </select>
              </div> -->
          </div>
          <div class="iconsSelect" style="float: left">
            <div class="iconsDiv" style="float: left">
              <SortAscendingOutlined />
            </div>
            <div style="width: calc(100% - 30px); display: inline-block">
              <select
                id="rowSorting"
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
              >
                <option value="no-choice" disabled>Sort Accessions by</option>
                <option value="initial">Initial</option>
                <option value="dendro-default" selected>
                  Dendrogram Default
                </option>
                <option value="dendro-custom">Dendrogram Custom</option>
                <option value="position" disabled>
                  Nucleotide (single position)
                </option>
                <option value="virulence">Virulence</option>
                <option value="species">Species</option>
              </select>
            </div>
            <!-- <div style="float: right; margin-top: 5px">
              <a-tooltip>
                <template #title>(un)link dendrogram tree</template>
                <a-button
                  shape="circle"
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
            </div> -->
          </div>
        </div>

        <div id="dendro" class="container leftContainer variantView">
          <svg id="dendroSvg" width="100%" :height="chartHeightMax">
            <g id="dendroview" :transform="dendroHeight"></g>
          </svg>
        </div>
      </a-col>
      <div id="bipartiteCol" :class="bipartiteClass">
        <div class="container leftContainer emptyDiv"></div>
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
                    <!-- <PartitionOutlined /> -->
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
          <!-- <div style="margin-top: 6px; float: right">
            <a-tooltip>
              <template #title>collapse</template>
              <a-button 
                danger
                shape="circle"
                size="small"
                @click="toggleGroupCollapse"
                
              >
                <template #icon>
                  <div>
                    <VerticalAlignMiddleOutlined />
                  </div>
                </template>
              </a-button>
            </a-tooltip>
          </div> -->

       
          <div class='iconsSelect' style="width: 100%; float:left; margin-top: 0px"> 

             <div style="float:left;">
        
              <input id="core-snp-checkbox" @change="toggleLinkCoreSNP" :disabled="toggleButton == true" v-model="showCoreSNP" class="form-check-input check-core-snp" type="checkbox" value="" style="width: 17px; height: 17px; margin-top: 5px; margin-right: 5px; background: transparent; border-radius: 0.25rem;" >

              <label class="form-check-label" for="core-snp-checkbox">
              core SNP
              </label>
            </div> 

            <!-- <div style="float:right;">
              <a-button
              danger
              shape="round"
              size="small"
              @click="toggleGroupCollapse"
              >
              collapse
              </a-button>

                        <input v-model="item.checkedColor" class="form-check-input check-color" type="checkbox" @change="colorGroup(item.group)" value="checked" :id="'color'+item.group+''" style="margin-left: 5px; margin-top: 5px;" >

            
            </div> -->
          
           
      

          </div>

          <div class="iconsSelect" style="float:left">
            <div class="iconsDiv" style="float:left; margin-right: 5px">
              <a-tooltip>
                <template #title>set visual reference</template> 
              <!-- <TagOutlined /> -->
             <span style="font-size: 10px; font-weight: 500; vertical-align: bottom"> REF</span>
            </a-tooltip>
            </div>
          <div class='iconsSelect' style="width: calc(100% - 30px); float:left; ">
           
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
      <div class="ant-col ant-col-13" :style="heatmapStyle" id="heatmap-cells">
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
              :transform="'translate(' + 2 + ',' + 15 + ')'"
            ></g>

            <g
              id="heatmapviewCol"
              :transform="'translate(' + 0 + ',' + 72 + ')'"
            ></g>
            <g
              id="heatmapviewVisRef"
              :transform="'translate(' + 2 + ',' + 30 + ')'"
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
      </div>
      <a-col :span="5" width="120%">
        <div class="container leftContainer emptyDiv">
          <div id="virulence" style="width: 100%; float: left">
            <svg id="phenosLabels" width="100%" height="80px">
              <g
                id="virulencelabelG"
                :transform="'translate(' + 0 + ',' + 70 + ')'"
              ></g>
              <g
                id="specieslabelG"
                :transform="'translate(' + 20 + ',' + 70 + ')'"
              ></g>
              <g
                id="strainlabelG"
                :transform="'translate(' + 92 + ',' + 70 + ')'"
              ></g>
            </svg>
          </div>
        </div>
        <div id="phenotypes" class="container leftContainer variantView">
          <svg id="phenotypesSvg" width="150%" :height="chartHeightMax">
            <g id="brushview" :transform="'translate(' + 5 + ',' + 1 + ')'"></g>
            <g
              id="virulenceview"
              :transform="'translate(' + 5 + ',' + 1 + ')'"
            ></g>
            <g
              id="speciesview"
              :transform="'translate(' + 20 + ',' + 1 + ')'"
            ></g>
            <g
              id="strainview"
              :transform="'translate(' + 110 + ',' + 1 + ')'"
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
    <div id="popOverBg" class="hidden"></div>
    <div id="popOverGroup" class="hidden">
      <h6>
        Create New Group <span class="close" id="popMenuClose">&times;</span>
      </h6>
      <form class="row no-gutters">
        <div class="col-auto">
          <div class="row mb-3">
            <label for="group_name" class="col-sm-5 col-form-label"
              >Enter name:</label
            >
            <div class="col-sm">
              <input
                id="group_name"
                class="form-control form-control-sm"
                type="text"
                placeholder="Test"
              />
            </div>
          </div>

          <!-- <input id="group_name" type="text" placeholder="test"> -->
        </div>
        <div class="col-auto">
          <button type="button" class="btn btn-outline-secondary btn-sm">
            Create
          </button>
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
  // PartitionOutlined,
  // FilterOutlined,
  SortAscendingOutlined,
  BgColorsOutlined,
  LinkOutlined,
  ColumnWidthOutlined,
  PlusOutlined,
  SwapOutlined
  // VerticalAlignMiddleOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'Heatmap',
  components: {
    // Axis,
    checkboxGroup,
    // PartitionOutlined,
    // FilterOutlined,
    SortAscendingOutlined,
    BgColorsOutlined,
    LinkOutlined,
    ColumnWidthOutlined,
    PlusOutlined,
    SwapOutlined
    // VerticalAlignMiddleOutlined
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
      cellColors: 'default',
      dendroWidth: null,
      colFilter: 'all',
      colSortOrder: false,
      rowFilter: 'all',
      rowSort: 'dendro-default',
      rowSortSteps: ['dendro-default'],
      resetSort: false,
      currentSort: null,
      currentSortAll: null,
      // positionSort: [],
      // virulenceSort: [],
      // speciesSort: [],
      // dendroCustomSort: [],
      buttonType: 'primary',
      toggleButton: true,
      dendroCustom: {},
      linkedDendro: 'dendro-default',
      // sortingOptions: ['dendro-default','dendro-custom','virulence', 'species','position', 'initial'],
      metadataAttributes: ['virulence', 'species', 'strain_name'],
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
      visualRefSelected: 'none', //'OJKMMJND_02015_mRNA'
      boolGroups: false,
      selectionGroups: [],
      altSelection: [],
      selectionLst: [],
      levelCollapse: 12, //!! careful not to choose to high --> error
      boolSorted: {
        position: true,
        phenos: true,
      },
      currentSortRow: null,
      showCoreSNP: false,
      // colorsGroups: ['ForestGreen', 'DarkTurquoise', 'SteelBlue', 'DarkViolet', 'HotPink'], // update this list
      colorsGroups: [
        'Aqua',
        'Aquamarine',
        'Bisque',
        'BlueViolet',
        'BurlyWood',
        'CadetBlue',
        'Chartreuse',
        'Chocolate',
        'Coral',
        'CornflowerBlue',
        'Crimson',
        'DarkCyan',
        'DarkGoldenRod',
        'DarkGreen',
        'DarkKhaki',
        'DarkMagenta',
        'DarkOliveGreen',
        'DarkOrange',
        'DarkOrchid',
        'DarkRed',
        'DarkSalmon',
        'DarkSeaGreen',
        'DarkSlateBlue',
        'DarkSlateGray',
        'DarkTurquoise',
        'DarkViolet',
        'DeepPink',
        'DeepSkyBlue',
        'DodgerBlue',
        'FireBrick',
        'ForestGreen',
        'Fuchsia',
        'Gold',
        'GoldenRod',
        'Green',
        'GreenYellow',
        'HotPink',
        'IndianRed',
        'Indigo',
        'Khaki',
        'Lavender',
        'LavenderBlush',
        'LawnGreen',
        'LemonChiffon',
        'LightBlue',
        'LightCoral',
        'LightCyan',
        'LightGoldenRodYellow',
        'LightGreen',
        'LightPink',
        'LightSalmon',
        'LightSeaGreen',
        'LightSkyBlue',
        'LightSlateGray',
        'LightSteelBlue',
        'Lime',
        'LimeGreen',
        'Linen',
        'Magenta',
        'Maroon',
        'MediumAquaMarine',
        'MediumBlue',
        'MediumOrchid',
        'MediumPurple',
        'MediumSeaGreen',
        'MediumSlateBlue',
        'MediumSpringGreen',
        'MediumTurquoise',
        'MediumVioletRed',
        'MidnightBlue',
        'MistyRose',
        'Moccasin',
        'Navy',
        'Olive',
        'OliveDrab',
        'Orange',
        'OrangeRed',
        'Orchid',
        'PaleGoldenRod',
        'PaleGreen',
        'PaleTurquoise',
        'PaleVioletRed',
        'PapayaWhip',
        'PeachPuff',
        'Peru',
        'Pink',
        'Plum',
        'PowderBlue',
        'Purple',
        'RebeccaPurple',
        'Red',
        'RosyBrown',
        'RoyalBlue',
        'SaddleBrown',
        'Salmon',
        'SandyBrown',
        'SeaGreen',
        'Sienna',
        'SkyBlue',
        'SlateBlue',
        'SlateGray',
        'SpringGreen',
        'SteelBlue',
        'Tan',
        'Teal',
        'Thistle',
        'Tomato',
        'Turquoise',
        'Violet',
        'Wheat',
        'Yellow',
        'YellowGreen',
      ],
    }
  },
  computed: {
    getCoreSNP() {
      let tree = this.core_snp
      console.log('tree', tree)

      function parseNewick(a) {
        for (
          var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0;
          t < s.length;
          t++
        ) {
          var n = s[t]
          switch (n) {
            case '(':
              var c = {}
              ;(r.children = [c]), e.push(r), (r = c)
              break
            case ',':
              var d = {}
              e[e.length - 1].children.push(d), (r = d)
              break
            case ')':
              r = e.pop()
              break
            case ':':
              break
            default:
              var h = s[t - 1]
              // append t to r.name in line below to deal with internal nodes of tree
              // with duplicate names. strip t from name before displaying in code below.
              ')' == h || '(' == h || ',' == h
                ? (r.name = n + '+' + t)
                : ':' == h && (r.length = parseFloat(n))
          }
        }
        return r
      }

      let data = parseNewick(tree)
      console.log('data tree parsed', data)

      return data
    },
    getCoreSNPLeafs() {
      let dataDendro = this.getCoreSNP

      //  assigns the data to a hierarchy using parent-child relationships
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })

      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        // //// console.log(e.data.name);
        leafNames.push(e.data.name)
      })

      let leafNamesClean = []
      let mrnas = this.phenosNamesAll
      console.log('phenosNames', mrnas)

      console.log('leafNames core snp', leafNames)
      for (let i = 0; i < leafNames.length; i++) {
        let leaf = leafNames[i].split('+')[0]
        // let mrna_name = mrnas.filter(d => d.split('_')[0] == leaf)[0]
        leafNamesClean.push(leaf)
      }
      return leafNamesClean
    },
    groupToCollapse() {
      let data = this.group_collapse
      console.log('hi from groupToCollapse')

      return data
    },
    groupToExpand() {
      let data = this.group_expand
      console.log('hi from groupToExpand')

      return data
    },
    groupToDelete() {
      let data = this.group_delete
      console.log('hi from groupToDelete')

      return data
    },
    groupToDecolor() {
      let data = this.group_decolor
      console.log('hi from groupToDecolor')

      return data
    },
    groupToColor() {
      let data = this.group_color
      console.log('hi from groupToColor')

      return data
    },
    bipartiteClass() {
      if (
        this.rowSort == 'dendro-custom' &&
        this.toggleButton == true &&
        this.aggregatedRows.length == 0
      ) {
        return 'hide-bp'
      } else {
        return 'show-bp'
      }
    },
    disableDendroCalc() {
      let disableDendroCalc = true
      let selected = this.$store.getters.selectedPositions
      // //// console.log('selected positions from computed prop', selected)
      if (selected.length == 0) {
        //// console.log('empty checkboxes')
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
      let mRNA_arr = [
        'OHGOGCPB_00390_mRNA',
        'GPNGIIIH_02659_mRNA',
        'HPCCBOLC_00315_mRNA',
        'NEMGJIOM_02934_mRNA',
        'JABGGEHE_02935_mRNA',
        'HMLEEMND_02189_mRNA',
        'JFCHIFII_02929_mRNA',
        'EGNJAKAP_01922_mRNA',
      ]

      return mRNA_arr
    },
    dataPhenos() {
      let data = this.data_phenos

      for (let i = 0; i < data.length; i++) {
        data[i]['group'] = null
      }

      if (this.aggregatedRows.length !== 0) {
        // console.log('>>>> add group nrs to store!!', this.aggregatedRows)
        this.$store.dispatch('setGroups', this.aggregatedRows)

        let mrnaArr = d3.map(data, function (d) {
          return d.mRNA_id
        })

        for (let i = 0; i < this.aggregatedRows.length; i++) {
          let idx = mrnaArr.indexOf(this.aggregatedRows[i]['mRNA_id'])
          data[idx]['group'] = this.aggregatedRows[i]['group']
        }
      }

      console.log('data phenos + groups', data)
      // debugger

      return data
    },
    dataSequences() {
      // console.log('rowSort from dataSequences', this.rowSort)
      // console.log('dataSequences', this.data_heatmap)

      return this.data_heatmap
    },
    dataPhenosFiltered() {
      let dataPheno = this.dataPhenos
      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let data_aggr_phenos = this.aggregatedPhenos
      // console.log('aggregatedPhenos', data_aggr_phenos)
      // console.log('nodesAggArray', this.nodesAggArray)

      let showRows = this.rowFilter

      let dataPhenos = dataPheno.filter(function (d) {
        if (showRows == 'all') {
          return d
        }
      })

      if (showRows == 'subset') {
        dataPhenos = dataPheno.filter(({ mRNA_id }) =>
          mRNA_arr.includes(mRNA_id)
        )
      }

      let dataPhenotypes = dataPhenos

      // delete aggregated
      if (data_aggr.length !== 0) {
        let dataPhenotypesDel = dataPhenos.filter(
          ({ mRNA_id }) => !this.nodesAggArray.includes(mRNA_id)
        )

        dataPhenotypes = dataPhenotypesDel.concat(data_aggr_phenos)
      }
      // console.log('[update] dataPhenosFiltered', dataPhenotypes)

      return dataPhenotypes
    },
    currentSortingOrder() {
      let sortingOrder
      if (this.currentSort == null) {
        sortingOrder = this.dendroLeaves
      } else {
        sortingOrder = this.currentSort
      }
      // this.$store.dispatch('setCurrentSortingOrderRows', sortingOrder) // update store
      return sortingOrder
    },
    currentSortingOrderAll() {
      let sortingOrder
      if (this.currentSortAll == null) {
        sortingOrder = this.dendroLeavesAll
      } else {
        sortingOrder = this.currentSortAll
      }

      //// console.log('!!! currentSortingOrderAll', sortingOrder)
      this.$store.dispatch('setCurrentSortingOrderRows', sortingOrder)
      return sortingOrder
    },
    dataPhenosFilteredSortedCurrent() {
      //// console.log('rowSort', this.rowSort)

      // let sortingOrder = this.currentSortingOrder //this.currentSortingOrder moved down
      let sortingOrder = this.currentSortingOrderAll
      // let aggregatedRow = this.aggregatedChilds
      // console.log('aggregated rows', this.aggregatedPhenos, 'this.aggregatedSampleString', this.aggregatedSampleString, 'this.aggrIndex', this.aggrIndex)
      //// console.log('aggregated data', aggregatedRow)

      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let aggr_idx = this.aggrIndex
      let phenos_by_current_order = []

      if (data_aggr.length !== 0) {
        console.log('sorting order current', sortingOrder)
        console.log('nodesAggArray', this.nodesAggArray)

        sortingOrder = sortingOrder.filter(
          (d) => !this.nodesAggArray.includes(d)
        )

        console.log('filter out aggregated samples', sortingOrder)

        console.log('aggr_idx', aggr_idx)

        for (let i = 0; i < aggr_idx.length; i++) {
          // console.log('this.aggrIndex', this.aggrIndex[i])
          let idx = this.aggrIndex[i]

          // if (i > 0){

          //   if (this.aggrIndex[i-1] < this.aggrIndex[i]){
          //     idx += 1
          //   }

          // //   let j = this.aggregatedSampleString[i-1].split("-").length
          // //   // console.log('j', j)

          // }

          sortingOrder.splice(idx, 0, this.aggregatedSampleString[i])
        }

        // sortingOrder.splice(this.aggrIndex[0], 0, this.aggregatedSampleString[0])

        //   // sortingOrder = [...sortingOrder.splice(this.aggrIndex[i], 0, this.aggregatedSampleString[i])]
        //   let data = _.cloneDeep(sortingOrder);

        //   // console.log('this.aggrIndex', this.aggrIndex[i], data.splice(this.aggrIndex[i], 0, this.aggregatedSampleString[i]))

        // }

        //// console.log('samples with aggregated', sortingOrder)

        sortingOrder = [...new Set(sortingOrder)]

        console.log('samples with aggregated WO DUPLICATES', sortingOrder)
      }

      if (this.rowFilter == 'all' && data_aggr.length == 0) {
        sortingOrder = this.currentSortingOrderAll
      }

      if (this.rowFilter == 'subset') {
        sortingOrder = sortingOrder.filter((d) => mRNA_arr.includes(d)) //???
      }

      for (let i = 0; i < this.phenosNames.length; i++) {
        //dendro is current sorting
        // let idx = this.phenosNames.indexOf(this.dendroLeaves[i])
        // //// console.log('this.currentSortingOrder[i]', sortingOrder[i])
        let idx = this.phenosNames.indexOf(sortingOrder[i])
        // //// console.log('idx', idx, sortingOrder[i])
        phenos_by_current_order.push(this.dataPhenosFiltered[idx])
      }
      // console.log('[update] dataPhenosFilteredSortedCurrent', phenos_by_current_order)

      return phenos_by_current_order
    },
    dataPhenosSortedCurrent() {
      let phenos_by_current_order = []
      // console.log('this.currentSortingOrderAll', this.currentSortingOrderAll)
      // console.log('rowSort', this.rowSort)
      // // debugger

      for (let i = 0; i < this.phenosNamesAll.length; i++) {
        //dendro is current sorting
        // let idx = this.phenosNames.indexOf(this.dendroLeaves[i])
        // //// console.log('this.currentSortingOrder[i]', this.currentSortingOrderAll[i])
        let idx = this.phenosNamesAll.indexOf(this.currentSortingOrderAll[i])

        phenos_by_current_order.push(this.data_phenos[idx])
      }
      // console.log('phenosNamesAll', this.phenosNamesAll)
      // console.log('this.currentSortingOrderAll', this.currentSortingOrderAll)
      // console.log('rowSorterCurrentAll', this.rowSorterCurrentAll)
      // console.log('current sort all',this.currentSortAll)
      // console.log('this.data_phenos', this.data_phenos)
      // console.log('dataPhenosFilteredCurrent', phenos_by_current_order)

      return phenos_by_current_order
    },
    metadataCurrentOrderIdx() {
      let data = this.dataPhenosSortedCurrent

      // console.log('dataPhenosSortedCurrent', data)

      // // debugger

      let values_idx = []

      for (let i = 0; i < data.length; i++) {
        let row = {
          idx: i,
          virulence: data[i].virulence,
          species: data[i].species,
          strain_name: data[i].strain_name,
          mRNA_id: data[i].mRNA_id,
          group: data[i].group,
        }
        // // console.log(row)

        values_idx.push(row)
      }
      // console.log('metadataCurrentOrderIdx', values_idx)

      return values_idx
    },
    metadataFilteredCurrentOrderIdx() {
      let data = this.dataPhenosFilteredSortedCurrent
      // // console.log('data:', data)

      let values_idx = []

      for (let i = 0; i < data.length; i++) {
        // // console.log(this.dataPhenosFilteredSortedCurrent[i])

        let row = {
          idx: i,
          virulence: data[i].virulence,
          species: data[i].species,
          mRNA_id: data[i].mRNA_id,
          group: data[i].group,
        }

        values_idx.push(row)
      }
      // console.log('[update] metadataFilteredCurrentOrderIdx', values_idx)

      return values_idx
    },
    // rowSorterCurrent() {

    // //// console.log('...updating current rowsorter...')
    // let data = this.metadataFilteredCurrentOrderIdx
    // // console.log('data previous order: ', this.metadataFilteredCurrentOrderIdx)
    // // console.log('ALL data previous order: ', this.metadataCurrentOrderIdx)
    // // debugger
    // let rowSorting = this.getRowSorting(data, this.rowSort, 'median')

    // //// console.log('rowSorterCurrent',rowSorting)
    // //// console.log('current sort vis', this.currentSort)
    // //// debugger

    // return rowSorting

    // },
    rowSorterCurrentAll() {
      //// console.log('...updating current rowsorter ALL DATA ...')
      let data = this.metadataCurrentOrderIdx
      let rowSorting
      if (this.rowSort == 'strain_name') {
        rowSorting = this.getRowSorting2(data, this.rowSort, 'mean')
      } else {
        rowSorting = this.getRowSorting2(data, this.rowSort, 'median')
      }

      //// console.log('rowSorterCurrent',rowSorting)

      return rowSorting
    },
    newSortwithAggregated() {
      // let dataMeta = this.dataPhenosFilteredSortedCurrent
      // // console.log('dataMeta from virulence', dataMeta)
      // console.log('sorting order all', this.currentSortingOrderAll)
      // console.log('aggregatedRow', this.aggregatedRows)

      let dataByGroup = d3.group(this.aggregatedRows, (d) => d.group)
      // // console.log('data by group', dataByGroup, dataByGroup.get(0), dataByGroup.get(1))
      let keysGroups = [...dataByGroup.keys()]
      // // console.log('data by group keys', keysGroups)
      let tmpSortingArr = _.cloneDeep(this.currentSortingOrderAll)

      for (let i = 0; i < keysGroups.length; i++) {
        let groupedIdxArr = []
        let groupKey = keysGroups[i]
        let groupValues = d3.map(dataByGroup.get(groupKey), function (d) {
          return d['mRNA_id']
        })
        for (let i = 0; i < groupValues.length; i++) {
          groupedIdxArr.push(tmpSortingArr.indexOf(groupValues[i]))
        }
        // console.log(groupKey, groupValues, groupedIdxArr, d3.min(groupedIdxArr))
        // // console.log('make string', [...groupValues].sort().join('-'))
        tmpSortingArr = tmpSortingArr.filter((d) => !groupValues.includes(d))

        tmpSortingArr.splice(
          d3.min(groupedIdxArr),
          0,
          [...groupValues].sort().join('-')
        )
        // console.log('tmpSortingArr', tmpSortingArr)
      }
      this.$store.dispatch('setCurrentSortingOrderWithAggr', tmpSortingArr)

      // // console.log('#### AFTER AGGR sorting order all', this.currentSortingOrderAll)
      // // debugger
      return tmpSortingArr
    },
    metadataDictCat() {
      let data = this.data_phenos

      let metadata_dict = {}

      for (let i = 0; i < this.metadataAttributes.length; i++) {
        let attr = this.metadataAttributes[i]
        let cat = this.getCategories(data, attr)

        metadata_dict[attr] = cat
      }
      // console.log('metadataDictCat', metadata_dict )

      return metadata_dict
    },
    dataSequencesMaxIndex() {
      return this.dataSequences.length
    },
    dataSequencesFiltered() {
      let dataHeatmap = this.data_heatmap //this.dataFilterRows
      let mRNA_arr = this.subsetTest
      let aggregatedChilds = this.aggregatedChilds

      let showRows = this.rowFilter
      //// console.log('data mode rows', showRows)

      let region = this.data_region
      //// console.log('region from dataFilter', region)
      let lowEnd = Number(region.split('-')[0])
      let highEnd = Number(region.split('-')[1])
      function range(start, end) {
        return Array(end - start + 1)
          .fill()
          .map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd)
      //// console.log('region array', regionArray);

      let dataHeatM = dataHeatmap.filter(({ position }) =>
        regionArray.includes(Number(position))
      )

      let dataHeat = dataHeatM.filter(function (d) {
        if (showRows == 'all') {
          return d
        }
      })

      if (showRows == 'subset') {
        dataHeat = dataHeatM.filter(({ mRNA_id }) => mRNA_arr.includes(mRNA_id))

        //// console.log('> filter data heatmap', dataHeat)
      }

      // add aggregated row
      // hier was ik!!!
      if (aggregatedChilds.length !== 0) {
        // console.log('aggregatedChilds', aggregatedChilds)

        let aggregatedChildsRegion = aggregatedChilds.filter(({ position }) =>
          regionArray.includes(Number(position))
        )

        dataHeat = dataHeatM.concat(aggregatedChildsRegion)
        //// console.log('data filtered rows (with aggregated)', dataHeat)
      }

      let showPositions = this.colFilter
      //// console.log('data mode cols', showPositions)

      let dataFiltered = dataHeat.filter(function (d) {
        if (showPositions == 'all') {
          return d
        }
        if (showPositions == 'var') {
          return d.variable == 'True'
        }
        if (showPositions == 'var-inf') {
          return d.informative == 'True' //1
        }
        if (showPositions == 'no-choice') {
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
        //// console.log(' positionsPheno', positionsPheno)

        dataFiltered = dataHeat.filter(({ position }) =>
          positionsPheno.includes(position)
        )
        return dataFiltered
      }

      //// console.log('data Heat filtered', dataFiltered)

      return dataFiltered
    },
    dataSequencesFilteredAll() {
      let dataHeatmap = this.data_heatmap //this.dataFilterRows

      let showRows = this.rowFilter
      //// console.log('data mode rows', showRows)

      let region = this.data_region
      //// console.log('region from dataFilter', region)
      let lowEnd = Number(region.split('-')[0])
      let highEnd = Number(region.split('-')[1])
      function range(start, end) {
        return Array(end - start + 1)
          .fill()
          .map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd) // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
      //// console.log('region array', regionArray);

      let dataHeat = dataHeatmap.filter(({ position }) =>
        regionArray.includes(Number(position))
      )

      let showPositions = this.colFilter
      //// console.log('data mode cols', showPositions)

      let dataFiltered = dataHeat.filter(function (d) {
        if (showPositions == 'all') {
          return d
        }
        if (showPositions == 'var') {
          return d.variable == 'True'
        }
        if (showPositions == 'var-inf') {
          return d.informative == 'True' //1
        }
        if (showPositions == 'no-choice') {
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
        //// console.log(' positionsPheno', positionsPheno)

        dataFiltered = dataHeat.filter(({ position }) =>
          positionsPheno.includes(position)
        )
        return dataFiltered
      }

      //// console.log('data Heat filtered ALL ROWS', dataFiltered)

      return dataFiltered
    },

    visualRefData() {
      // let data = this.dataSequencesFilteredAll
      let data = this.dataSequencesFilteredSortedCurrent
      let dummyVR = this.phenosNamesCopy[0]['mRNA_id']
      let VR = this.visualRefSelected

      let dataVR = data.filter(function (d) {
        return d.mRNA_id == dummyVR // 'OJKMMJND_02015_mRNA'
      })

      if (VR !== 'none') {
        dataVR = data.filter(function (d) {
          return d.mRNA_id == VR //make interactive
        })
      }

      // console.log('data VR', dataVR)

      return dataVR
    },
    dataSequencesFilteredSortedCurrent() {
      let dataSortedCurrent = []
      for (let i = 0; i < this.dendroLeaves.length; i++) {
        let row = this.dataSequencesFiltered.filter(
          ({ mRNA_id }) => mRNA_id == this.dendroLeaves[i]
          //  mRNA_id == this.currentSortingOrder[i]
        )

        // //// console.log('row to push', row)
        // dataSortedCurrent.push(row)
        Array.prototype.push.apply(dataSortedCurrent, row)
      }
      //// console.log('dataSequencesFilteredSortedCurrent', dataSortedCurrent)
      return dataSortedCurrent
    },
    phenosNames() {
      let phenosData = this.dataPhenosFiltered

      var phenosNames = d3.map(phenosData, function (d) {
        return d.mRNA_id
      })
      phenosNames = new Set(phenosNames)
      phenosNames = Array.from(phenosNames)

      // console.log('phenosNames updated: ', phenosNames)

      // // debugger

      return phenosNames
    },
    phenosNamesAll() {
      var phenosNames = d3.map(this.data_phenos, function (d) {
        return d.mRNA_id
      })
      phenosNames = new Set(phenosNames)
      phenosNames = Array.from(phenosNames)

      //// console.log('phenosNames: ', phenosNames)

      return phenosNames
    },
    phenosNamesCopy() {
      // let data = _.cloneDeep(this.phenosNamesAll);
      let data = _.cloneDeep(this.yLabelsNames)
      data.sort()

      let dataWithGroups = []
      for (let i = 0; i < data.length; i++) {
        let group = data[i]

        if (data[i].split('-').length > 1) {
          let all_ids = data[i].split('-')
          group = this.$store.getters.getGroupsSelected.filter(({ mRNA_id }) =>
            all_ids.includes(mRNA_id)
          )
          group = d3.map(group, (d) => d.group)
          group = [...new Set(group)][0]
        }

        dataWithGroups.push({ group: group, mRNA_id: data[i] })

        console.log('dataWithGroups', dataWithGroups)
      }
      return dataWithGroups
    },
    yLabelsNames() {
      // let starttime = new Date()
      // var yLabelsNames = d3.map(this.dataFilter, function (d) {
      //   return d.mRNA_id
      // })
      // //// console.log('time yLabelsNames Old', new Date() - starttime)
      // yLabelsNames = new Set(yLabelsNames)
      // yLabelsNames = Array.from(yLabelsNames)
      // //// console.log('yLabelsNames Old: ', yLabelsNames)
      // return yLabelsNames
      return this.phenosNames
    },
    numYLabels() {
      return this.yLabelsNames.length
    },
    numYLabelsNew() {
      return this.yLabelsNamesNew.length
    },
    numYLabelsAll() {
      return this.phenosNamesAll.length
    },
    dendroDefault() {
      return this.data_dendro
    },
    dendroLeavesDefault() {
      let dataDendro = this.dendroDefault

      //  assigns the data to a hierarchy using parent-child relationships
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
      // //// console.log('nodes dendro', nodesDendro.leaves())
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        // //// console.log(e.data.name);
        leafNames.push(e.data.name)
      })

      //// console.log('dendroLeaves default: ', leafNames)

      return leafNames //.reverse()
    },
    dendroLeavesDefaultFiltered() {
      let leafNames = this.dendroLeavesDefault

      let showRows = this.rowFilter
      if (showRows == 'subset') {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
        //// console.log('> filter dendro leaves')
      }
      if (this.aggregatedSampleString.length !== 0) {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
        //// console.log('> filter dendro leaves aggregated', this.aggregatedSampleString, this.aggregatedChilds)
        // insert aggregated row
        //// console.log('minimum index aggregated', this.aggrIndex)

        let aggr_idx = this.aggrIndex
        // leafNames.splice(this.aggrIndex[0], 0, this.aggregatedSampleString[0])
        for (let i = 0; i < aggr_idx.length; i++) {
          // console.log('this.aggrIndex', this.aggrIndex[i])
          let idx = this.aggrIndex[i]

          leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }

        //// console.log('leafNames', leafNames)
      }

      // console.log('dendroLeaves default filtered: ', leafNames)
      // // debugger

      return leafNames //.reverse()
    },
    dendroLeavesAll() {
      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default') {
        //this.rowSort
        //// console.log('dendroLeavesAll = dendro default')
        dataDendro = this.dendroDefault
      } else {
        //this.dendroCustom.name
        dataDendro = this.dendroCustom
        //// console.log('dendroLeavesAll = dendro custom')
      }

      //  assigns the data to a hierarchy using parent-child relationships
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })

      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        // //// console.log(e.data.name);
        leafNames.push(e.data.name)
      })

      return leafNames //.reverse()
    },
    dendroLeaves() {
      // to filter out rows
      let leafNames = this.dendroLeavesAll
      let showRows = this.rowFilter
      if (showRows == 'subset') {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
        //// console.log('> filter dendro leaves')
      }
      //// console.log('dendroLeaves: ', leafNames)

      if (this.aggregatedSampleString.length !== 0) {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
        //// console.log('> filter dendro leaves aggregated', this.aggregatedSampleString, this.aggregatedChilds)
        // insert aggregated row
        //// console.log('minimum index aggregated', this.aggrIndex)

        // leafNames.splice(this.aggrIndex[0], 0, this.aggregatedSampleString[0])
        let aggr_idx = this.aggrIndex
        // leafNames.splice(this.aggrIndex[0], 0, this.aggregatedSampleString[0])
        for (let i = 0; i < aggr_idx.length; i++) {
          // console.log('this.aggrIndex', this.aggrIndex[i])
          let idx = this.aggrIndex[i]

          leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }
      }

      return leafNames //.reverse()
    },
    root() {
      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default' && this.toggleButton == true) {
        //// console.log('show dendro default - toggle true')
        dataDendro = this.dendroDefault
      }
      if (this.linkedDendro == 'dendro-custom' && this.toggleButton == true) {
        //// console.log('show dendro custom')
        dataDendro = this.dendroCustom
      }
      // if (this.linkedDendro == 'dendro-default' && this.toggleButton == true){
      //   //// console.log('show dendro default - toggle true')
      //   dataDendro = this.dendroDefault

      // }
      if (this.toggleButton == false) {
        if (this.showCoreSNP == true) {
          dataDendro = this.getCoreSNP // make checkbox for core SNP!!
        } else {
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
        // //// console.log(e.data.name);
        leafDepths.push(e.depth)
      })
      //// console.log('dendroDepth: ', leafDepths, d3.max(leafDepths))

      return leafDepths //.reverse()
    },
    dendroX() {
      let dataNodes = this.colCluster(this.root).descendants()
      let leafs = []
      dataNodes.forEach((e) => {
        // //// console.log(e.data.name);
        leafs.push(e.x)
      })

      return leafs //.reverse()
    },
    dendroXgroups() {
      let dataNodes = this.colCluster(this.root).descendants()
      let lst_nodes = []
      let level = this.levelCollapse
      dataNodes.forEach((e) => {
        // //// console.log(e.data.name);
        if (e.height <= level && e.height > 0) {
          //omit leafs
          // // console.log(e.depth, e.data.name)
          lst_nodes.push(e.data.name)
        }
      })
      lst_nodes.sort((a, b) => b.length - a.length)

      let lst_nodes_included = []
      let lst_nodes_aggr_initial = lst_nodes.filter(function (d) {
        let arr1 = d.split('-')
        // // console.log('arr1', arr1)

        const containsAll = arr1.every((element) => {
          return lst_nodes_included.includes(element)
        })

        if (containsAll == true) {
          return false
        } else {
          // // console.log('arr1 not included', arr1)
          lst_nodes_included = [...lst_nodes_included.concat(d.split('-'))]
          // // console.log('lst_nodes_included', lst_nodes_included)
          return true
        }
      })

      // console.log('lst_nodes_final', lst_nodes_aggr_initial)

      return lst_nodes_aggr_initial //.reverse()
    },
    dendroHeight() {
      return (
        'translate(' + 10 + ',' + (Math.abs(d3.min(this.dendroX)) + 6) + ')'
      )
    },
    colCluster() {
      return (
        d3
          .cluster()
          // .nodeSize([10, 6.8])
          .nodeSize([
            this.cellSize,
            this.dendroWidth / d3.max(this.dendroDepth),
          ]) //32,24 this.bipartiteWidth/20
          //   .separation(function(a,b){
          //     return 1
          // });; //.size([this.chartHeight, 200])
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
      //// console.log('time filtering xLabelsNames: ', (new Date().getTime() - starttime.getTime())/1000)

      xLabelsNames = new Set(xLabelsNames)
      xLabelsNames = Array.from(xLabelsNames)
      //// console.log('xLabelsNames: ', xLabelsNames)

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
      //// console.log('xLabelsNames: ', xLabelsNames)

      return xLabelsNames
    },
    numXLabelsAll() {
      return this.xLabelsNamesAll.length
    },
    chartWidth() {
      // //// console.log('chartWidth', )
      return this.cellSize * this.numXLabels + 2
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
      return this.cellSize * this.getCoreSNPLeafs.length + 10

      // return (this.cellSize * this.dendroLeavesDefault.length) + 10
    },
    colorScaleNuc() {
      let cellColors = this.cellColors
      //// console.log('color mode', cellColors)

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
            '#f99372',
            '#89b2ff',
            '#eedd80',
            '#74936e',

            '#f99372',
            '#89b2ff',
            '#eedd80',
            '#74936e',

            '#f6ffff',
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

            // "#a463ce",
            // "#a463ce",
            // "#a463ce",
            // "#a463ce",

            // "#9fd0cb",
            // "#9fd0cb",
            // "#9fd0cb",
            // "#9fd0cb",
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
    initialCollapse(lst_nodes_aggr_initial) {
      let vis = this

      ///// collapse initially
      // vis.lst_nodes_aggr_initial = vis.dendroXgroups

      // console.log('lst_nodes_aggr_initial', lst_nodes_aggr_initial)

      // get most recent file from store
      vis.selectedGroups = vis.$store.getters.getGroupsSelected
      console.log('vis.selectedGroups from getter', vis.selectedGroups)

      for (let j = 0; j < lst_nodes_aggr_initial.length; j++) {
        let nodeAggInit = lst_nodes_aggr_initial[j]
        // console.log('nodeAggInit', nodeAggInit)

        let nodeAggArr = nodeAggInit.split('-')
        let nodeAgg = nodeAggArr.sort().join('-')
        // console.log('nodeAgg', nodeAgg)

        let color = vis.colorsGroups.shift()
        // // console.log('nodeAgg array: ', nodeAggArr)
        for (let i = 0; i < nodeAggArr.length; i++) {
          let nr = vis.counter

          vis.aggregatedRows.push({
            group: nr,
            mRNA_id: nodeAggArr[i],
            color: color,
            checkedColor: false,
            checkedCollapse: true,
          })
          vis.selectedGroups.push({
            group: nr,
            mRNA_id: nodeAggArr[i],
            color: color,
            checkedColor: false,
            checkedCollapse: true,
          })
        }

        // console.log('ALL aggregated groups', vis.aggregatedRows)
        this.$store.dispatch('setGroups', vis.aggregatedRows)
        this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

        // make color classess
        var styleText = document.createElement('style')
        styleText.type = 'text/css'
        styleText.innerHTML =
          'text.group-selection-' +
          color +
          ' { fill: ' +
          color +
          ';   font-weight: bold; }'

        document.getElementsByTagName('head')[0].appendChild(styleText)

        var styleLinks = document.createElement('style')
        styleLinks.type = 'text/css'
        styleLinks.innerHTML =
          'path.group-selection-' +
          color +
          ' { stroke: ' +
          color +
          '; z-index: 2000;}'

        document.getElementsByTagName('head')[0].appendChild(styleLinks)

        var styleNodePheno = document.createElement('style')
        styleNodePheno.type = 'text/css'
        styleNodePheno.innerHTML =
          'circle.group-selection-' + color + ' { stroke: ' + color + '; }'

        document.getElementsByTagName('head')[0].appendChild(styleNodePheno)

        var styleRowAggr = document.createElement('style')
        styleRowAggr.type = 'text/css'
        styleRowAggr.innerHTML =
          'rect.group-selection-' + color + ' { stroke: ' + color + '; }'

        document.getElementsByTagName('head')[0].appendChild(styleRowAggr)

        //// console.log('dataFlat max index: ', vis.dataSequencesMaxIndex)
        if (vis.maxIndex == null) {
          vis.maxIndex = vis.dataSequencesMaxIndex
        }

        let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(
          ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
        )
        // console.log('dataPhenosChilds', dataPhenosChilds)

        let aggregatedChildsPhenos = []
        let virSum = []
        let specieSum = []
        let strainSum = []

        for (let i = 0; i < dataPhenosChilds.length; i++) {
          virSum.push(dataPhenosChilds[i]['virulence'])
          specieSum.push(dataPhenosChilds[i]['species'])
          strainSum.push(dataPhenosChilds[i]['strain_name'])
        }

        aggregatedChildsPhenos.push({
          mRNA_id: nodeAgg,
          virulence: [...new Set(virSum)].join('|'),
          species: [...new Set(specieSum)].join('|'),
          strain_name: [...new Set(strainSum)].join('|'),
          group: vis.counter,
        })

        // console.log('dataPhenosChilds Aggregated', aggregatedChildsPhenos)
        vis.counter++

        // compute on whole alignment?
        // let dataFilteredChilds = vis.dataSequencesFilteredSortedCurrent.filter(({ mRNA_id }) =>
        // nodeAggArr.includes(mRNA_id))

        let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )
        // console.log('data filtered nodeAggArr', dataFilteredChilds)

        let groupedChilds = d3.groups(
          dataFilteredChilds,
          (d) => d.position,
          (d) => d.nucleotide
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable
        )
        // console.log('data grouped childs: ', groupedChilds)
        let aggregatedChilds = []

        groupedChilds.forEach(function (el) {
          vis.maxIndex += 1

          let idx = vis.maxIndex
          let pos = el[0]
          let nuc = el[1]
          if (nuc.length > 1) {
            let multi = []
            for (let i = 0; i < nuc.length; i++) {
              multi.push(nuc[i][0])
            }
            nuc = multi.sort().join('|')
          } else {
            nuc = el[1][0][0]
          }
          let info = el[1][0][1]
          let infoSum = []
          let phenoSum = []
          let varSum = []
          for (let i = 0; i < info.length; i++) {
            infoSum.push(info[i]['informative'])
            phenoSum.push(info[i]['pheno_specific'])
            varSum.push(info[i]['variable'])
          }

          // add elements to new array
          aggregatedChilds.push({
            index: String(idx),
            position: pos,
            nucleotide: nuc,
            mRNA_id: nodeAgg,
            variable: [...new Set(varSum)].join('|'),
            informative: [...new Set(infoSum)].join('|'),
            pheno_specific: [...new Set(phenoSum)].join('|'),
          })
        })

        // console.log('data aggregated childs', aggregatedChilds)

        // let aggregatedSamples = [... new Set(vis.aggregatedSamples.concat(nodeAggArr))]

        let aggrIndeces = []

        for (let j = 0; j < nodeAggArr.length; j++) {
          //// console.log('index of aggregated sample ', nodeAggArr[j], vis.currentSortingOrder, vis.currentSortingOrder.indexOf(nodeAggArr[j]))
          aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        }

        // console.log('currentSort', vis.currentSort)
        // console.log('aggrIndeces', aggrIndeces)
        // debugger
        //// console.log('minimum index: ', d3.min(aggrIndeces))

        vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
        vis.aggregatedSampleString = [
          ...vis.aggregatedSampleString.concat(nodeAgg),
        ]
        vis.aggregatedChilds = [
          ...vis.aggregatedChilds.concat(aggregatedChilds),
        ]
        vis.aggregatedPhenos = [
          ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
        ]

        vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

        //// console.log('vis.aggregatedSamples', vis.aggregatedSampleString)
        //// debugger
        //// console.log('vis.dataPhenosFiltered without aggr?', vis.dataPhenosFiltered)
        //// console.log('phenosNames updated?', vis.phenosNames)
        //// console.log('current sorting array', vis.currentSortingOrder)
        //// console.log('rowsorter current', vis.rowSorterCurrent)

        // vis.currentSort = vis.rowSorterCurrent
        vis.currentSortAll = vis.rowSorterCurrentAll
        // // console.log('rowsorter current', vis.rowSorterCurrent)
        // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

        // vis.selectionGroups = []
        // vis.childsSelected = []
      }
      // console.log('vis.newSortwithAggregated',vis.newSortwithAggregated)
      // // debugger
      //// make view

      // console.log('this.dataPhenosFilteredSortedCurrent', vis.dataPhenosFilteredSortedCurrent)
      // console.log('this.dataPhenosSortedCurrent', vis.dataPhenosSortedCurrent)
      // console.log('aggrIndex', vis.aggrIndex)
      // console.log('aggrSampleString', vis.aggregatedSampleString)

      // vis.drawView()
      // vis.drawHeatMap(vis.newSortwithAggregated)
      // vis.drawPhenotypes(vis.newSortwithAggregated)
      // vis.drawBipartite(vis.newSortwithAggregated)
      // vis.drawDendro()
      // vis.drawAnnotations()
    },
    drawView() {
      let vis = this
      // vis.metadataDictCat

      vis.groupToDelete
      vis.groupToDecolor

      let sortOrder = vis.rowSorterCurrentAll
      //// console.log('vis.rowSorterCurrentAll', vis.rowSorterCurrentAll)
      //// console.log('vis.rowSorterCurrent', vis.rowSorterCurrent)
      if (
        (vis.rowFilter == 'subset') |
        (vis.aggregatedSampleString.length !== 0)
      ) {
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
      let starttime = new Date()
      // console.log('drawing dendrogram...')

      //// make dendro
      let vis = this
      let dendroGraph = this.dendroGroup
      const t_dendro = dendroGraph.transition().duration(vis.transitionTime)

      let dataLinks = vis.colCluster(vis.root).links()
      // //// console.log('dataLinks: ', dataLinks)

      let dataNodes = vis.root.descendants()
      // //// console.log('dataNodes: ', dataNodes)

      let dendroDepth = vis.dendroDepth
      // //// console.log('dendro depth:', dendroDepth, d3.max(dendroDepth))

      let dendroX = vis.dendroX
      // //// console.log('dendro X', dendroX, d3.min(dendroX))

      // dendroGraph.selectAll('path.linkDendro').remove()
      // dendroGraph.selectAll('circle.nodeDendro').remove()
      const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)
      // vis.equals = equals;

      dendroGraph
        .selectAll('path.linkDendro')
        .data(dataLinks)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linkDendro')
              .attr('fill', 'none')
              // .attr('stroke', 'rgba(104, 195, 163, 0.5)')

              .attr('stroke', 'rgba(192, 192, 192, 0.5)')
              .attr('d', (d) => vis.elbow(d)),
          (update) =>
            update.call((update) =>
              update
                .transition(t_dendro)
                .attr('d', (d) => vis.elbow(d))
                .attr('stroke', 'rgba(192, 192, 192, 0.5)')
            ),
          (exit) =>
            exit.call((exit) =>
              exit
                .transition(t_dendro)
                .attr('stroke', 'rgba(192, 192, 192, 0)')
                .remove()
            )
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
                update
                  .transition(t_dendro)
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
        // .on("contextmenu", function (event, i) {
        //   event.preventDefault();

        //   // //Show the tooltip
        //   // d3.select('#popOverGroup').classed('hidden', false)
        //   // d3.select('#popOverBg').classed('hidden', false)

        //   // react on right-clicking
        //   let nodeAgg = d3.select(this).attr('name')
        //   //// console.log('nodeAgg: ', nodeAgg)

        //   let nodeAggArr = nodeAgg.split("-");
        //   // console.log('nodeAgg array: ', nodeAggArr)

        //   if (vis.aggregatedSampleString.includes(nodeAgg)){
        //     // console.log('^^^ NODE ALREADY AGGREGATED')
        //     // console.log('newSortwithAggregated', vis.newSortwithAggregated)
        //     // console.log('vis.nodesAggArray', vis.nodesAggArray)
        //     // console.log('vis.aggrIndex', vis.aggrIndex)

        //     //// debugger
        //     //delete items from aggregated dict

        //     let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

        //     vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
        //      d !== nodeAgg)

        //     vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
        //     ! nodeAggArr.includes(mRNA_id))

        //     vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
        //     ! nodeAggArr.includes(d))

        //     vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)

        //     vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
        //       mRNA_id !== nodeAgg)

        //     // console.log('^^^ updated vars')

        //     // console.log('newSortwithAggregated', vis.newSortwithAggregated)
        //     // console.log('vis.nodesAggArray', vis.nodesAggArray)
        //     // console.log('vis.aggrIndex', vis.aggrIndex)
        //     // console.log('----')

        //     // console.log('vis.aggregatedChilds', vis.aggregatedChilds)
        //     // // console.log('vis.aggregatedPhenos', vis.aggregatedPhenos)

        //     //// debugger
        //   }
        //   else{

        //     const checkAlreadyAggr = nodeAggArr.some(r=> vis.nodesAggArray.includes(r))

        //     // console.log('vis.aggregaredRows', vis.aggregatedRows, vis.aggregatedSampleString, nodeAggArr, vis.nodesAggArray,checkAlreadyAggr)

        //     if (checkAlreadyAggr){
        //       // console.log('create new aggregate!')
        //       // console.log('newSortwithAggregated', vis.newSortwithAggregated)
        //       // console.log('vis.nodesAggArray', vis.nodesAggArray)
        //       // console.log('vis.aggrIndex', vis.aggrIndex)

        //       // console.log('find group to delete:')
        //       // console.log('nodeAggArr',  nodeAggArr)

        //       // console.log(' vis.aggregatedSampleString',  vis.aggregatedSampleString, nodeAgg, nodeAggArr)

        //       let groupDel;
        //       groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
        //       nodeAggArr.includes(mRNA_id))

        //       // console.log('group to delete', groupDel)
        //       let indexDel = d3.map(groupDel, function (d) {
        //         return d['group']
        //       })
        //       indexDel = [... new Set(indexDel)][0]
        //       // console.log('index to delete', indexDel, 'node to delete:', vis.aggregatedSampleString[indexDel])

        //       let nodeDel = vis.aggregatedSampleString[indexDel]

        //       let samplesDel = []
        //       let indecesDel = []

        //       for (let i=0; i< vis.aggregatedSampleString.length; i++){

        //         let arr = vis.aggregatedSampleString[i].split('-')

        //         const checkAlreadyAggr = nodeAggArr.some(r=> arr.includes(r))
        //         // // console.log('find sample name to delete', checkAlreadyAggr, vis.aggregatedSampleString[i])
        //         if (checkAlreadyAggr){
        //           samplesDel.push(vis.aggregatedSampleString[i])
        //           indecesDel.push(vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i]))
        //         }

        //       }

        //         // console.log('sample(s) to delete', samplesDel)
        //         // console.log('indeces to delete', indecesDel)

        //         // console.log('OLD VARS:')
        //         // console.log('vis.aggregatedRows', vis.aggregatedRows)
        //         // console.log('vis.nodesAggArray', vis.nodesAggArray)
        //         // console.log('vis.aggrIndex',  vis.aggrIndex)
        //         // console.log(' vis.aggregatedPhenos',  vis.aggregatedPhenos)

        //       for (let i=0; i<samplesDel.length; i++){

        //         let nodeDel = samplesDel[i]
        //         let childsDel = samplesDel[i].split('-')
        //         let indexDel = indecesDel[i]

        //         vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
        //         d !== nodeDel)

        //         vis.aggregatedRows = vis.aggregatedRows.filter(({ mRNA_id }) =>
        //         ! childsDel.includes(mRNA_id))

        //         vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
        //         ! childsDel.includes(d))

        //         vis.aggrIndex = vis.aggrIndex.filter((d) => ! indecesDel.includes(vis.aggrIndex.indexOf(d)))

        //         vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
        //                   mRNA_id !== nodeDel)

        //       }

        //       // vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
        //       // d !== nodeDel)

        //       // vis.aggregatedRows = vis.aggregatedRows.filter(({ group }) =>
        //       // group !== indexDel)

        //       // vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
        //       // ! nodeAggArr.includes(d))

        //       // vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)

        //       // vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
        //       //   mRNA_id !== nodeDel)

        //         // console.log('UPDATED VARS:')
        //         // console.log('vis.aggregatedSampleString', vis.aggregatedSampleString)
        //         // console.log('vis.aggregatedRows', vis.aggregatedRows)
        //         // console.log('vis.nodesAggArray', vis.nodesAggArray)
        //         // console.log('vis.aggrIndex',  vis.aggrIndex)
        //         // console.log(' vis.aggregatedPhenos',  vis.aggregatedPhenos)

        //         // console.log('vis.aggregatedChilds??', vis.aggregatedChilds)

        //     }

        //   // let nodeAggArr = nodeAgg.split("-");
        //   // // console.log('nodeAgg array: ', nodeAggArr)
        //   for (let i =0; i < nodeAggArr.length; i++){
        //     let nr = vis.counter
        //     vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i]})
        //   }

        //   // console.log('ALL aggregated groups', vis.aggregatedRows)

        //   //// console.log('dataFlat max index: ', vis.dataSequencesMaxIndex)
        //   if (vis.maxIndex == null){
        //     vis.maxIndex = vis.dataSequencesMaxIndex

        //   }

        //   let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(({ mRNA_id }) =>
        //   nodeAggArr.includes(mRNA_id))
        //   // console.log('dataPhenosChilds', dataPhenosChilds)

        //   let aggregatedChildsPhenos = []
        //   let virSum = [];
        //   let specieSum = [];

        //   for (let i = 0; i < dataPhenosChilds.length; i++) {
        //       virSum.push(dataPhenosChilds[i]['virulence'])
        //       specieSum.push(dataPhenosChilds[i]['species'])
        //   }

        //   aggregatedChildsPhenos.push(
        //       {
        //         mRNA_id: nodeAgg,
        //         virulence: [... new Set(virSum)].join("|"),
        //         species: [... new Set(specieSum)].join("|"),
        //         group: vis.counter,
        //       }
        //     )

        //   // console.log('dataPhenosChilds Aggregated', aggregatedChildsPhenos)
        //   vis.counter ++;

        //   // compute on whole alignment?
        //   // let dataFilteredChilds = vis.dataSequencesFilteredSortedCurrent.filter(({ mRNA_id }) =>
        //   // nodeAggArr.includes(mRNA_id))

        //   let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        //   nodeAggArr.includes(mRNA_id))
        //   // console.log('data filtered nodeAggArr', dataFilteredChilds)

        //   let groupedChilds = d3.groups(
        //     dataFilteredChilds,
        //     d => d.position,
        //     d => d.nucleotide,
        //     // d => d.informative,
        //     // d => d.pheno_specific,
        //     // d => d.variable

        //   )
        //   // console.log('data grouped childs: ', groupedChilds)
        //   let aggregatedChilds = []

        //   groupedChilds.forEach(function(el) {

        //       vis.maxIndex += 1

        //       let idx = vis.maxIndex
        //       let pos = el[0]
        //       let nuc = el[1]
        //       if (nuc.length > 1) {
        //         let multi = [];
        //         for (let i = 0; i < nuc.length; i++) {
        //           multi.push(nuc[i][0])

        //         }
        //         nuc =multi.sort().join('|')

        //       }
        //       else{
        //         nuc = el[1][0][0]
        //       }
        //       let info = el[1][0][1]
        //       let infoSum = [];
        //       let phenoSum = [];
        //       let varSum = [];
        //         for (let i = 0; i < info.length; i++) {
        //           infoSum.push(info[i]['informative'])
        //           phenoSum.push(info[i]['pheno_specific'])
        //           varSum.push(info[i]['variable'])

        //       }

        //       // add elements to new array
        //       aggregatedChilds.push(
        //         {
        //           index: String(idx),
        //           position: pos,
        //           nucleotide: nuc,
        //           mRNA_id: nodeAgg,
        //           variable: [... new Set(varSum)].join("|"),
        //           informative: [... new Set(infoSum)].join("|"),
        //           pheno_specific: [... new Set(phenoSum)].join("|")
        //         }
        //       )

        //     }
        //   );

        //   // console.log('data aggregated childs', aggregatedChilds)

        //   // let aggregatedSamples = [... new Set(vis.aggregatedSamples.concat(nodeAggArr))]

        //   let aggrIndeces = []

        //   for (let j = 0; j < nodeAggArr.length; j++) {
        //     //// console.log('index of aggregated sample ', nodeAggArr[j], vis.currentSortingOrder, vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        //     aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        //   }

        //   //// console.log('minimum index: ', d3.min(aggrIndeces))

        //   vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
        //   vis.aggregatedSampleString = [...vis.aggregatedSampleString.concat(nodeAgg)];
        //   vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
        //   vis.aggregatedPhenos = [...vis.aggregatedPhenos.concat(aggregatedChildsPhenos)]

        //   vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

        //   //// console.log('vis.aggregatedSamples', vis.aggregatedSampleString)
        //   //// debugger
        //   //// console.log('vis.dataPhenosFiltered without aggr?', vis.dataPhenosFiltered)
        //   //// console.log('phenosNames updated?', vis.phenosNames)
        //   //// console.log('current sorting array', vis.currentSortingOrder)
        //   //// console.log('rowsorter current', vis.rowSorterCurrent)

        // }
        //   // vis.currentSort = vis.rowSorterCurrent
        //   vis.currentSortAll = vis.rowSorterCurrentAll
        //   // // console.log('rowsorter current', vis.rowSorterCurrent)
        //   // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

        //   // vis.drawView()

        //   vis.drawHeatMap(vis.newSortwithAggregated)
        //   vis.drawPhenotypes(vis.newSortwithAggregated)
        //   vis.drawBipartite(vis.newSortwithAggregated)
        //   // vis.drawHeatMap(vis.rowSorterCurrent)
        //   // vis.drawPhenotypes(vis.rowSorterCurrent)
        //   // vis.drawBipartite(vis.rowSorterCurrent)

        // })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();
            let childs = d3.select(this).attr('name')
            vis.childs = childs
            //// console.log('childs name', childs)
            const childsSelected = childs.split('-').sort()
            vis.childsSelected = [...vis.childsSelected.concat(childsSelected)]

            if (d3.select(this).attr('class') == 'nodeDendro node-selection') {
              // console.log('already selected --> deselect')
              d3.select(this).classed('node-selection', false)

              d3.selectAll('.rowLabel')
                .filter(function () {
                  return childsSelected.includes(
                    d3.select(this).attr('mRNA_id')
                  ) // filter by single attribute
                })
                .classed('text-selection', false)

              d3.selectAll('.linksBp')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('link-selection', false)

              d3.selectAll('.nodesSource')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('node-selection', false)

              d3.selectAll('.nodesTarget')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('node-selection', false)

              d3.selectAll('.cell')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('cell-selection', false)

              d3.selectAll('.vir')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('pheno-node-selection', false)

              d3.selectAll('.specie')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('text-selection', false)

              vis.childsSelected = [] //remove selection
            } else {
              d3.selectAll('.nodeDendro')
                .filter(function (l) {
                  let arr = l.data.name.split('-').sort()
                  return equals(childsSelected, arr) // filter by single attribute
                })
                .classed('node-selection', true)

              d3.selectAll('.rowLabel')
                .filter(function () {
                  return childsSelected.includes(
                    d3.select(this).attr('mRNA_id')
                  ) // filter by single attribute
                })
                .classed('text-selection', true)

              d3.selectAll('.linksBp')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('link-selection', true)

              d3.selectAll('.nodesSource')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('node-selection', true)

              d3.selectAll('.nodesTarget')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('node-selection', true)

              d3.selectAll('.cell')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('cell-selection', true)

              d3.selectAll('.vir')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('pheno-node-selection', true)

              d3.selectAll('.specie')
                .filter(function (l) {
                  return childsSelected.includes(l.mRNA_id)
                })
                .classed('text-selection', true)
            }

            // d3.selectAll(".linksBp")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('link-selection', true)

            // d3.selectAll(".nodesSource")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('node-selection', true)

            // d3.selectAll(".nodesTarget")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('node-selection', true)

            // d3.selectAll(".cell")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('cell-selection', true)

            // d3.selectAll(".vir")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('pheno-node-selection', true)

            // d3.selectAll(".specie")
            // .filter(function(l) {
            //   return childsSelected.includes(l.mRNA_id)
            // })
            // .classed('text-selection', true)

            let altSelection = []

            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          } else {
            // console.log('clicked internal node dendro')
            let childs = d3.select(this).attr('name')
            vis.childs = childs
            //// console.log('childs name', childs)
            const childsSelected = childs.split('-').sort()
            vis.childsSelected = childsSelected
            //// console.log('childs array', childsSelected)

            // selection
            d3.selectAll('.nodeDendro').classed(
              'node-selection',
              function (l, li) {
                let arr = l.data.name.split('-').sort()
                return equals(childsSelected, arr)
              }
            )

            d3.selectAll('.linksBp').classed(
              'link-selection',
              function (l, li) {
                return childsSelected.includes(l.mRNA_id)
              }
            )

            d3.selectAll('.nodesSource').classed(
              'node-selection',
              function (l, li) {
                return childsSelected.includes(l.mRNA_id)
              }
            )

            d3.selectAll('.nodesTarget').classed(
              'node-selection',
              function (l, li) {
                return childsSelected.includes(l.mRNA_id)
              }
            )

            d3.selectAll('.rowLabel').classed(
              'text-selection',
              function (l, li) {
                return childsSelected.includes(l)
              }
            )

            d3.selectAll('.cell').classed('cell-selection', function (l, li) {
              return childsSelected.includes(l.mRNA_id)
            })

            d3.selectAll('.vir').classed(
              'pheno-node-selection',
              function (l, li) {
                return childsSelected.includes(l.mRNA_id)
              }
            )

            d3.selectAll('.specie').classed('text-selection', function (l, li) {
              return childsSelected.includes(l.mRNA_id)
            })

            let altSelection = []
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of aggr rect " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the text label " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the node " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
            // // debugger
          }
        })
      // .on('click', function (d) {
      //   //// console.log('clicked internal node dendro')
      //   let childs = d3.select(this).attr('name')
      //   vis.childs = childs;
      //   //// console.log('childs name', childs)
      //   const childsSelected = childs.split("-").sort();
      //   vis.childsSelected = childsSelected
      //   //// console.log('childs array', childsSelected)

      //   // selection
      //   d3.selectAll('.nodeDendro').classed('node-selection', function (l, li) {

      //     let arr = l.data.name.split('-').sort();
      //     return equals(childsSelected, arr)

      //   })

      //   d3.selectAll('.linksBp').classed('link-selection', function (l, li) {

      //     return childsSelected.includes(l.mRNA_id)

      //   })

      //   d3.selectAll('.nodesSource').classed('node-selection', function (l, li) {

      //   return childsSelected.includes(l.mRNA_id)

      //   })

      //   d3.selectAll('.nodesTarget').classed('node-selection', function (l, li) {

      //   return childsSelected.includes(l.mRNA_id)

      //   })

      //   d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {

      //     return childsSelected.includes(l)

      //   })

      //   d3.selectAll('.cell').classed('cell-selection', function (l, li) {

      //     return childsSelected.includes(l.mRNA_id)

      //   })

      //   d3.selectAll('.vir').classed('pheno-node-selection', function (l, li) {

      //     return childsSelected.includes(l.mRNA_id)

      //   })

      //   d3.selectAll('.specie').classed('text-selection', function (l, li) {

      //     return childsSelected.includes(l.mRNA_id)

      //   })

      //   let altSelection = []
      //     d3.selectAll(".aggr-selection").each(function(d,i) {
      //     // console.log("The mrna of aggr rect " + i + " is " + d3.select(this).attr("mRNA_id"))
      //     let mrna = d3.select(this).attr("mRNA_id").split("-")
      //     altSelection = [...altSelection.concat(mrna)]
      //   })
      //   d3.selectAll(".text-selection").each(function(d,i) {
      //     // console.log("The mrna of the text label " + i + " is " + d3.select(this).attr("mRNA_id"))
      //     let mrna = d3.select(this).attr("mRNA_id").split("-")
      //     altSelection = [...altSelection.concat(mrna)]
      //   })
      //   d3.selectAll(".pheno-node-selection").each(function(d,i) {
      //     // console.log("The mrna of the node " + i + " is " + d3.select(this).attr("mRNA_id"))
      //     let mrna = d3.select(this).attr("mRNA_id").split("-")
      //     altSelection = [...altSelection.concat(mrna)]
      //   })
      //   vis.altSelection = altSelection
      //   // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
      //   // // debugger

      // })

      // // selection update
      // d3.selectAll('.nodeDendro').classed('node-selection', function (l, li) {

      //   let arr = l.data.name.split('-').sort();
      //   return equals(vis.childsSelected, arr)

      // })

      // console.log('[DONE] drawing dendrogram')
      // console.log('time drawing dendrogram', (new Date().getTime() - starttime.getTime())/1000)
    },
    drawPhenotypes(sortingOrderArray) {
      let starttime = new Date()
      // console.log('drawing phenotypes..')

      let dataMeta = this.dataPhenosFilteredSortedCurrent
      // let dataMeta = this.dataPhenosSortedCurrent
      // // console.log('dataMeta from virulence', dataMeta)
      // // console.log('sortingOrderArray', sortingOrderArray)
      // // console.log('sorting order all', this.currentSortingOrderAll)
      // // console.log('aggregatedRow', this.aggregatedRows)

      // let dataByGroup = d3.group(this.aggregatedRows, d => d.group)
      // // console.log('data by group', dataByGroup, dataByGroup.get(0), dataByGroup.get(1))
      // let keysGroups = [...dataByGroup.keys()]
      // // console.log('data by group keys', keysGroups)
      // let tmpSortingArr = this.currentSortingOrderAll

      // for (let i = 0; i < keysGroups.length; i++){
      //   let groupedIdxArr = [];
      //   let groupKey = keysGroups[i]
      //   let groupValues = d3.map(dataByGroup.get(groupKey), function (d) {
      //     return d['mRNA_id']
      //   })
      //   for (let i = 0; i < groupValues.length; i++){
      //     groupedIdxArr.push(tmpSortingArr.indexOf(groupValues[i]))

      //   }
      //   // console.log(groupKey, groupValues, groupedIdxArr, d3.min(groupedIdxArr))
      //   // console.log('make string', [...groupValues].sort().join('-'))
      //   tmpSortingArr = tmpSortingArr.filter(d => !groupValues.includes(d))

      //   tmpSortingArr.splice(d3.min(groupedIdxArr), 0, [...groupValues].sort().join('-'))
      //   // console.log('tmpSortingArr', tmpSortingArr)
      // }

      //// debugger
      let vis = this

      //// make virulence plot
      let virulenceGraph = this.virulenceGroup
      const t_phenos = virulenceGraph.transition().duration(vis.transitionTime)
      virulenceGraph
        .selectAll('circle.vir')
        .data(dataMeta, (d) => d.mRNA_id) //this.dataPhenosFiltered
        .attr('cx', 0)
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'vir border')
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .attr('value', function (d) {
                return d.virulence
              })
              .attr('cx', 0)
              .attr('cy', function (d, i) {
                // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                // // console.log('++++ virulence mrna id WO sorting order', d.mRNA_id)
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })
              .attr('r', vis.cellSize / 2.5)
              // .style('stroke', 'black')
              .style('fill', function (d, i) {
                if (d.virulence == 'virulent') {
                  return 'black'
                } else if (d.virulence == '?') {
                  return 'lightgrey'
                } else if (d.virulence == 'avirulent') {
                  return 'white'
                } else {
                  return 'url(#diagonalHatch)'
                }
              })
              .call((enter) => enter.transition(t_phenos).attr('cx', 0)),
          (update) =>
            update
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .attr('cx', 0)
              .call((update) =>
                update
                  .transition(t_phenos)
                  .attr('cx', 0)
                  .attr('cy', function (d, i) {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // // console.log('++++ virulence mrna id WO sorting order', d.mRNA_id)

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    return row * vis.cellSize
                  })
              ),
          (exit) =>
            exit
              .style('fill', 'brown')
              .call((exit) => exit.transition(t_phenos).attr('cx', 22).remove())
        )
        .on('mouseover', function (event, d) {
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)

          let values = d.virulence.split('|')
          let myString = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')
          }

          let nodeAggArr = mrna.split('-')
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
            nodeAggArr.includes(mRNA_id)
          )
          // console.log('dataPhenosChilds', dataPhenosChilds)

          // console.log('vis.aggregatedRows', vis.aggregatedRows, vis.selectedGroups)
          let groupNrSelected = ''
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(
            ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
          )
          let groupArr = d3.map(groupSelected, (d) => d.group)
          groupNrSelected = Array.from(new Set(groupArr))[0]

          if (isNaN(groupNrSelected)) {
            groupNrSelected = ''
          }

          // console.log('groupNrSelected',groupNrSelected)

          let sum = []

          for (let i = 0; i < dataPhenosChilds.length; i++) {
            sum.push(dataPhenosChilds[i]['virulence'])
          }

          let counts = {}

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1
          }

          let items = Object.keys(counts).map((key) => {
            return [key, counts[key]]
          })

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort((first, second) => {
            return second[1] - first[1]
          })

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map((e) => {
            return e[0]
          })

          let myStringCounts = ''
          for (let i = 0; i < values.length; i++) {
            myStringCounts =
              myStringCounts +
              (keys[i] + ': ' + '<i>' + counts[keys[i]] + '</i>' + '<br>')
          }

          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                20 +
                // - document.getElementById('heatmap').scrollLeft

                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                // + 100
                'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>' +
                groupNrSelected +
                '<br> <strong>virulence: </strong>' +
                '<br>' +
                myStringCounts
            )
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (event, d) {
          d3.select('#tooltip-phenos').classed('hidden', true)
        })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();
            d3.select(this).classed('pheno-node-selection', true)
            d3.selectAll('.rowLabel')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.rowAggr')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('aggr-selection', true)

            d3.selectAll('.strain')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.specie')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.vir')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('pheno-node-selection', true)

            d3.selectAll('.cell')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('cell-selection', true)

            // console.log('alt key pressed!')

            // let items = d3.selectAll('.text-selection').attr('mRNA_id')
            // // console.log('items', items)

            let altSelection = []
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          }

          if (!event.altKey) {
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            // console.log('mousedown phenoLabels', brush_elm, brush_selection, bbox)
            // console.log('event', event, 'brush_selection.style.display', brush_selection.style.display)
            // console.log('event.pageX', event.pageX, 'event.pageY', event.pageY)
            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              // console.log('inside');
              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

            // if ( brush.empty() ||
            //     (e[0][0] > d[0] || d[0] > e[1][0]
            //     || e[0][1] > d[1] || d[1] > e[1][1] )
            // ) {
            //   brush.extent([p,p]);
            // } else {
            //   d3.select(this).classed('extent', true);
            // }
          }
        })

      //// make species plot
      let speciesGraph = this.speciesGroup
      const t_species = speciesGraph.transition().duration(vis.transitionTime)

      speciesGraph
        .selectAll('text.specie')
        .data(dataMeta, (d) => d.mRNA_id) //this.dataPhenosFiltered
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', 'darkgrey')
              // .attr('fill', 'rgba(104, 195, 163, 1)')
              .attr('class', 'specie')
              .style('text-anchor', 'start')
              .style('font-size', '9px')
              .attr('transform', 'translate(0,' + vis.cellSize / 1.3 + ')')
              .attr('x', 0)
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .attr('value', function (d) {
                return d.species
              })
              .attr('y', function (d, i) {
                // let row = sortingOrderArray.indexOf(d.mRNA_id)
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })

              .text(function (d) {
                if (d.species.split('|').length > 1) {
                  return 'multiple'
                }

                return d.species
              })
              .call((enter) => enter.transition(t_species).attr('x', 0)),
          (update) =>
            update
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((update) =>
                update
                  .attr('fill', 'darkgrey')
                  .transition(t_species)
                  .attr('y', function (d, i) {
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    return row * vis.cellSize
                  })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_species).attr('x', 30).remove())
        )
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)

          let value = d3.select(this).attr('value')
          d3.selectAll('.specie').classed(
            'text-similar-highlight',
            function (l, li) {
              return l.species == value
            }
          )
          let values = d.species.split('|')
          let myString = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')
          }
          let nodeAggArr = mrna.split('-')
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
            nodeAggArr.includes(mRNA_id)
          )
          // console.log('dataPhenosChilds', dataPhenosChilds)

          let groupNrSelected = ''
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(
            ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
          )
          let groupArr = d3.map(groupSelected, (d) => d.group)
          groupNrSelected = Array.from(new Set(groupArr))[0]

          if (isNaN(groupNrSelected)) {
            groupNrSelected = ''
          }

          // console.log('groupNrSelected',groupNrSelected)

          let sum = []

          for (let i = 0; i < dataPhenosChilds.length; i++) {
            sum.push(dataPhenosChilds[i]['species'])
          }

          let counts = {}

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1
          }

          let items = Object.keys(counts).map((key) => {
            return [key, counts[key]]
          })

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort((first, second) => {
            return second[1] - first[1]
          })

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map((e) => {
            return e[0]
          })

          let myStringCounts = ''
          for (let i = 0; i < values.length; i++) {
            myStringCounts =
              myStringCounts +
              (keys[i] + ': ' + '<i>' + counts[keys[i]] + '</i>' + '<br>')
          }

          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                document.getElementById('virulence').offsetWidth / 5 +
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                // + 100
                'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>' +
                groupNrSelected +
                '<br> <strong>species: </strong>' +
                '<br>' +
                myStringCounts
            )
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (d) {
          d3.selectAll('.specie').classed('text-similar-highlight', false)
          d3.select('#tooltip-phenos').classed('hidden', true)
          return
        })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();
            d3.select(this).classed('text-selection', true)
            d3.selectAll('.rowLabel')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.rowAggr')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('aggr-selection', true)

            d3.selectAll('.strain')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.specie')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.vir')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('pheno-node-selection', true)

            d3.selectAll('.cell')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('cell-selection', true)
            // console.log('alt key pressed!')

            // let items = d3.selectAll('.text-selection').attr('mRNA_id')
            // // console.log('items', items)

            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          }

          if (!event.altKey) {
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            // console.log('mousedown phenoLabels', brush_elm, brush_selection, bbox)
            // console.log('event', event, 'brush_selection.style.display', brush_selection.style.display)
            // console.log('event.pageX', event.pageX, 'event.pageY', event.pageY)
            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              // console.log('inside');
              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

            // if ( brush.empty() ||
            //     (e[0][0] > d[0] || d[0] > e[1][0]
            //     || e[0][1] > d[1] || d[1] > e[1][1] )
            // ) {
            //   brush.extent([p,p]);
            // } else {
            //   d3.select(this).classed('extent', true);
            // }
          }
        })

      //// make species plot
      let strainGraph = this.strainGroup
      const t_strain = strainGraph.transition().duration(vis.transitionTime)

      strainGraph
        .selectAll('text.strain')
        .data(dataMeta, (d) => d.mRNA_id) //this.dataPhenosFiltered
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', 'darkgrey')
              // .attr('fill', 'rgba(104, 195, 163, 1)')
              .attr('class', 'strain')
              .style('text-anchor', 'start')
              .style('font-size', '9px')
              .attr('transform', 'translate(0,' + vis.cellSize / 1.3 + ')')
              .attr('x', 0)
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .attr('value', function (d) {
                return d.strain_name
              })
              .attr('y', function (d, i) {
                // let row = sortingOrderArray.indexOf(d.mRNA_id)
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })

              .text(function (d) {
                // console.log('d strainname ', d)
                if (d.strain_name.split('|').length > 1) {
                  return 'multiple'
                } else {
                  let strain = d.strain_name.split('_')
                  if (strain[0] !== 'P.') {
                    const removeFirst = strain.splice(0, 1)
                    return strain.join('_')
                    // return d.strain_name
                  } else {
                    const removeFirstTwo = strain.splice(0, 2)
                    return strain.join('_')
                  }
                }

                // // let strain = d.strain_name.split("_")
                //  let strain = d.strain_name.split("_")
                //  if (strain[0] !== 'P.'){
                //    return strain[1]
                //  }
                //  else{
                //      const removeFirstTwo = strain.splice(0, 2);

                //     return strain.join("_")

                //  }
                // const removeFirstTwo = strain.splice(0, 2);

                // return d.strain_name //strain.join("_")
              })
              .call((enter) => enter.transition(t_strain).attr('x', 0)),
          (update) =>
            update
              .attr('label-r', function (d) {
                return vis.dendroLeaves.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((update) =>
                update
                  .attr('fill', 'darkgrey')
                  .transition(t_strain)
                  .attr('y', function (d, i) {
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    return row * vis.cellSize
                  })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_strain).attr('x', 30).remove())
        )
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)

          let value = d3.select(this).attr('value')
          d3.selectAll('.strain').classed(
            'text-similar-highlight',
            function (l, li) {
              return l.strain_name == value
            }
          )

          let values = d.strain_name.split('|')
          let myString = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')
          }

          let nodeAggArr = mrna.split('-')
          let dataPhenosChilds = vis.data_phenos.filter(({ mRNA_id }) =>
            nodeAggArr.includes(mRNA_id)
          )
          // console.log('dataPhenosChilds', dataPhenosChilds)

          let sum = []

          for (let i = 0; i < dataPhenosChilds.length; i++) {
            sum.push(dataPhenosChilds[i]['strain_name'])
          }

          let counts = {}

          for (let num of sum) {
            counts[num] = counts[num] ? counts[num] + 1 : 1
          }

          let items = Object.keys(counts).map((key) => {
            return [key, counts[key]]
          })

          // Step - 2
          // Sort the array based on the second element (i.e. the value)
          items.sort((first, second) => {
            return second[1] - first[1]
          })

          // Step - 3
          // Obtain the list of keys in sorted order of the values.
          let keys = items.map((e) => {
            return e[0]
          })

          let myStringCounts = ''
          for (let i = 0; i < values.length; i++) {
            myStringCounts =
              myStringCounts +
              (keys[i] + ': ' + '<i>' + counts[keys[i]] + '</i>' + '<br>')
          }

          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                document.getElementById('virulence').offsetWidth * 0.8 +
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                // + 100
                'px'
            )
            .select('#value-phenos')
            .html('<strong>sample_name: </strong>' + '<br>' + myStringCounts)
          // d.strain_name +
          // '<br>'

          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (d) {
          d3.selectAll('.strain').classed('text-similar-highlight', false)
          d3.select('#tooltip-phenos').classed('hidden', true)
          return
        })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();
            d3.select(this).classed('text-selection', true)
            d3.selectAll('.rowLabel')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.rowAggr')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('aggr-selection', true)

            d3.selectAll('.specie')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('text-selection', true)

            d3.selectAll('.vir')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('pheno-node-selection', true)

            d3.selectAll('.cell')
              .filter(function () {
                return d3.select(this).attr('mRNA_id') == d.mRNA_id // filter by single attribute
              })
              .classed('cell-selection', true)
            // console.log('alt key pressed!')

            // let items = d3.selectAll('.text-selection').attr('mRNA_id')
            // // console.log('items', items)

            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          }

          if (!event.altKey) {
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            // console.log('mousedown phenoLabels', brush_elm, brush_selection, bbox)
            // console.log('event', event, 'brush_selection.style.display', brush_selection.style.display)
            // console.log('event.pageX', event.pageX, 'event.pageY', event.pageY)
            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              // console.log('inside');
              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

            // if ( brush.empty() ||
            //     (e[0][0] > d[0] || d[0] > e[1][0]
            //     || e[0][1] > d[1] || d[1] > e[1][1] )
            // ) {
            //   brush.extent([p,p]);
            // } else {
            //   d3.select(this).classed('extent', true);
            // }
          }
        })

      // console.log('[DONE] drawing phenotypes')
      //// console.log('time drawing phenotypes', (new Date().getTime() - starttime.getTime())/1000)
    },
    drawBipartite(sortingOrderArray) {
      //// make bipartite

      let starttime = new Date()
      // console.log('drawing bipartite...')

      let dataMeta = this.dataPhenosFiltered //this.metadataDendroOrderIdx
      let vis = this
      //// console.log('vis.dendroLeaves from bipartite', vis.dendroLeaves)
      //// console.log('vis.dendroLeavesCustom', vis.dendroLeavesCustom)
      //// console.log('vis.toggleButton:',vis.toggleButton)
      //// console.log('vis.linkedDendro:',vis.linkedDendro)
      //// console.log('sortingOrderArray from bipartite', sortingOrderArray)
      //// console.log('dataMeta', dataMeta)
      //// console.log('dataMeta all', vis.dataPhenosSortedCurrent)
      // console.log('vis.dendroLeavesDefault', vis.dendroLeavesDefault)
      //// debugger

      let bipartiteGraph = this.bipartiteGroup
      const t_bipartite = bipartiteGraph
        .transition()
        .duration(vis.transitionTime)

      bipartiteGraph
        .selectAll('circle.nodesSource')
        .data(vis.dataPhenosSortedCurrent, (d) => d.mRNA_id) //dataMeta
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'nodesSource')
              .attr('label-r', function (d, i) {
                // if (vis.toggleButton == true){

                //   return vis.dendroLeaves.indexOf(d.mRNA_id)

                // }
                // else{

                //   return vis.dendroLeavesDefault.indexOf(d.mRNA_id)

                // }
                if (vis.linkedDendro == 'dendro-custom') {
                  return vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                } else {
                  // return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  // console.log('vis.getCoreSNPLeafs', vis.getCoreSNPLeafs)
                  // console.log('d', d, 'd.mrna_id', d.mRNA_id, 'vis.getCoreSNPLeafs.indexOf(d.mRNA_id)', vis.getCoreSNPLeafs.indexOf(d.mRNA_id))
                  // debugger
                  if (vis.showCoreSNP == true) {
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)
                  } else {
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
                // if (vis.toggleButton == true){

                //   let row = vis.dendroLeaves.indexOf(d.mRNA_id)
                //   return row * vis.cellSize

                // }
                // else {

                //   let row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                //   return row * vis.cellSize

                // }
                if (vis.linkedDendro == 'dendro-custom') {
                  let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                  return row * vis.cellSize
                } else {
                  // let row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  let row
                  if (vis.showCoreSNP == true) {
                    row = vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0])
                  } else {
                    row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }

                  return row * vis.cellSize
                }
              })
              .attr('r', 2)
              // .style('fill', 'rgba(104, 195, 163, 0.5)')
              .style('fill', '#ccc')
              .call((enter) => enter.transition(t_bipartite).attr('cx', 2)),
          (update) =>
            update
              .attr('label-r', function (d, i) {
                // if (vis.toggleButton == true){

                //   return vis.dendroLeaves.indexOf(d.mRNA_id)

                // }
                // else{

                //   return vis.dendroLeavesDefault.indexOf(d.mRNA_id)

                // }
                if (vis.linkedDendro == 'dendro-custom') {
                  return vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                } else {
                  if (vis.showCoreSNP == true) {
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0])
                  } else {
                    return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }
                }
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .call((update) =>
                update
                  .transition(t_bipartite)
                  .style('fill', '#ccc')
                  .attr('cy', function (d, i) {
                    // if (vis.toggleButton == true){

                    //   let row = vis.dendroLeaves.indexOf(d.mRNA_id)
                    //   return row * vis.cellSize

                    //   }
                    //   else {

                    //   let row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                    //   return row * vis.cellSize

                    //   }
                    if (vis.linkedDendro == 'dendro-custom') {
                      let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                      return row * vis.cellSize
                    } else {
                      // let row = vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                      let row
                      if (vis.showCoreSNP == true) {
                        row = vis.getCoreSNPLeafs.indexOf(
                          d.mRNA_id.split('_')[0]
                        )
                      } else {
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
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('bipartiteCol').offsetLeft +
                // - document.getElementById('heatmap').scrollLeft

                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                30 +
                'px'
            )
            .select('#value-phenos')
            .html('<strong>mRNA_id: </strong>' + mrna + '<br>')
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (d) {
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
                // return vis.dendroLeaves.indexOf(d.mRNA_id)
                // return sortingOrderArray.indexOf(d.mRNA_id)
                return vis.newSortwithAggregated.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('cx', 0)
              .attr('cy', function (d, i) {
                // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                // let row = sortingOrderArray.indexOf(d)
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })
              .attr('r', 2)
              // .style('fill', 'rgba(104, 195, 163, 0.5)')
              .style('fill', '#ccc')
              .call((enter) =>
                enter.transition(t_bipartite).attr('cx', vis.bipartiteWidth)
              ),
          (update) =>
            update
              .attr('label-r', function (d, i) {
                // return vis.dendroLeaves.indexOf(d.mRNA_id)
                // return sortingOrderArray.indexOf(d)
                return vis.newSortwithAggregated.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((update) =>
                update
                  .transition(t_bipartite)
                  .style('fill', '#ccc')
                  .attr('cy', function (d, i) {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

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
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
        })
        .on('contextmenu', function (event, i) {
          event.preventDefault()

          // console.log('CLICK NODE TARGET')

          // //Show the tooltip
          // d3.select('#popOverGroup').classed('hidden', false)
          // d3.select('#popOverBg').classed('hidden', false)

          // react on right-clicking
          let nodeAgg = d3.select(this).attr('mRNA_id')
          // console.log('mRNA_id', nodeAgg)

          let nodeAggArr = nodeAgg.split('-')
          // console.log('nodeAgg array: ', nodeAggArr)

          // console.log('vis.aggregaredRows', vis.aggregatedRows, vis.aggregatedSampleString)

          if (vis.aggregatedSampleString.includes(nodeAgg)) {
            // console.log('^^^ Expand node')

            let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
              (d) => d !== nodeAgg
            )

            vis.aggregatedRows = vis.aggregatedRows.filter(
              ({ mRNA_id }) => !nodeAggArr.includes(mRNA_id)
            )

            vis.nodesAggArray = vis.nodesAggArray.filter(
              (d) => !nodeAggArr.includes(d)
            )

            vis.aggrIndex = vis.aggrIndex.filter(
              (d) => vis.aggrIndex.indexOf(d) !== indexDel
            )

            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
              ({ mRNA_id }) => mRNA_id !== nodeAgg
            )

            vis.currentSortAll = vis.rowSorterCurrentAll
            // // // console.log('rowsorter current', vis.rowSorterCurrent)
            // // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

            //// debugger

            // vis.drawView()

            vis.drawHeatMap(vis.newSortwithAggregated)
            vis.drawPhenotypes(vis.newSortwithAggregated)
            vis.drawBipartite(vis.newSortwithAggregated)
          }
        })

      // filter data for links when core snp is loaded
      let dataSourceNodes = vis.dataPhenosSortedCurrent
      if (vis.showCoreSNP == true && vis.toggleButton == false) {
        dataSourceNodes = vis.dataPhenosSortedCurrent.filter(({ mRNA_id }) =>
          vis.getCoreSNPLeafs.includes(mRNA_id.split('_')[0])
        )
      }

      bipartiteGraph
        .selectAll('path.linksBp')
        .data(dataSourceNodes, (d) => d.mRNA_id) //dataMeta
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linksBp')
              .attr('label-r', function (d, i) {
                if (vis.toggleButton == true) {
                  return vis.dendroLeavesAll.indexOf(d.mRNA_id)
                } else {
                  // return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  if (vis.showCoreSNP == true) {
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0])
                  } else {
                    return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }
                }
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('d', function (d, i) {
                // //// console.log('d dendroLinks', d.mRNA_id.split('-'))

                return vis.drawLine(
                  vis.dendroLeavesAll.indexOf(d.mRNA_id),
                  vis.dendroLeavesAll.indexOf(d.mRNA_id)
                )
              })
              // .attr('stroke', 'rgba(255, 99, 71, 0.2)') //red
              // .attr('stroke', 'rgba(104, 195, 163, 0.5)') //grey
              .attr('stroke', 'rgba(192, 192, 192, 0.5)')
              .attr('stroke-width', '1px')
              .attr('fill', 'none')
              .call((enter) =>
                enter.transition(t_bipartite).attr('d', function (d, i) {
                  // if (vis.toggleButton == true){
                  //   // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                  //   // let row = sortingOrderArray.indexOf(d.mRNA_id)
                  //   let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                  //   return vis.drawLine(vis.dendroLeavesAll.indexOf(d.mRNA_id), row)

                  // }
                  // else{

                  //   // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                  //   // let row = sortingOrderArray.indexOf(d.mRNA_id)
                  //   let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                  //   return vis.drawLine(vis.dendroLeavesDefault.indexOf(d.mRNA_id), row)

                  // }

                  ///// NEW CODE /////
                  if (vis.toggleButton == true) {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    //// console.log('vis.dendroLeaves bipartite link update')
                    //// console.log('d dendroLinks', d, vis.aggregatedSampleString, vis.nodesAggArray, vis.nodesAggArray.includes(d.mRNA_id))
                    if (vis.nodesAggArray.includes(d.mRNA_id)) {
                      // // console.log(d.mRNA_id+' included in aggregated')
                      // find string with d.mrna
                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        // // console.log('aggregatedSampleString', vis.aggregatedSampleString)
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          // row = sortingOrderArray.indexOf(str)
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }

                      // row = sortingOrderArray.indexOf(vis.aggregatedSampleString)
                    }

                    return vis.drawLine(
                      vis.dendroLeavesAll.indexOf(d.mRNA_id),
                      row
                    )
                  } else {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {
                      // // console.log(d.mRNA_id+' included in aggregated')
                      // find string with d.mrna
                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        // // console.log('aggregatedSampleString', vis.aggregatedSampleString)
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          // row = sortingOrderArray.indexOf(str)
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }
                    }

                    // return vis.drawLine(vis.dendroLeavesDefault.indexOf(d.mRNA_id), row)
                    if (vis.showCoreSNP == true) {
                      // let start = d.mRNA_id.split('_')[0]
                      // let start_node = vis.getCoreSNPLeafs.filter(d => d.split('_')[0] == start)[0]
                      // console.log('start_node', start_node)

                      return vis.drawLine(
                        vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0]),
                        row
                      )
                      // return vis.drawLine(vis.getCoreSNPLeafs.indexOf(d.mRNA_id), row)
                    } else {
                      return vis.drawLine(
                        vis.dendroLeavesDefault.indexOf(d.mRNA_id),
                        row
                      )
                    }
                  }
                })
              ),
          (update) =>
            update
              .attr('stroke', 'rgba(192, 192, 192, 0.5)')
              .attr('label-r', function (d) {
                if (vis.toggleButton == true) {
                  return vis.dendroLeavesAll.indexOf(d.mRNA_id)
                } else {
                  if (vis.showCoreSNP == true) {
                    return vis.getCoreSNPLeafs.indexOf(d.mRNA_id)
                  } else {
                    return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                  }

                  // return vis.dendroLeavesDefault.indexOf(d.mRNA_id)
                }
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((update) =>
                update.transition(t_bipartite).attr('d', function (d, i) {
                  if (vis.toggleButton == true) {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    //// console.log('vis.dendroLeaves bipartite link update')
                    //// console.log('d dendroLinks', d, vis.aggregatedSampleString, vis.nodesAggArray, vis.nodesAggArray.includes(d.mRNA_id))
                    if (vis.nodesAggArray.includes(d.mRNA_id)) {
                      // // console.log(d.mRNA_id+' included in aggregated')
                      // find string with d.mrna
                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        // // console.log('aggregatedSampleString', vis.aggregatedSampleString)
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          // row = sortingOrderArray.indexOf(str)
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }

                      // row = sortingOrderArray.indexOf(vis.aggregatedSampleString)
                    }

                    return vis.drawLine(
                      vis.dendroLeavesAll.indexOf(d.mRNA_id),
                      row
                    )
                  } else {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {
                      // // console.log(d.mRNA_id+' included in aggregated')
                      // find string with d.mrna
                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        // // console.log('aggregatedSampleString', vis.aggregatedSampleString)
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          // row = sortingOrderArray.indexOf(str)
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }
                    }

                    // return vis.drawLine(vis.dendroLeavesDefault.indexOf(d.mRNA_id), row)
                    if (vis.showCoreSNP == true) {
                      // let start = d.mRNA_id.split('_')[0]
                      // let start_node = vis.getCoreSNPLeafs.filter(d => d.split('_')[0] == start)[0]
                      // console.log('start_node', start_node)

                      return vis.drawLine(
                        vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0]),
                        row
                      )
                      // return vis.drawLine(vis.getCoreSNPLeafs.indexOf(d.mRNA_id), row)
                    } else {
                      return vis.drawLine(
                        vis.dendroLeavesDefault.indexOf(d.mRNA_id),
                        row
                      )
                    }
                  }
                })
              ),
          (exit) =>
            exit.call((exit) =>
              exit
                .transition(t_bipartite)
                .attr('stroke', 'rgba(255, 99, 71, 0.2)')
                .remove()
            )
        )
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
        })

      // console.log('[DONE] drawing bipartite')
      //// console.log('time drawing bipartite', (new Date().getTime() - starttime.getTime())/1000)
    },
    drawAnnotations() {
      let starttime = new Date()
      // console.log('drawing annotations...')

      let vis = this

      //// make annotations plot
      let colAnnotations = this.colAnnotationsGroup
      const t_annot = colAnnotations.transition().duration(vis.transitionTime)

      colAnnotations
        .selectAll('rect.annotation')
        .data(vis.xLabelsNames, (d) => d)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('height', vis.cellSize - 0.5)
              .attr('width', vis.cellSize - 0.5)
              // .attr('fill', 'rgba(128,128,128,1)')
              .attr('fill', 'lightgrey')
              .attr('class', 'annotation cell-border')
              // .attr('fill', 'darkgrey')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + i * vis.cellSize + ', 2)'
              })
              // .attr('dx', '.8em')
              // .attr('dy', '.2em')
              .attr('y', -30)
              .attr('x', 0)
              // .text((d) => d)
              .attr('id', function (d) {
                return 'colLabel_' + vis.xLabelsNames.indexOf(d)
              })
              .attr('label-c', function (d) {
                return vis.xLabelsNames.indexOf(d)
              })
              .call((enter) => enter.transition(t_annot).attr('y', 0)),
          (update) =>
            update
              // .attr('fill', 'rgba(128,128,128,1)')
              .attr('fill', 'lightgrey')

              .attr('y', 0)
              .call((update) =>
                update.transition(t_annot).attr('transform', function (d, i) {
                  return 'translate(' + i * vis.cellSize + ', 2)'
                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_annot).attr('y', 30).remove())
        )

      // console.log('[DONE] drawing annotations')
      //// console.log('time drawing annotations', (new Date().getTime() - starttime.getTime())/1000)

      //// make visual ref plot
      let visRef = this.visualRefGroup
      const t_visref = visRef.transition().duration(vis.transitionTime)

      // console.log(vis.visualRefData)

      visRef
        .selectAll('rect.visRef')
        .data(vis.visualRefData, (d) => d.index)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('height', vis.cellSize - 0.5)
              .attr('width', vis.cellSize - 0.5)
              .attr('fill', function (d) {
                if (vis.visualRefSelected == 'none') {
                  return '#878787'
                } else {
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
              .attr('class', 'visRef cell-border')
              // .attr('fill', 'darkgrey')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + i * vis.cellSize + ', 2)'
              })
              // .attr('dx', '.8em')
              // .attr('dy', '.2em')
              .attr('y', -30)
              .attr('x', 0)
              // .text((d) => d)
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
                if (vis.visualRefSelected == 'none') {
                  return '#878787'
                } else {
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
                  return 'translate(' + i * vis.cellSize + ', 2)'
                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_visref).attr('y', 30).remove())
        )
    },
    drawHeatMap(sortingOrderArray) {
      let starttime = new Date()
      // console.log('drawing heatmap...')
      //// console.log('sortingOrderArray: ', sortingOrderArray)
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
              // .attr('fill', 'rgba(104, 195, 163, 1)')
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
                // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                // let row = sortingOrderArray.indexOf(d)
                let row = vis.newSortwithAggregated.indexOf(d)

                return row * vis.cellSize
              })
              .text(function (d) {
                if (d.split('-').length > 1) {
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
                // //// console.log('updated ylabels', yLabelsNames.indexOf(d))
                return vis.dendroLeaves.indexOf(d)
              })
              .attr('mRNA_id', function (d) {
                return d
              })
              .call((update) =>
                update.transition(t_rows).attr('y', function (d, i) {
                  // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                  // let row = sortingOrderArray.indexOf(d)
                  let row = vis.newSortwithAggregated.indexOf(d)

                  return row * vis.cellSize
                })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_rows).attr('x', 30).remove())
        )
        // .on('click', function (event, d) {
        //     if (event.ctrlKey) {
        //       alert("The CTRL key was pressed!");
        //     } else {
        //       alert("The CTRL key was NOT pressed!");
        //     }
        // })
        // .on("contextmenu", function (event, i) {
        //   event.preventDefault();
        //   if (event.ctrlKey) {
        //       alert("The CTRL key was pressed!");
        //     } else {
        //       alert("The CTRL key was NOT pressed!");
        //     }

        // })

        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
        })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();

            if (
              d3.select(this).attr('class') ==
              'rowLabel text-selection text-highlight'
            ) {
              // console.log('already selected --> deselect')
              d3.select(this).classed('text-selection', false)
            } else {
              d3.select(this).classed('text-selection', true)
              // console.log('d mousedown row', d)
              vis.selectionLst.push(d)
              // console.log('selection', vis.selectionLst)
              // // HIER WAS IK

              d3.selectAll('.strain')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('text-selection', true)

              d3.selectAll('.specie')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('text-selection', true)

              d3.selectAll('.vir')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('pheno-node-selection', true)

              d3.selectAll('.cell')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('cell-selection', true)
            }
            // console.log('alt key pressed!')

            // let items = d3.selectAll('.text-selection').attr('mRNA_id')
            // // console.log('items', items)

            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the labels " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          }

          if (!event.altKey) {
            const brush_elm = rowLabels.select('.rowBrush > .overlay').node()
            const brush_selection = rowLabels
              .select('.rowBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            // console.log('mousedown rowLabels', brush_elm, brush_selection, bbox)
            // console.log('event', event, 'brush_selection.style.display', brush_selection.style.display)
            // console.log('event.pageX', event.pageX, 'event.pageY', event.pageY)
            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              // console.log('inside');
              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

            // if ( brush.empty() ||
            //     (e[0][0] > d[0] || d[0] > e[1][0]
            //     || e[0][1] > d[1] || d[1] > e[1][1] )
            // ) {
            //   brush.extent([p,p]);
            // } else {
            //   d3.select(this).classed('extent', true);
            // }
          }
        })

      //// make row labels aggregated
      // let rowsAggr = this.rowAggrGroup
      let rowsAggr = this.rowLabelGroup
      const t_rows_aggr = rowsAggr.transition().duration(vis.transitionTime)

      // let dataRowAggr = vis.yLabelsNames.filter(function (d) {d.split('-').length > 1})
      // // console.log('dataRowAggr', dataRowAggr, vis.aggregatedSampleString)

      // // debugger
      rowsAggr
        .selectAll('rect.rowAggr')
        .data(vis.aggregatedSampleString, (d) => d)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('height', vis.cellSize - 1)
              .attr('width', function (d) {
                return (
                  (vis.rowLabelWidth / vis.numYLabelsAll) * d.split('-').length
                )
              })

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
            update.call((update) =>
              update.transition(t_rows_aggr).attr('y', function (d, i) {
                let row = vis.newSortwithAggregated.indexOf(d)

                return row * vis.cellSize
              })
            ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) =>
                exit.transition(t_rows_aggr).attr('x', 30).remove()
              )
        )
        .on('contextmenu', function (event, i) {
          event.preventDefault()

          // console.log('CLICK BAR')

          // //Show the tooltip
          // d3.select('#popOverGroup').classed('hidden', false)
          // d3.select('#popOverBg').classed('hidden', false)

          // expand group

          // react on right-clicking
          let nodeAgg = d3.select(this).attr('mRNA_id')
          // console.log('mRNA_id', nodeAgg)

          let nodeAggArr = nodeAgg.split('-')
          // console.log('nodeAgg array: ', nodeAggArr)

          // console.log('vis.aggregaredRows', vis.aggregatedRows, vis.aggregatedSampleString)

          if (vis.aggregatedSampleString.includes(nodeAgg)) {
            // console.log('^^^ Expand node')

            let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
              (d) => d !== nodeAgg
            )

            vis.aggregatedRows = vis.aggregatedRows.filter(
              ({ mRNA_id }) => !nodeAggArr.includes(mRNA_id)
            )

            vis.nodesAggArray = vis.nodesAggArray.filter(
              (d) => !nodeAggArr.includes(d)
            )

            vis.aggrIndex = vis.aggrIndex.filter(
              (d) => vis.aggrIndex.indexOf(d) !== indexDel
            )

            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
              ({ mRNA_id }) => mRNA_id !== nodeAgg
            )

            vis.currentSortAll = vis.rowSorterCurrentAll
            // // // console.log('rowsorter current', vis.rowSorterCurrent)
            // // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

            //// debugger

            // vis.drawView()

            vis.drawHeatMap(vis.newSortwithAggregated)
            vis.drawPhenotypes(vis.newSortwithAggregated)
            vis.drawBipartite(vis.newSortwithAggregated)
          }
        })
        .on('mouseover', function (event, d) {
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
          //Update the tooltip position and value

          let values = d.split('-')
          let myString = ''

          let groupNrSelected = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')

            // console.log('vis.aggregatedRows', vis.aggregatedRows, vis.selectedGroups)

            let groupSelected = vis.$store.getters.getGroupsSelected.filter(
              ({ mRNA_id }) => values.includes(mRNA_id)
            )
            let groupArr = d3.map(groupSelected, (d) => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]
            // console.log('groupNr', groupNrSelected)
          }

          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('bipartiteCol').offsetLeft +
                document.getElementById('bipartiteCol').offsetWidth * 0.9 +
                // - document.getElementById('heatmap').scrollLeft

                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                30 +
                'px'
            )
            .select('#value-phenos')
            .html(
              '<strong>group: </strong>' +
                groupNrSelected +
                '<br> <strong>mRNA_id: </strong>' +
                // d +
                //   '<br>'
                '<br>' +
                myString
            )
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (d) {
          return d3.select('#tooltip-phenos').classed('hidden', true)
        })
        .on('mousedown', function (event, d) {
          if (event.altKey) {
            // event.preventDefault();
            if (
              d3.select(this).attr('class') ==
              'rowAggr aggr-selection aggr-highlight'
            ) {
              // console.log('already selected --> deselect')
              d3.select(this).classed('aggr-selection', false)
            } else {
              d3.select(this).classed('aggr-selection', true)
              d3.selectAll('.strain')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('text-selection', true)

              d3.selectAll('.specie')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('text-selection', true)

              d3.selectAll('.vir')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('pheno-node-selection', true)

              d3.selectAll('.cell')
                .filter(function () {
                  return d3.select(this).attr('mRNA_id') == d // filter by single attribute
                })
                .classed('cell-selection', true)
            }
            // console.log('alt key pressed!')

            // let items = d3.selectAll('.text-selection').attr('mRNA_id')
            // // console.log('items', items)

            let altSelection = []
            d3.selectAll('.aggr-selection').each(function (d, i) {
              // console.log("The mrna of aggr rect " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              // console.log("The mrna of the text label " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              // console.log("The mrna of the node " + i + " is " + d3.select(this).attr("mRNA_id"))
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
            // console.log('selected from brush:', vis.selectionGroups, vis.altSelection)
          }

          if (!event.altKey) {
            const brush_elm = rowsAggr.select('.rowBrush > .overlay').node()
            const brush_selection = rowsAggr
              .select('.rowBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            // console.log('mousedown rowLabels', brush_elm, brush_selection, bbox)
            // console.log('event', event, 'brush_selection.style.display', brush_selection.style.display)
            // console.log('event.pageX', event.pageX, 'event.pageY', event.pageY)
            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              // console.log('inside');
              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)
          }
        })

      rowsAggr
        .selectAll('text.rowAggrLabel')
        .data(vis.aggregatedSampleString, (d) => d)
        .join(
          (enter) =>
            enter
              .append('text')
              // .attr('fill', 'rgba(104, 195, 163, 1)')
              .attr('fill', function (d) {
                let nr = d.split('-').length
                if (nr > vis.numYLabelsAll / 2) {
                  return 'white'
                } else {
                  return '#878787'
                }
              })
              .attr('class', 'rowAggrLabel')
              .attr('font-weight', 'normal')
              .attr('font-size', '9px')
              .style('text-anchor', function (d) {
                let nr = d.split('-').length
                if (nr > vis.numYLabelsAll / 2) {
                  return 'end'
                } else {
                  return 'start'
                }
              })
              .text(function (d) {
                return d.split('-').length
              })
              .attr('transform', function (d) {
                let widthBar
                let nr = d.split('-').length
                if (nr > vis.numYLabelsAll / 2) {
                  widthBar =
                    (vis.rowLabelWidth / vis.numYLabelsAll) *
                      d.split('-').length -
                    8
                } else {
                  widthBar =
                    (vis.rowLabelWidth / vis.numYLabelsAll) *
                      d.split('-').length -
                    5
                }
                return 'translate(' + widthBar + ',' + vis.cellSize / 1.4 + ')'
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
            update.call((update) =>
              update.transition(t_rows_aggr).attr('y', function (d, i) {
                let row = vis.newSortwithAggregated.indexOf(d)

                return row * vis.cellSize
              })
            ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) =>
                exit.transition(t_rows_aggr).attr('x', 30).remove()
              )
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
              // .attr('fill', 'rgba(104, 195, 163, 1)')
              .attr('fill', 'darkgrey')
              .attr('class', 'colLabel')
              // .attr('fill', 'darkgrey')
              .style('text-anchor', 'left')
              // .attr('transform', function (d, i) {
              //   return 'translate(' + i * vis.cellSize + ', 2) rotate(-45)'
              // })
              .attr('transform', function (d, i) {
                return (
                  'translate(' + +(i + 1) * vis.cellSize + ', 2) rotate(-90)'
                )
              })

              .attr('dx', '.8em')
              // .attr('dy', '.2em')
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
                // update.transition(t).attr('x', (d, i) => i * cellSize)
                update
                  .transition(t_cols)
                  // .attr('transform', function (d, i) {
                  //   return 'translate(' + i * vis.cellSize + ', 2) rotate(-45)'
                  // })
                  .attr('transform', function (d, i) {
                    return (
                      'translate(' +
                      +(i + 1) * vis.cellSize +
                      ', 2) rotate(-90)'
                    )
                  })
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t_cols).attr('y', 30).remove())
        )
        .on('click', function (d, i) {
          // console.log('[CLICK] position: ', i)

          let clickedValue = i

          d3.select('#rowSorting').property('selectedIndex', 4).node().focus()

          // vis.colSortOrder = ! vis.colSortOrder
          vis.boolSorted.position = !vis.boolSorted.position
          if (i !== vis.currentSortRow) {
            vis.boolSorted.position = false // start with best sorting
          }
          sortByValues(i, vis.colSortOrder)

          // vis.rowSort = d3.select('#rowSorting').property('value') // set rowsort to custom position
          //// console.log('vis.Rowsort from click', vis.rowSort)

          d3.selectAll('.colLabel').classed('text-selected', function (d) {
            // //// console.log('i', i, 'd', d, vis.rowSort)
            return d == clickedValue
          })
          d3.selectAll('.phenoLabel').classed('text-selected', false)

          vis.$store.dispatch('setAccessionsSort', vis.rowSort) // update store
          //// console.log('store rowsort', vis.$store.getters.accessionsSort)
        })
        .on('mouseover', function (d) {
          // d3.select(this).classed('text-normal', false)
          d3.select(this).classed('text-hover', true)

          var idr = d3.select(this).attr('label-c') // row

          // d3.selectAll('.cell').classed('cell-highlight-col', function (l, li) {

          //   return vis.xLabelsNames.indexOf(l.position) == parseInt(idr)

          // })
        })
        .on('mouseout', function (d) {
          d3.select(this).classed('text-hover', false)
          d3.selectAll('.cell').classed('cell-highlight-col', false)
        })

      //// make matrix
      // var svgPattern = d3.select("body").append("svg");
      // svgPattern.append('defs')
      //         .append('pattern')
      //           .attr('id', 'diagonalHatch')
      //           .attr('patternUnits', 'userSpaceOnUse')
      //           .attr('width', 4)
      //           .attr('height', 4)
      //         .append('path')
      //           .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      //           .attr('stroke', '#000000')
      //           .attr('stroke-width', 1)

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
              .attr('height', vis.cellSize - 0.5)
              .attr('width', vis.cellSize - 0.5)
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
                  return 'cell cell-border cr' + idr + ' cc' + idc
                } else {
                  return 'cell cr' + idr + ' cc' + idc
                }
              })
              .attr('x', function (d, i) {
                let c = d3.select(this).attr('data-c')
                return c * vis.cellSize + 0.5
              })
              .attr('y', function (d) {
                // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                // let row = sortingOrderArray.indexOf(d.mRNA_id)
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize + 0.5
              })

              .call((enter) =>
                enter.transition(t_cells).style('fill', function (d) {
                  let posRef = d.position
                  let nucVR = 'dummy'
                  if (vis.visualRefSelected !== 'none') {
                    nucVR = vis.visualRefData.filter(function (d) {
                      return d.position == posRef //make interactive
                    })[0].nucleotide
                  }
                  let nucVRlist = nucVR.split('|')
                  if (
                    d.nucleotide == nucVR &&
                    d.mRNA_id !== vis.visualRefSelected
                  ) {
                    return '#878787'
                  }
                  if (
                    nucVRlist.includes(d.nucleotide) &&
                    d.mRNA_id !== vis.visualRefSelected
                  ) {
                    return '#878787'
                  }

                  // // console.log('position cell', d.position, d.nucleotide, refPos, posRef, d.mRNA_id, nucVR)

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
                  // if (d.nucleotide == nucVR){
                  //   return '#878787'
                  // }
                  return vis.colorScaleNuc(d.nucleotide)
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
                  return 'cell cell-border cr' + idr + ' cc' + idc
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
                if (vis.visualRefSelected !== 'none') {
                  nucVR = vis.visualRefData.filter(function (d) {
                    return d.position == posRef //make interactive
                  })[0].nucleotide
                }
                let nucVRlist = nucVR.split('|')
                if (
                  d.nucleotide == nucVR &&
                  d.mRNA_id !== vis.visualRefSelected
                ) {
                  return '#878787'
                }
                if (
                  nucVRlist.includes(d.nucleotide) &&
                  d.mRNA_id !== vis.visualRefSelected
                ) {
                  return '#878787'
                }
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

                if (
                  d.nucleotide == nucVR &&
                  d.mRNA_id !== vis.visualRefSelected
                ) {
                  return '#878787'
                }

                // if (d.nucleotide == nucVR){
                //   return '#878787'
                // }

                return vis.colorScaleNuc(d.nucleotide)
              })
              .call((update) =>
                update
                  .transition(t_cells)
                  .attr('x', function (d, i) {
                    let c = d3.select(this).attr('data-c')
                    return c * vis.cellSize + 0.5
                  })
                  .attr('y', function (d) {
                    // let sortingOrderArray = vis.rowSorters[vis.rowSort]
                    // let row = sortingOrderArray.indexOf(d.mRNA_id)
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    return row * vis.cellSize + 0.5
                  })
              ),
          (exit) =>
            exit.call((exit) =>
              exit
                .transition(t_cells)
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
          // on mouseover heatmap rect
          // get row, column and value of this rect
          var idr = d3.select(this).attr('data-r') // row
          var idc = d3.select(this).attr('data-c') // column
          var value = d3.select(this).attr('data-value') // data value
          let mrna = d3.select(this).attr('mRNA_id')

          vis.highlightRow(mrna)

          // highlight this rect

          // d3.select(this).classed('cell-highlight', false)
          // d3.select(this).classed('cell-selection', false)
          d3.select(this).classed('cell-hover', true)
          // d3.select(this).classed('cell-border',false)

          d3.selectAll('.colLabel').classed('text-highlight', function (c, ci) {
            // return ci == xLabelsNames.indexOf(d.year)
            return ci == idc
          })

          let values = d.mRNA_id.split('-')
          let myString = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')
          }

          let pos = d.position
          let mRNA_id_arr = mrna.split('-')

          let valuesNucl = vis.data_heatmap.filter(function (d) {
            return d['position'] == pos && mRNA_id_arr.includes(d['mRNA_id'])
          })
          console.log('valuesNucl', valuesNucl)

          let allNucs = d3.map(valuesNucl, function (d) {
            return d.nucleotide
          })
          console.log('valuesNucl', allNucs)

          let counts = {}

          for (let num of allNucs) {
            counts[num] = counts[num] ? counts[num] + 1 : 1
          }

          let nucArr = d.nucleotide.split('|')

          let myStringCounts = ''
          for (let i = 0; i < nucArr.length; i++) {
            myStringCounts =
              myStringCounts +
              (nucArr[i] + ': ' + '<i>' + counts[nucArr[i]] + '</i>' + ', ')
          }

          //Update the tooltip position and value
          d3.select('#tooltip')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft -
                document.getElementById('heatmap').scrollLeft +
                // - 125  // width tooltip/2
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop +
                // + 80
                'px'
            )
            .select('#value')
            .html(
              '<strong>base: </strong>' +
                myStringCounts +
                '<br>' +
                '<strong>position: </strong>' +
                d.position +
                '<br>' +
                '<strong>mRNA_id: </strong>' +
                '<br>' +
                myString
              // +
              // '<br>'
              // +
              // '<strong>row-col-idx:</strong>' +
              // idr +
              // // yLabelsNames.indexOf(d.mRNA_id) +
              // ',' +
              // idc
              // // xLabelsNames.indexOf(d.pos) +
              // xLabelsNames.indexOf(d.position)
              // '<br>' +
              // '<strong>cell-xy:</strong>' +
              // this.x.baseVal.value +
              // ', ' +
              // this.y.baseVal.value
            )
          //Show the tooltip
          d3.select('#tooltip').classed('hidden', false)
        })
        .on('mouseout', function (d, i) {
          // on mouseout rect
          d3.select(this).classed('cell-hover', false)
          d3.select(this).classed('cell-border', true)

          d3.selectAll('.rowLabel').classed('text-highlight', false)
          d3.selectAll('.colLabel').classed('text-highlight', false)
          // d3.selectAll('.rowLabel').classed('text-normal', true)
          // d3.selectAll('.colLabel').classed('text-normal', true)
          d3.select('#tooltip').classed('hidden', true)
        })

      d3.selectAll('.cell').classed('cell-selection', function (l, li) {
        return vis.childsSelected.includes(l.mRNA_id)
      })

      // Change ordering of cells
      function sortByValues(i, sortOrder) {
        let dataColSelected = []
        let dataColSelectedAll = []
        // //// console.log('current sorting: ', vis.rowSorterCurrent)
        //// console.log('current position', i)

        let dataSeqPos = vis.dataSequencesFilteredAll.filter(
          ({ position }) => position == i
          //  mRNA_id == this.currentSortingOrder[i]
        )
        //// console.log('data sequences this pos ALL ROWS:', dataSeqPos)

        d3.selectAll('.cc' + vis.xLabelsNames.indexOf(i)).filter(function (d) {
          dataColSelected.push({ mRNA_id: d.mRNA_id, nucleotide: d.nucleotide })
        })

        for (let i = 0; i < vis.numYLabels; i++) {
          let mrna = dataColSelected[i]['mRNA_id']
          // let idx = vis.rowSorterCurrent.indexOf(mrna)
          let idx = vis.rowSorterCurrentAll.indexOf(mrna)
          dataColSelected[i]['idx'] = idx
        }
        dataColSelected = dataColSelected.sort(function (a, b) {
          //sort data before index computation!!
          return a.idx - b.idx
        })
        //// console.log('values mrna and nuc and index: ', dataColSelected)

        for (let i = 0; i < dataSeqPos.length; i++) {
          let mrna = dataSeqPos[i]['mRNA_id']
          let idx = vis.rowSorterCurrentAll.indexOf(mrna)
          dataColSelectedAll.push({
            idx: idx,
            mRNA_id: dataSeqPos[i]['mRNA_id'],
            nucleotide: dataSeqPos[i]['nucleotide'],
          })
        }
        dataColSelectedAll = dataColSelectedAll.sort(function (a, b) {
          //sort data before index computation!!
          return a.idx - b.idx
        })
        //// console.log('values ALL mrna and nuc and index: ', dataColSelectedAll)

        let categoriesColSelected = vis.getCategories(
          dataColSelected,
          'nucleotide'
        )

        let mRNAs = vis.getArraySortedCategorical(
          dataColSelected,
          categoriesColSelected,
          'nucleotide',
          'median'
        )

        //// console.log('mRNA array position sort: ', mRNAs)

        let categoriesColSelectedAll = vis.getCategories(
          dataColSelectedAll,
          'nucleotide'
        )

        let mRNAsAll = vis.getArraySortedCategorical(
          dataColSelectedAll,
          categoriesColSelectedAll,
          'nucleotide',
          'median'
        )

        vis.currentSort = mRNAs
        vis.currentSortAll = mRNAsAll

        // console.log('mRNA array position sort: ', mRNAsAll)
        if (vis.boolSorted.position == true) {
          let reverse_mrnas_all = _.cloneDeep(mRNAsAll)
          let reverse_mrnas = _.cloneDeep(mRNAs)
          reverse_mrnas_all.reverse()
          reverse_mrnas.reverse()

          vis.currentSort = reverse_mrnas
          vis.currentSortAll = reverse_mrnas_all
        }

        //// console.log('rowsort', vis.rowSort)
        vis.rowSort = 'position'
        vis.rowSortSteps.push(vis.rowSort)

        vis.drawView()

        // reverse order again for update
        if (vis.boolSorted.position == true) {
          vis.currentSort = mRNAs
          vis.currentSortAll = mRNAsAll
        }
        vis.currentSortRow = i
      }

      // console.log('[DONE] drawing heatmap')
      //// console.log('time drawing heatmap', (new Date().getTime() - starttime.getTime())/1000)
    },
    highlightRow(mrna) {
      d3.selectAll('.nodesSource').classed('node-highlight', function (l, li) {
        // return l.mRNA_id == mrna
        return mrna.split('-').includes(l.mRNA_id)
      })

      d3.selectAll('.linksBp').classed('link-highlight', function (l, li) {
        return mrna.split('-').includes(l.mRNA_id)
      })

      d3.selectAll('.nodesTarget').classed('node-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        //   return l.mRNA_id == mrna
        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.rowLabel').classed('text-highlight', function (l, li) {
        if (l.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l
        }

        //   return mrna == l
        return l.split('-').includes(mrna)
      })

      d3.selectAll('.rowAggr').classed('aggr-highlight', function (l, li) {
        return mrna == l
      })

      d3.selectAll('.cell').classed('cell-highlight', function (l, li) {
        // return l.mRNA_id == mrna

        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.vir').classed('node-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }
        // return l.mRNA_id == mrna
        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.specie').classed('text-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        // return l.mRNA_id == mrna
        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.strain').classed('text-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        // return l.mRNA_id == mrna
        return l.mRNA_id.split('-').includes(mrna)
      })
    },
    getFormValues() {
      //// console.log('getting values from select form')
      var selected = []
      for (var option of document.getElementById('dendro-select').options) {
        if (option.selected) {
          selected.push(option.value)
        }
      }
      //// console.log('selected items', selected)

      return selected
    },
    getDendroLeavesUpdated(dataDendro) {
      //  assigns the data to a hierarchy using parent-child relationships
      var nodesDendro = d3.hierarchy(dataDendro, function (d) {
        return d.children
      })
      // //// console.log('nodes dendro', nodesDendro.leaves())
      let nodesArray = nodesDendro.leaves()
      let leafNames = []
      nodesArray.forEach((e) => {
        // //// console.log(e.data.name);
        leafNames.push(e.data.name)
      })
      // //// console.log('leafNames', leafNames)
      return leafNames //.reverse()
    },
    toggleLinkDendro() {
      let vis = this

      if (vis.toggleButton == true) {
        //// console.log('button toggle dashed - unlink tree')

        vis.buttonType = 'dashed'
        vis.toggleButton = false
        //// console.log('vis.toggleButton', vis.toggleButton)
        //// console.log('vis.linkedDendro', vis.linkedDendro)
        vis.linkedDendro = 'dendro-default'

        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) //vis.rowSorterCurrent
      } else {
        //// console.log('button toggle primary - link tree')

        vis.buttonType = 'primary'
        vis.toggleButton = true
        //// console.log('vis.toggleButton', vis.toggleButton)
        // //// console.log('vis.linkedDendro', vis.linkedDendro)
        vis.linkedDendro = 'dendro-custom'
        let sortOrder = vis.dendroLeavesCustom

        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) //vis.rowSorterCurrent
      }
    },
    toggleLinkCoreSNP() {
      let vis = this

      if (vis.toggleButton == false) {
        //// console.log('button toggle primary - link tree')

        vis.drawDendro()
        vis.drawBipartite(vis.newSortwithAggregated) //vis.rowSorterCurrent
      }
    },
    drawLine(sourceNodeIds, targetNodeIds) {
      let vis = this

      return d3.linkHorizontal()({
        source: [2, sourceNodeIds * vis.cellSize],
        target: [vis.bipartiteWidth, targetNodeIds * vis.cellSize],
      })
    },
    toggleGroupCreate() {
      let vis = this
      console.log('hi from group create')
      console.log('vis.aggregatedRows', vis.aggregatedRows)
      console.log('vis.altSelection', vis.altSelection) // alt selection
      console.log('vis.childsSelected', vis.childsSelected) // dendro selection

      let selection = vis.selectionGroups

      console.log('selection', selection)

      let brushSelection = []
      if (selection !== null) {
        let selectedRegion = [
          Math.round(selection[0]),
          Math.round(selection[1]),
        ]
        // console.log('selection rowLabels', selectedRegion)
        // console.log('current sorting order', vis.newSortwithAggregated)
        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)
        // let nodeAggArr = []
        for (let i = 0; i < rangeSlice.length; i++) {
          brushSelection = brushSelection.concat(rangeSlice[i].split('-'))
        }
        console.log('selected items with brush', brushSelection)
      }

      // 1. get all current selected elements
      let allSelected = []
      allSelected = Array.from(
        new Set(brushSelection.concat(vis.altSelection, vis.childsSelected))
      )

      // get most recent file from store
      vis.selectedGroups = vis.$store.getters.getGroupsSelected
      console.log('vis.selectedGroups from getter', vis.selectedGroups)

      // delete group if items in new selection
      let group_del = vis.selectedGroups.filter(function (d) {
        return allSelected.includes(d.mRNA_id)
      })
      let color_del = d3.map(group_del, function (d) {
        return d['color']
      })
      let group_nr_del = d3.map(group_del, function (d) {
        return d['group']
      })
      let colorsDel = [...new Set(color_del)]
      let groupsDel = [...new Set(group_nr_del)]

      console.log('colorsDel', colorsDel)
      console.log('groupsDel', groupsDel)

      if (colorsDel.length > 0) {
        // re append colors
        vis.colorsGroups = [...vis.colorsGroups.concat(colorsDel)]

        for (let i = 0; i < colorsDel.length; i++) {
          let color = colorsDel[i]
          d3.selectAll('.rowLabel').classed('group-selection-' + color, false)
          d3.selectAll('.linksBp').classed('group-selection-' + color, false)
          d3.selectAll('.nodesSource').classed(
            'group-selection-' + color,
            false
          )
          d3.selectAll('.nodesTarget').classed(
            'group-selection-' + color,
            false
          )
          d3.selectAll('.specie').classed('group-selection-' + color, false)
          d3.selectAll('.vir').classed('group-selection-' + color, false)
          d3.selectAll('.strain').classed('group-selection-' + color, false)
        }
      }
      console.log('vis.colorsGroups', vis.colorsGroups)

      vis.selectedGroups = vis.selectedGroups.filter(function (d) {
        return !colorsDel.includes(d.color)
      })

      let color = vis.colorsGroups.shift()

      let nr
      for (let i = 0; i < allSelected.length; i++) {
        nr = vis.counter
        vis.selectedGroups.push({
          group: nr,
          mRNA_id: allSelected[i],
          color: color,
          checkedColor: true,
          checkedCollapse: false,
        })
      }
      vis.counter = vis.counter + 1

      console.log('all selected items with group nr', vis.selectedGroups)
      this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

      // 2. assign color and make classes
      var styleText = document.createElement('style')
      styleText.type = 'text/css'
      styleText.innerHTML =
        'text.group-selection-' +
        color +
        ' { fill: ' +
        color +
        ';   font-weight: bold; }'

      document.getElementsByTagName('head')[0].appendChild(styleText)

      var styleLinks = document.createElement('style')
      styleLinks.type = 'text/css'
      styleLinks.innerHTML =
        'path.group-selection-' +
        color +
        ' { stroke: ' +
        color +
        '; z-index: 2000;}'

      document.getElementsByTagName('head')[0].appendChild(styleLinks)

      var styleNodePheno = document.createElement('style')
      styleNodePheno.type = 'text/css'
      styleNodePheno.innerHTML =
        'circle.group-selection-' + color + ' { stroke: ' + color + '; }'

      document.getElementsByTagName('head')[0].appendChild(styleNodePheno)

      var styleRowAggr = document.createElement('style')
      styleRowAggr.type = 'text/css'
      styleRowAggr.innerHTML =
        'rect.group-selection-' + color + ' { stroke: ' + color + '; }'

      document.getElementsByTagName('head')[0].appendChild(styleRowAggr)

      // always collapse group after created
      let nodeAggArr = allSelected.sort()
      let nodeAgg = allSelected.sort().join('-')

      const checkAlreadyAggr = nodeAggArr.some((r) =>
        vis.nodesAggArray.includes(r)
      )

      if (checkAlreadyAggr) {
        vis.visualRefSelected = 'none' //!! important

        let groupDel
        groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )

        console.log('contains group that are already aggregated', groupDel)

        // console.log('samples to delete', groupDel)
        let indexDel = d3.map(groupDel, function (d) {
          return d['group']
        })

        indexDel = [...new Set(indexDel)][0]

        console.log('indexDel; groupNrs to delete', indexDel, groupsDel)

        let samplesDel = []
        let indecesDel = []
        let indexVals = [] // IMPORTANT!!!

        for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
          let arr = vis.aggregatedSampleString[i].split('-')

          const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
          // // console.log('find sample name to delete', checkAlreadyAggr, vis.aggregatedSampleString[i])
          if (checkAlreadyAggr) {
            samplesDel.push(vis.aggregatedSampleString[i])
            indecesDel.push(
              vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i])
            )
            indexVals.push(vis.aggrIndex[i])
          }
        }

        console.log('samplesDel', samplesDel)
        console.log('indecesDel', indecesDel)
        console.log('indexVals', indexVals)

        for (let i = 0; i < samplesDel.length; i++) {
          let nodeDel = samplesDel[i]
          let childsDel = samplesDel[i].split('-')
          let indexDel = indecesDel[i]

          console.log('nodeDel', nodeDel)
          console.log('indexDel', indexDel)

          vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
            (d) => d !== nodeDel
          )

          vis.aggregatedRows = vis.aggregatedRows.filter(
            ({ mRNA_id }) => !childsDel.includes(mRNA_id)
          )

          vis.nodesAggArray = vis.nodesAggArray.filter(
            (d) => !childsDel.includes(d)
          )

          vis.aggrIndex = vis.aggrIndex.filter((d) => !indexVals.includes(d))

          // vis.aggrIndex = vis.aggrIndex.filter((d) => ! indecesDel.includes(vis.aggrIndex.indexOf(d)))

          vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
            ({ mRNA_id }) => mRNA_id !== nodeDel
          )
        }

        // vis.aggrIndex = vis.aggrIndex.filter(n => ! indexVals.includes(n))// IMPORTANT!!!

        console.log(' vis.aggregatedSampleString', vis.aggregatedSampleString)
        console.log('vis.nodesAggArray', vis.nodesAggArray)
        console.log('vis.aggrIndex', vis.aggrIndex)
      }

      // add new group

      for (let i = 0; i < nodeAggArr.length; i++) {
        // let nr = vis.counter
        vis.aggregatedRows.push({ group: nr, mRNA_id: nodeAggArr[i] })
      }
      // vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

      // console.log('ALL aggregated groups', vis.aggregatedRows)

      //// console.log('dataFlat max index: ', vis.dataSequencesMaxIndex)
      if (vis.maxIndex == null) {
        vis.maxIndex = vis.dataSequencesMaxIndex
      }

      let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(
        ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
      )
      // console.log('dataPhenosChilds', dataPhenosChilds)

      let aggregatedChildsPhenos = []
      let virSum = []
      let specieSum = []
      let strainSum = []

      for (let i = 0; i < dataPhenosChilds.length; i++) {
        virSum.push(dataPhenosChilds[i]['virulence'])
        specieSum.push(dataPhenosChilds[i]['species'])
        strainSum.push(dataPhenosChilds[i]['strain_name'])
      }

      aggregatedChildsPhenos.push({
        mRNA_id: nodeAgg,
        virulence: [...new Set(virSum)].join('|'),
        species: [...new Set(specieSum)].join('|'),
        strain_name: [...new Set(strainSum)].join('|'),
        group: nr,
      })

      console.log('dataPhenosChilds Aggregated', aggregatedChildsPhenos)

      // vis.counter ++;

      // compute on whole alignment?
      // let dataFilteredChilds = vis.dataSequencesFilteredSortedCurrent.filter(({ mRNA_id }) =>
      // nodeAggArr.includes(mRNA_id))

      let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id)
      )
      // console.log('data filtered nodeAggArr', dataFilteredChilds)

      let groupedChilds = d3.groups(
        dataFilteredChilds,
        (d) => d.position,
        (d) => d.nucleotide
        // d => d.informative,
        // d => d.pheno_specific,
        // d => d.variable
      )
      // console.log('data grouped childs: ', groupedChilds)
      let aggregatedChilds = []

      groupedChilds.forEach(function (el) {
        vis.maxIndex += 1

        let idx = vis.maxIndex
        let pos = el[0]
        let nuc = el[1]
        if (nuc.length > 1) {
          let multi = []
          for (let i = 0; i < nuc.length; i++) {
            multi.push(nuc[i][0])
          }
          nuc = multi.sort().join('|')
        } else {
          nuc = el[1][0][0]
        }
        let info = el[1][0][1]
        let infoSum = []
        let phenoSum = []
        let varSum = []
        for (let i = 0; i < info.length; i++) {
          infoSum.push(info[i]['informative'])
          phenoSum.push(info[i]['pheno_specific'])
          varSum.push(info[i]['variable'])
        }

        // add elements to new array
        aggregatedChilds.push({
          index: String(idx),
          position: pos,
          nucleotide: nuc,
          mRNA_id: nodeAgg,
          variable: [...new Set(varSum)].join('|'),
          informative: [...new Set(infoSum)].join('|'),
          pheno_specific: [...new Set(phenoSum)].join('|'),
        })
      })

      let aggrIndeces = []

      for (let j = 0; j < nodeAggArr.length; j++) {
        //// console.log('index of aggregated sample ', nodeAggArr[j], vis.currentSortingOrder, vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
      }

      vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
      vis.aggregatedSampleString = [
        ...vis.aggregatedSampleString.concat(nodeAgg),
      ]
      vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
      vis.aggregatedPhenos = [
        ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
      ]

      vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

      vis.currentSortAll = vis.rowSorterCurrentAll

      // vis.visualRefSelected = 'none' //!! important

      // vis.drawView()
      vis.drawAnnotations()
      vis.drawBipartite(vis.newSortwithAggregated)
      vis.drawHeatMap(vis.newSortwithAggregated)
      vis.drawPhenotypes(vis.newSortwithAggregated)

      // give color to highlight change
      d3.selectAll('.rowLabel')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.specie')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.strain')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      // aggregated rows
      d3.selectAll('.rowAggr')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.specie')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.strain')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      let dataPrevious = _.cloneDeep(this.$store.getters.getGroupsSelected)

      //update value in dict

      for (let i = 0; i < dataPrevious.length; i++) {
        if (dataPrevious[i]['group'] == nr) {
          dataPrevious[i]['checkedColor'] = true
          dataPrevious[i]['checkedCollapse'] = true
        }
      }
      this.$store.dispatch('setGroupsSelected', dataPrevious)

      // d3.selectAll('.rowLabel')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)
      // d3.selectAll('.specie')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)
      // d3.selectAll('.strain')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)

      // d3.selectAll('.vir')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)

      // d3.selectAll('.nodesSource')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)

      // d3.selectAll('.nodesTarget')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)

      // d3.selectAll('.linksBp')
      // .filter(function() {
      //           return allSelected.includes(d3.select(this).attr("mRNA_id")); // filter by single attribute
      //         }).classed('group-selection-'+color, true)

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

      d3.select('.phenoBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
      d3.select('.phenoBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

      d3.select('.rowBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
      d3.select('.rowBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible
    },
    toggleGroupCollapse() {
      let vis = this
      // console.log('clicked group button', vis.boolGroups)

      vis.boolGroups = true

      // console.log('new value create groups', vis.boolGroups)

      let selection = vis.selectionGroups

      if (
        (selection !== null && vis.boolGroups == true) ||
        (vis.altSelection.length > 0 && vis.boolGroups == true)
      ) {
        let nodeAggArr = []
        if (selection !== null) {
          let selectedRegion = [
            Math.round(selection[0]),
            Math.round(selection[1]),
          ]
          // console.log('selection rowLabels', selectedRegion)
          // console.log('current sorting order', vis.newSortwithAggregated)
          let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(
            idx_start,
            idx_end + 1
          )
          // let nodeAggArr = []
          for (let i = 0; i < rangeSlice.length; i++) {
            nodeAggArr = nodeAggArr.concat(rangeSlice[i].split('-'))
          }
          console.log('selected items with brush', nodeAggArr)
        }

        // include items alt
        if (vis.altSelection.length > 0) {
          // console.log('selected items with Alt', vis.altSelection)
          let difference = vis.altSelection.filter(
            (x) => !nodeAggArr.includes(x)
          )
          // console.log( 'difference', difference );
          nodeAggArr = [...nodeAggArr.concat(difference)]
          // console.log('selected items all', nodeAggArr)

          vis.altSelection = []
        }
        // include items from dendro/tree
        if (vis.childsSelected.length > 0) {
          nodeAggArr = [...new Set([...nodeAggArr.concat(vis.childsSelected)])]
        }

        let nodeAgg = nodeAggArr.sort().join('-')

        // console.log('vis.childsSelected', vis.childsSelected)
        // console.log('vis.altSelection', vis.altSelection)
        // console.log('nodeAgg', nodeAgg)
        // console.log('vis.selectionGroups', vis.selectionGroups)
        // console.log('vis.nodesAggArray', vis.nodesAggArray)
        // console.log('nodeAggArr', nodeAggArr)

        const checkAlreadyAggr = nodeAggArr.some((r) =>
          vis.nodesAggArray.includes(r)
        )
        // console.log('checkAlreadyAggr', checkAlreadyAggr)
        // debugger

        if (checkAlreadyAggr) {
          // console.log('create new aggregate!')
          // console.log('newSortwithAggregated', vis.newSortwithAggregated)
          // console.log('vis.nodesAggArray', vis.nodesAggArray)
          // console.log('vis.aggrIndex', vis.aggrIndex)

          // console.log('find group to delete:')
          // console.log('nodeAggArr',  nodeAggArr)

          // // console.log(' vis.aggregatedSampleString',  vis.aggregatedSampleString, nodeAgg, nodeAggArr)

          let groupDel
          groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
            nodeAggArr.includes(mRNA_id)
          )

          // console.log('group to delete', groupDel)
          let indexDel = d3.map(groupDel, function (d) {
            return d['group']
          })
          indexDel = [...new Set(indexDel)][0]
          // console.log('index to delete', indexDel, 'node to delete:', vis.aggregatedSampleString[indexDel])

          let nodeDel = vis.aggregatedSampleString[indexDel]

          let samplesDel = []
          let indecesDel = []
          let indexVals = []

          for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
            let arr = vis.aggregatedSampleString[i].split('-')

            const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
            // // console.log('find sample name to delete', checkAlreadyAggr, vis.aggregatedSampleString[i])
            if (checkAlreadyAggr) {
              samplesDel.push(vis.aggregatedSampleString[i])
              indecesDel.push(
                vis.aggregatedSampleString.indexOf(
                  vis.aggregatedSampleString[i]
                )
              )
              indexVals.push(vis.aggrIndex[i])
            }
          }

          console.log('sample(s) to delete', samplesDel)
          console.log('indeces to delete', indecesDel, indexVals)

          console.log('OLD VARS:')
          console.log('vis.aggregatedRows', vis.aggregatedRows)
          console.log('vis.nodesAggArray', vis.nodesAggArray)
          console.log('vis.aggrIndex', vis.aggrIndex)

          // debugger

          for (let i = 0; i < samplesDel.length; i++) {
            let nodeDel = samplesDel[i]
            let childsDel = samplesDel[i].split('-')
            let indexDel = indecesDel[i]

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
              (d) => d !== nodeDel
            )

            vis.aggregatedRows = vis.aggregatedRows.filter(
              ({ mRNA_id }) => !childsDel.includes(mRNA_id)
            )

            vis.nodesAggArray = vis.nodesAggArray.filter(
              (d) => !childsDel.includes(d)
            )

            // vis.aggrIndex = vis.aggrIndex.filter((d) => ! indecesDel.includes(vis.aggrIndex.indexOf(d)))

            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
              ({ mRNA_id }) => mRNA_id !== nodeDel
            )
          }

          vis.aggrIndex = vis.aggrIndex.filter((n) => !indexVals.includes(n))

          // vis.aggregatedSampleString = vis.aggregatedSampleString.filter((d) =>
          // d !== nodeDel)

          // vis.aggregatedRows = vis.aggregatedRows.filter(({ group }) =>
          // group !== indexDel)

          // vis.nodesAggArray = vis.nodesAggArray.filter((d) =>
          // ! nodeAggArr.includes(d))

          // vis.aggrIndex = vis.aggrIndex.filter((d) => vis.aggrIndex.indexOf(d) !== indexDel)

          // vis.aggregatedPhenos = vis.aggregatedPhenos.filter(({mRNA_id}) =>
          //   mRNA_id !== nodeDel)

          console.log('UPDATED VARS:')
          console.log('vis.aggregatedSampleString', vis.aggregatedSampleString)
          console.log('vis.aggregatedRows', vis.aggregatedRows)
          console.log('vis.nodesAggArray', vis.nodesAggArray)
          console.log('vis.aggrIndex', vis.aggrIndex)
          console.log(' vis.aggregatedPhenos', vis.aggregatedPhenos)

          // console.log('vis.aggregatedChilds??', vis.aggregatedChilds)

          // debugger
        }

        // console.log('vis.aggregaredRows', vis.aggregatedRows)
        // console.log('vis.aggregatedSampleString', vis.aggregatedSampleString)
        // console.log('vis.nodesAggArray', vis.nodesAggArray)

        for (let i = 0; i < nodeAggArr.length; i++) {
          let nr = vis.counter
          vis.aggregatedRows.push({ group: nr, mRNA_id: nodeAggArr[i] })
        }
        // vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

        // console.log('ALL aggregated groups', vis.aggregatedRows)

        //// console.log('dataFlat max index: ', vis.dataSequencesMaxIndex)
        if (vis.maxIndex == null) {
          vis.maxIndex = vis.dataSequencesMaxIndex
        }

        let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(
          ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
        )
        // console.log('dataPhenosChilds', dataPhenosChilds)

        let aggregatedChildsPhenos = []
        let virSum = []
        let specieSum = []
        let strainSum = []

        for (let i = 0; i < dataPhenosChilds.length; i++) {
          virSum.push(dataPhenosChilds[i]['virulence'])
          specieSum.push(dataPhenosChilds[i]['species'])
          strainSum.push(dataPhenosChilds[i]['strain_name'])
        }

        aggregatedChildsPhenos.push({
          mRNA_id: nodeAgg,
          virulence: [...new Set(virSum)].join('|'),
          species: [...new Set(specieSum)].join('|'),
          strain_name: [...new Set(strainSum)].join('|'),
          group: vis.counter,
        })

        // console.log('dataPhenosChilds Aggregated', aggregatedChildsPhenos)
        // debugger
        vis.counter++

        // compute on whole alignment?
        // let dataFilteredChilds = vis.dataSequencesFilteredSortedCurrent.filter(({ mRNA_id }) =>
        // nodeAggArr.includes(mRNA_id))

        let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )
        // console.log('data filtered nodeAggArr', dataFilteredChilds)

        let groupedChilds = d3.groups(
          dataFilteredChilds,
          (d) => d.position,
          (d) => d.nucleotide
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable
        )
        // console.log('data grouped childs: ', groupedChilds)
        let aggregatedChilds = []

        groupedChilds.forEach(function (el) {
          vis.maxIndex += 1

          let idx = vis.maxIndex
          let pos = el[0]
          let nuc = el[1]
          if (nuc.length > 1) {
            let multi = []
            for (let i = 0; i < nuc.length; i++) {
              multi.push(nuc[i][0])
            }
            nuc = multi.sort().join('|')
          } else {
            nuc = el[1][0][0]
          }
          let info = el[1][0][1]
          let infoSum = []
          let phenoSum = []
          let varSum = []
          for (let i = 0; i < info.length; i++) {
            infoSum.push(info[i]['informative'])
            phenoSum.push(info[i]['pheno_specific'])
            varSum.push(info[i]['variable'])
          }

          // add elements to new array
          aggregatedChilds.push({
            index: String(idx),
            position: pos,
            nucleotide: nuc,
            mRNA_id: nodeAgg,
            variable: [...new Set(varSum)].join('|'),
            informative: [...new Set(infoSum)].join('|'),
            pheno_specific: [...new Set(phenoSum)].join('|'),
          })
        })

        // console.log('data aggregated childs', aggregatedChilds)

        // let aggregatedSamples = [... new Set(vis.aggregatedSamples.concat(nodeAggArr))]

        let aggrIndeces = []

        for (let j = 0; j < nodeAggArr.length; j++) {
          //// console.log('index of aggregated sample ', nodeAggArr[j], vis.currentSortingOrder, vis.currentSortingOrder.indexOf(nodeAggArr[j]))
          aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        }

        //// console.log('minimum index: ', d3.min(aggrIndeces))

        vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
        vis.aggregatedSampleString = [
          ...vis.aggregatedSampleString.concat(nodeAgg),
        ]
        vis.aggregatedChilds = [
          ...vis.aggregatedChilds.concat(aggregatedChilds),
        ]
        vis.aggregatedPhenos = [
          ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
        ]

        vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

        //// console.log('vis.aggregatedSamples', vis.aggregatedSampleString)
        //// debugger
        //// console.log('vis.dataPhenosFiltered without aggr?', vis.dataPhenosFiltered)
        //// console.log('phenosNames updated?', vis.phenosNames)
        //// console.log('current sorting array', vis.currentSortingOrder)
        //// console.log('rowsorter current', vis.rowSorterCurrent)

        // vis.currentSort = vis.rowSorterCurrent
        vis.currentSortAll = vis.rowSorterCurrentAll
        // // console.log('rowsorter current', vis.rowSorterCurrent)
        // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

        //// debugger

        // vis.drawView()

        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
        vis.drawBipartite(vis.newSortwithAggregated)

        // //remove selections
        // d3.select("#phenotypesSvg")
        //   .call( vis.brushPhenos.move, null)

        d3.select('.phenoBrush > .selection')
          .attr('height', '0')
          .attr('y', '-30') //make invisible
        d3.select('.phenoBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

        d3.select('.rowBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
        d3.select('.rowBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

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
      vis.rowSortSteps = [vis.rowSort] //reset steps

      // vis.rowSortSteps.push(vis.rowSort)

      vis.linkedDendro = 'dendro-custom'
      //// console.log('linked dendro to show:', vis.linkedDendro)

      let selected = this.$store.getters.selectedPositions
      //// console.log('selected positions from heatmap comp', selected)
      //// console.log('disable dendrocalc', vis.disableDendroCalc)

      let selected_id = this.$store.getters.chosenHomologyId
      // //// console.log('selected id fror post', selected_id)

      let res = await axios.post(
        `http://131.155.23.192:5001/${selected_id}/d3dendro`,
        { selected_items: selected }
      ) // this should be moved to the store as well ?
      // //// console.log('res.data', res.data)

      let data = res.data
      //// console.log('updated dendro from getCustomDendro: ', data)

      vis.dendroCustom = data
      //// console.log('vis.dendroCustom: ', vis.dendroCustom)

      let dendroLeavesCustom = vis.getDendroLeavesUpdated(data)
      //// console.log('dendroLeavesCustom', dendroLeavesCustom)
      vis.dendroLeavesCustom = dendroLeavesCustom

      //// console.log('dendroLeaves', vis.dendroLeaves)

      // //// console.log('vis.rowSorters', vis.rowSort, vis.rowSorters)
      // vis.currentSort = vis.dendroLeaves
      // vis.currentSortAll = vis.dendroLeaves

      // //// console.log('vis.rowSorters', vis.rowSort, vis.rowSorters)
      vis.currentSort = vis.dendroLeaves
      vis.currentSortAll = vis.dendroLeavesAll //important!!

      // console.log('currentSortAll', vis.currentSortAll)

      // console.log('currentSortingOrderAll', vis.currentSortingOrderAll)

      // // debugger

      // update views
      vis.drawView()
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
    getCategories(data, attr) {
      // //// console.log('data categories: ', data)
      var categories = d3.map(data, function (d) {
        return d[attr]
      })
      categories = new Set(categories)
      categories = Array.from(categories)
      //// console.log(attr+' categories: ', categories)

      return categories
    },
    getCategoryDict(data, categories, attr) {
      let cat_dict = []
      // //// console.log('data categories: ', data)
      for (let i = 0; i < categories.length; i++) {
        let indices = []
        var total_class = data.filter(function (d) {
          if (d[attr] == categories[i]) {
            indices.push(d.idx)
            return d
          }
        })
        let mean_idx = d3.mean(indices)
        let median_idx = d3.median(indices)
        cat_dict.push({
          cat: categories[i],
          count: total_class.length,
          mean_idx: mean_idx,
          median_idx: median_idx,
          items: total_class,
        })
      }
      //// console.log(attr+' category dict :', cat_dict)

      return cat_dict
    },
    addIdxComp(data, categoriesDict, attr) {
      let data_class
      let comp_values

      for (let i = 0; i < data.length; i++) {
        data_class = data[i][attr]

        comp_values = categoriesDict.filter(function (d) {
          if (d.cat == data_class) {
            return d
          }
        })

        data[i][attr + '_mean_idx'] = comp_values[0].mean_idx
        data[i][attr + '_median_idx'] = comp_values[0].median_idx
      }
      //// console.log(attr+' data with computed indices: ', data)

      return data
    },
    getArraySortedCategorical(data, categories, orderNew, mode = 'median') {
      let categories_dict = this.getCategoryDict(data, categories, orderNew)
      let dataWithCompIdx = this.addIdxComp(data, categories_dict, orderNew)

      let orderKey = orderNew + '_' + mode + '_idx'

      dataWithCompIdx.sort(function (a, b) {
        var keyA = a[orderKey],
          keyB = b[orderKey]
        // Compare the 2 dates
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })

      let mRNAs = d3.map(dataWithCompIdx, function (d) {
        return d.mRNA_id
      })

      return mRNAs
    },
    getRowSorting(dataCurrent, orderNew, mode = 'median') {
      let data = _.cloneDeep(dataCurrent)
      let dataSorted

      if (this.metadataAttributes.includes(orderNew)) {
        //// console.log('order new is in phenotypes')
        let mRNAs = this.getArraySortedCategorical(
          data,
          this.metadataDictCat[orderNew],
          orderNew,
          mode
        )
        dataSorted = mRNAs
      }
      if (orderNew == 'dendro-default') {
        dataSorted = this.dendroLeavesDefaultFiltered
      }
      if (orderNew == 'dendro-custom') {
        dataSorted = this.dendroLeavesCustom
      }
      if (orderNew == 'initial') {
        dataSorted = this.yLabelsNames
      }
      if (orderNew == 'position') {
        if (this.rowFilter == 'subset') {
          dataSorted = this.currentSort.filter((d) =>
            this.subsetTest.includes(d)
          )
        }
        if (this.aggregatedSampleString !== null) {
          dataSorted = this.currentSort.filter(
            (d) => !this.aggregatedSamples.includes(d)
          )
        } else {
          dataSorted = this.currentSort //? correct?
        }
      }

      //// console.log('dataSorted by '+orderNew, dataSorted)
      return dataSorted
    },
    getRowSorting2(dataCurrent, orderNew, mode = 'median') {
      let data = _.cloneDeep(dataCurrent)
      let dataSorted

      if (this.metadataAttributes.includes(orderNew)) {
        //// console.log('order new is in phenotypes')
        let mRNAs = this.getArraySortedCategorical(
          data,
          this.metadataDictCat[orderNew],
          orderNew,
          mode
        )

        dataSorted = mRNAs
      }
      if (orderNew == 'dendro-default') {
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

      //// console.log('dataSorted by '+orderNew, dataSorted)
      return dataSorted
    },
    //     getTableSortingNew(dataCurrent, orderNew, mode = 'median'){

    //     let data = _.cloneDeep(dataCurrent);
    //     let dataSorted;

    //     if (this.metadataAttributes.includes(orderNew)){
    //       //// console.log('order new is in phenotypes')
    //       let dataWithCompIdx  = this.addIdxComp(data, this.metadataDictCatDendro[orderNew], orderNew)

    //       let orderKey = orderNew+'_'+mode+'_idx'

    //       dataWithCompIdx.sort(function(a, b) {
    //         var keyA = a[orderKey],
    //             keyB = b[orderKey];
    //           // Compare the 2 dates
    //           if (keyA < keyB) return -1;
    //           if (keyA > keyB) return 1;
    //           return 0;
    //         })

    //       let mRNAs = d3.map(dataWithCompIdx, function (d) {
    //         return d.mRNA_id
    //         })

    //       dataSorted = mRNAs;

    //     }
    //     if (orderNew == 'dendro-default'){
    //       dataSorted = this.dendroLeavesDefault

    //     }
    //     if (orderNew == 'dendro-custom') {
    //       dataSorted = this.dendroLeavesCustom

    //     }
    //     if (orderNew == 'initial') {
    //       dataSorted = this.yLabelsNames

    //     }
    //     if (orderNew == 'position') {

    //       //// console.log('position order .. still need to implement')
    //     }

    //     //// console.log('dataSorted by '+orderNew, dataSorted)
    //     return dataSorted

    // },
  },
  created() {
    // console.log(this.name + ' created')
    // this.getCoreSNP
    // this.getCoreSNPLeafs
    // debugger
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

    this.bipartiteWidthTotal = document.getElementById('bipartite').offsetWidth
    this.dendroWidth = document.getElementById('dendro').offsetWidth * 0.93

    this.initialBipartiteWidthTotal =
      document.getElementById('bipartite').offsetWidth * 0.93

    this.newBipartiteWidthTotal =
      document.getElementById('bipartite').offsetWidth * 0.93

    let initialDendroWith = document.getElementById('dendro').offsetWidth * 0.93
    this.initialDendroWith = initialDendroWith

    let newDendroWith = document.getElementById('dendro').offsetWidth * 0.93
    this.newDendroWith = newDendroWith

    let phenoBrushGroup = d3
      .select('#brushview')
      .append('g')
      .attr('class', 'phenoBrush')

    let virulenceGroup = d3
      .select('#virulenceview')
      .append('g')
      .attr('class', 'phenos')

    let speciesGroup = d3
      .select('#speciesview')
      .append('g')
      .attr('class', 'species')

    let strainGroup = d3
      .select('#strainview')
      .append('g')
      .attr('class', 'strainName')

    let rowLabelGroup = d3
      .select('#heatmapviewRow')
      .append('g')
      .attr('class', 'rowLabels')

    rowLabelGroup
      .append('g')
      .attr('class', 'rowBrush')
      .attr('transform', 'translate(0,' + -5 + ')')

    rowLabelGroup.append('g').attr('class', 'rowAggr')

    let cellBrushGroup = d3
      .select('#heatmapview')
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
    this.virulenceGroup = virulenceGroup
    this.speciesGroup = speciesGroup
    this.strainGroup = strainGroup
    this.colLabelGroup = colLabelGroup
    this.colAnnotationsGroup = colAnnotationsGroup
    this.visualRefGroup = visualRefGroup
    this.dendroGroup = dendroGroup

    let rowLabelWidth = document.getElementById('heatmapRow').offsetWidth

    this.rowLabelWidth = rowLabelWidth

    // initalize brush rowLabels
    let brushRowLabels = d3.brushY().extent([
      [-5, -20],
      [this.rowLabelWidth, this.chartHeightMax - 10],
    ])

    this.brushRowLabels = brushRowLabels

    //  // initalize brush cells
    //  let brushCells = d3.brushY()
    //     .extent( [ [0,0], [this.rowLabelWidth*7,this.chartHeightMax-10] ] )

    // this.brushCells = brushCells

    let phenoWidth = document.getElementById('phenotypes').deviceWidth

    // initalize brush
    let brushPhenos = d3.brushY().extent([
      [-10, 0],
      [phenoWidth, this.chartHeightMax - 10],
    ])

    this.brushPhenos = brushPhenos

    ///////////////////////////////////
    //// interactions once mounted ////
    ///////////////////////////////////
    let vis = this

    // try out collapsing //// --> do not collapse initially

    // console.log('dendroXgroups', this.dendroXgroups)
    // vis.initialCollapse(this.dendroXgroups)
    //// make view
    vis.drawView()

    // d3.select("#phenotypesSvg")
    //   .call( this.brushPhenos)

    // Add brush before rowlabels
    vis.rowLabelGroup.selectAll('.rowBrush').call(vis.brushRowLabels)

    // d3.select("#heatmapview")
    // .selectAll('.cellBrush')
    // .call( vis.brushCells)

    // Add brush before rowlabels
    d3.select('#brushview').selectAll('.phenoBrush').call(vis.brushPhenos)

    vis.brushRowLabels.on('start brush', brushedSelection) //change 'end' to 'brush' if want to see inbetween
    vis.brushRowLabels.on('end', aggregateRows) //change 'end' to 'brush' if want to see inbetween

    vis.brushPhenos.on('start brush', brushedSelectionPhenos)
    vis.brushPhenos.on('end', aggregateRows)

    function aggregateRows({ selection }) {
      vis.selectionGroups = selection

      if (selection !== null && vis.boolGroups == true) {
        let selectedRegion = [
          Math.round(selection[0]),
          Math.round(selection[1]),
        ]
        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)
        let nodeAggArr = []
        for (let i = 0; i < rangeSlice.length; i++) {
          nodeAggArr = nodeAggArr.concat(rangeSlice[i].split('-'))
        }
        let nodeAgg = nodeAggArr.sort().join('-')

        const checkAlreadyAggr = nodeAggArr.some((r) =>
          vis.nodesAggArray.includes(r)
        )

        if (checkAlreadyAggr) {
          let groupDel
          groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
            nodeAggArr.includes(mRNA_id)
          )

          // console.log('samples to delete', groupDel)
          let indexDel = d3.map(groupDel, function (d) {
            return d['group']
          })

          indexDel = [...new Set(indexDel)][0]

          let nodeDel = vis.aggregatedSampleString[indexDel]

          let samplesDel = []
          let indecesDel = []
          // debugger

          for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
            let arr = vis.aggregatedSampleString[i].split('-')

            const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
            // // console.log('find sample name to delete', checkAlreadyAggr, vis.aggregatedSampleString[i])
            if (checkAlreadyAggr) {
              samplesDel.push(vis.aggregatedSampleString[i])
              indecesDel.push(
                vis.aggregatedSampleString.indexOf(
                  vis.aggregatedSampleString[i]
                )
              )
            }
          }

          for (let i = 0; i < samplesDel.length; i++) {
            let nodeDel = samplesDel[i]
            let childsDel = samplesDel[i].split('-')
            let indexDel = indecesDel[i]

            vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
              (d) => d !== nodeDel
            )

            vis.aggregatedRows = vis.aggregatedRows.filter(
              ({ mRNA_id }) => !childsDel.includes(mRNA_id)
            )

            vis.nodesAggArray = vis.nodesAggArray.filter(
              (d) => !childsDel.includes(d)
            )

            vis.aggrIndex = vis.aggrIndex.filter(
              (d) => !indecesDel.includes(vis.aggrIndex.indexOf(d))
            )

            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
              ({ mRNA_id }) => mRNA_id !== nodeDel
            )
          }
        }

        for (let i = 0; i < nodeAggArr.length; i++) {
          let nr = vis.counter
          vis.aggregatedRows.push({ group: nr, mRNA_id: nodeAggArr[i] })
        }

        if (vis.maxIndex == null) {
          vis.maxIndex = vis.dataSequencesMaxIndex
        }

        let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(
          ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
        )

        let aggregatedChildsPhenos = []
        let virSum = []
        let specieSum = []
        let strainSum = []

        for (let i = 0; i < dataPhenosChilds.length; i++) {
          virSum.push(dataPhenosChilds[i]['virulence'])
          specieSum.push(dataPhenosChilds[i]['species'])
          strainSum.push(dataPhenosChilds[i]['strain_name'])
        }

        // group phenotypes
        aggregatedChildsPhenos.push({
          mRNA_id: nodeAgg,
          virulence: [...new Set(virSum)].join('|'),
          species: [...new Set(specieSum)].join('|'),
          strain_name: [...new Set(strainSum)].join('|'),
          group: vis.counter,
        })

        vis.counter++

        let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )

        // group nucleotides
        let groupedChilds = d3.groups(
          dataFilteredChilds,
          (d) => d.position,
          (d) => d.nucleotide
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable
        )
        // console.log('data grouped childs: ', groupedChilds)
        let aggregatedChilds = []

        groupedChilds.forEach(function (el) {
          vis.maxIndex += 1

          let idx = vis.maxIndex
          let pos = el[0]
          let nuc = el[1]
          if (nuc.length > 1) {
            let multi = []
            for (let i = 0; i < nuc.length; i++) {
              multi.push(nuc[i][0])
            }
            nuc = multi.sort().join('|')
          } else {
            nuc = el[1][0][0]
          }
          let info = el[1][0][1]
          let infoSum = []
          let phenoSum = []
          let varSum = []
          for (let i = 0; i < info.length; i++) {
            infoSum.push(info[i]['informative'])
            phenoSum.push(info[i]['pheno_specific'])
            varSum.push(info[i]['variable'])
          }

          // add elements to new array
          aggregatedChilds.push({
            index: String(idx),
            position: pos,
            nucleotide: nuc,
            mRNA_id: nodeAgg,
            variable: [...new Set(varSum)].join('|'),
            informative: [...new Set(infoSum)].join('|'),
            pheno_specific: [...new Set(phenoSum)].join('|'),
          })
        })

        let aggrIndeces = []

        for (let j = 0; j < nodeAggArr.length; j++) {
          aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        }

        vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
        vis.aggregatedSampleString = [
          ...vis.aggregatedSampleString.concat(nodeAgg),
        ]
        vis.aggregatedChilds = [
          ...vis.aggregatedChilds.concat(aggregatedChilds),
        ]
        vis.aggregatedPhenos = [
          ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
        ]

        vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

        vis.currentSortAll = vis.rowSorterCurrentAll

        // vis.drawView()
        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
        vis.drawBipartite(vis.newSortwithAggregated)

        d3.select('.phenoBrush > .selection')
          .attr('height', '0')
          .attr('y', '-30') //make invisible
        d3.select('.phenoBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

        d3.select('.rowBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
        d3.select('.rowBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

        vis.boolGroups = false
      }
    }

    function brushedSelection({ selection }) {
      if (selection !== null) {
        let selectedRegion = [
          Math.round(selection[0]),
          Math.round(selection[1]),
        ]
        // // console.log('selection rowLabels', selectedRegion)
        // // console.log('current sorting order', vis.newSortwithAggregated)
        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)

        // // console.log('selected labels', rangeSlice)
        let rangeItems = d3.filter(rangeSlice, function (d) {
          let rangeItemsArr = []
          vis.rangeItemsArr = rangeItemsArr
          return d.split('-').length > 1
        })
        for (let i = 0; i < rangeItems.length; i++) {
          let items = rangeItems[i].split('-')
          vis.rangeItemsArr = [...vis.rangeItemsArr.concat(items)]
        }

        console.log('selected labels', rangeItems)

        d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.rowAggr').classed('aggr-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.specie').classed('text-selection', function (l, li) {
          // // console.log('l for specie', l)

          return rangeSlice.includes(l.mRNA_id)
        })
        d3.selectAll('.vir').classed('pheno-node-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.strain').classed('text-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })
        d3.selectAll('.cell').classed('cell-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.nodesSource').classed(
          'node-selection',
          function (l, li) {
            return vis.rangeItemsArr.includes(l.mRNA_id)
          }
        )

        d3.selectAll('.nodesSource')
          .filter(function () {
            return rangeSlice.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
          })
          .classed('node-selection', true)

        d3.selectAll('.nodesTarget').classed(
          'node-selection',
          function (l, li) {
            return vis.rangeItemsArr.includes(l.mRNA_id)
          }
        )

        d3.selectAll('.nodesTarget')
          .filter(function () {
            return rangeSlice.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
          })
          .classed('node-selection', true)

        d3.selectAll('.linksBp').classed('link-selection', function (l, li) {
          return vis.rangeItemsArr.includes(l.mRNA_id)
        })

        d3.selectAll('.linksBp')
          .filter(function () {
            return rangeSlice.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
          })
          .classed('link-selection', true)
      }
    }

    function brushedSelectionPhenos({ selection }) {
      if (selection !== null) {
        let selectedRegion = [
          Math.round(selection[0]),
          Math.round(selection[1]),
        ]
        // // console.log('selection rowLabels', selectedRegion)
        // // console.log('current sorting order', vis.newSortwithAggregated)
        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)

        // console.log('selected labels', rangeSlice)

        d3.selectAll('.specie').classed('text-selection', function (l, li) {
          // // console.log('l for specie', l)

          return rangeSlice.includes(l.mRNA_id)
        })
        d3.selectAll('.vir').classed('pheno-node-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.strain').classed('text-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.rowAggr').classed('aggr-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.cell').classed('cell-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.nodesSource').classed(
          'node-selection',
          function (l, li) {
            return rangeSlice.includes(l.mRNA_id)
          }
        )

        d3.selectAll('.nodesTarget').classed(
          'node-selection',
          function (l, li) {
            return rangeSlice.includes(l.mRNA_id)
          }
        )

        d3.selectAll('.linksBp').classed('link-selection', function (l, li) {
          return rangeSlice.includes(l.mRNA_id)
        })

        d3.selectAll('.linksBp')
          .filter(function () {
            return rangeSlice.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
          })
          .classed('link-selection', true)
      }
    }

    // select labels
    let virulenceLabel = d3
      .select('#virulencelabelG')
      .data(['virulence'])
      .append('text')
      .attr('class', 'phenoLabel')
      .style('text-anchor', 'left')
      .style('font-size', '10px')

      .attr('transform', 'translate(' + 0 + ', 15) rotate(-45)')
      .attr('dx', '.8em')
      .text('Virulence')
      .on('click', function (event) {
        // console.log('[CLICK] virulence label')
        let selectValue = 'virulence'
        vis.rowSort = 'virulence'

        d3.selectAll('.phenoLabel').classed('text-selected', function (d, i) {
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

    let speciesLabel = d3
      .select('#specieslabelG')
      .data(['species'])
      .append('text')
      .attr('class', 'phenoLabel')
      .style('text-anchor', 'left')
      .style('font-size', '10px')
      .attr('transform', 'translate(' + 0 + ', 15) rotate(-45)')
      .attr('dx', '.8em')
      .text('Species')
      .on('click', function () {
        // console.log('[CLICK] species label')
        let selectValue = 'species'
        vis.rowSort = 'species'

        d3.selectAll('.phenoLabel').classed('text-selected', function (d, i) {
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

    let strainLabel = d3
      .select('#strainlabelG')
      .data(['strain_name'])
      .append('text')
      .attr('class', 'phenoLabel')
      .style('text-anchor', 'left')
      .style('font-size', '10px')
      .attr('transform', 'translate(' + 10 + ', 15) rotate(-45)')
      .attr('dx', '.8em')
      .text('Strain')
      .on('click', function () {
        console.log('[CLICK] strain label')
        let selectValue = 'strain_name'
        vis.rowSort = 'strain_name'

        d3.selectAll('.phenoLabel').classed('text-selected', function (d, i) {
          return selectValue == d
        })

        sortRows(selectValue)
        // d3.select('#rowSorting').property('selectedIndex', 6).node().focus()
      })
      .on('mouseover', function (d) {
        d3.select(this).classed('text-hover', true)
      })
      .on('mouseout', function (d) {
        // on mouseout rect
        d3.select(this).classed('text-hover', false)
      })

    //close grouping pop-up menu
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0]
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      d3.select('#popOverGroup').classed('hidden', true)
      d3.select('#popOverBg').classed('hidden', true)
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      let text_input = document.getElementById('group_name')
      if (event.target !== text_input) {
        d3.select('#popOverGroup').classed('hidden', true)
        d3.select('#popOverBg').classed('hidden', true)
      }
    }

    var svgPattern = d3.select('body').append('svg')
    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACGT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACGT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACGT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACGT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAC')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AC.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAC-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AC-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAG')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AG.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAG-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AG-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCG')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CG.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCG-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CG-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternGT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_GT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternGT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_GT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACG')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACG.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACG-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACG-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternACT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_ACT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAGT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AGT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternAGT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_AGT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCGT')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CGT.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternCGT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_CGT-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternA-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_A-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternC-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_C-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternG-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_G-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    svgPattern
      .append('defs')
      .append('pattern')
      .attr('id', 'patternT-')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('svg:image')
      .attr('xlink:href', '../ps_T-.png')
      .attr('width', 10)
      .attr('height', 10)
      .attr('x', 0.25)
      .attr('y', 0.25)

    // filter columns
    d3.select('#colFilter').on('change', function () {
      //// console.log('change display cols')
      let selectValue = d3.select('#colFilter').property('value')
      //// console.log('new selected col filter: ', selectValue)
      vis.$store.dispatch('setPositionsFilter', selectValue) //update store

      vis.drawHeatMap(vis.newSortwithAggregated) //vis.rowSorterCurrent
      vis.drawAnnotations()
    })

    // filter rows
    d3.select('#rowFilter').on('change', function () {
      //// console.log('change display rows')
      let selectValue = d3.select('#rowFilter').property('value')

      if (selectValue == 'subset') {
        vis.drawBipartite(vis.newSortwithAggregated)
        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
      }
      if (selectValue == 'all') {
        // vis.aggregatedSamples = [];

        vis.drawBipartite(vis.newSortwithAggregated) //vis.rowSorterCurrent
        vis.drawHeatMap(vis.newSortwithAggregated) //vis.rowSorterCurrent
        vis.drawPhenotypes(vis.newSortwithAggregated) //vis.rowSorterCurrent
      }
    })

    // change cell color
    d3.select('#cellColors').on('change', function () {
      //// console.log('change cell colors')
      let selectValue = d3.select('#cellColors').property('value')

      vis.drawHeatMap(vis.newSortwithAggregated)
    })

    // change VR
    d3.select('#visualReference').on('change', function () {
      let selectValue = d3.select('#visualReference').property('value')
      vis.visualRefSelected = selectValue
      d3.selectAll('.rowLabel').classed('text-ref', function (d) {
        return d == selectValue // make label pop out
      })

      vis.drawHeatMap(vis.newSortwithAggregated)
      vis.drawAnnotations(vis.newSortwithAggregated)
    })

    // change sorting rows
    d3.select('#rowSorting').on('change', function () {
      //// console.log('change rowSorting')
      let selectValue = d3.select('#rowSorting').property('value')

      vis.rowSort = selectValue //update rowSort
      vis.$store.dispatch('setAccessionsSort', selectValue) //update store

      if (
        (vis.rowSort == 'dendro-default') |
        (vis.rowSort == 'dendro-custom')
      ) {
        vis.linkedDendro = vis.rowSort
      }

      sortRows(selectValue)

      //selected labels
      d3.selectAll('.phenoLabel').classed('text-selected', function (d, i) {
        //// console.log('i', i, 'd', d, selectValue, vis.rowSort)
        return selectValue == d
      })
    })

    // row sort function
    function sortRows(selectValue) {
      // new code

      // console.log('selectValue', selectValue)
      // console.log('vis.currentsortRow', vis.currentSortRow)
      // debugger

      vis.rowSort = selectValue
      if (
        (vis.rowSort == 'dendro-default') |
        (vis.rowSort == 'dendro-custom')
      ) {
        vis.rowSortSteps = [vis.rowSort] // reset steps
      } else {
        vis.rowSortSteps.push(vis.rowSort)
      }

      // vis.boolSorted.phenos =! vis.boolSorted.phenos
      // if (vis.currentSortRow !== selectValue ){
      //   vis.boolSorted.phenos = false // start from best sorting for new phenotype
      // }

      vis.currentSortAll = vis.rowSorterCurrentAll

      // if (vis.currentSortRow == selectValue | vis.boolSorted.phenos == true){

      //   let reversed = _.cloneDeep(vis.rowSorterCurrentAll);
      //   reversed.reverse()

      //   vis.currentSortAll = reversed

      // }

      vis.drawView()

      //reverse order again for update
      // if (vis.boolSorted.phenos == true){

      //   vis.currentSortAll = vis.rowSorterCurrentAll.reverse()

      // }

      vis.currentSortRow = selectValue
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
    // var bottomDiv = document.getElementById('heatmap');

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
    let vis = this

    // delete group
    if (vis.groupToDelete !== null) {
      let group = vis.groupToDelete //this.$store.getters.getGroupToDelete
      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]

      let groupDeleted = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })

      console.log('groupDeleted', groupDeleted)

      d3.selectAll('.rowLabel')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.specie')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.strain')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.linksBp')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.vir')
        .filter(function () {
          return groupDeleted.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      // update groups
      vis.selectedGroups = vis.selectedGroups.filter(function (d) {
        return d.color != color
      })

      vis.colorsGroups = [...vis.colorsGroups.concat([color])] // re-append color

      // expand if was aggregated
      let nodeAggArr = groupDeleted.sort()
      let nodeAgg = groupDeleted.sort().join('-')

      if (vis.aggregatedSampleString.includes(nodeAgg)) {
        // console.log('^^^ Expand node')

        let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

        vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
          (d) => d !== nodeAgg
        )

        vis.aggregatedRows = vis.aggregatedRows.filter(
          ({ mRNA_id }) => !nodeAggArr.includes(mRNA_id)
        )

        vis.nodesAggArray = vis.nodesAggArray.filter(
          (d) => !nodeAggArr.includes(d)
        )

        vis.aggrIndex = vis.aggrIndex.filter(
          (d) => vis.aggrIndex.indexOf(d) !== indexDel
        )

        vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
          ({ mRNA_id }) => mRNA_id !== nodeAgg
        )

        vis.currentSortAll = vis.rowSorterCurrentAll
        // // // console.log('rowsorter current', vis.rowSorterCurrent)
        // // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

        //// debugger

        // vis.drawView()

        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
        vis.drawBipartite(vis.newSortwithAggregated)
      }

      console.log('all selected items with group nr', vis.selectedGroups)
      this.$store.dispatch('setGroupsSelected', vis.selectedGroups)
      this.$store.dispatch('setGroupDelete', null)
    }

    //// decolor group
    if (vis.groupToDecolor !== null) {
      let group = vis.groupToDecolor //this.$store.getters.getGroupToDecolor

      console.log('>>>>> hi from heatmap groupDecolor', group)

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]
      console.log('color', color)

      let groupDecolor = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })
      let groupString = groupDecolor.sort().join('-')
      console.log('vis.selectedGroups', vis.selectedGroups)
      console.log('groupMembers', groupMembers)
      console.log('groupDecolor', groupDecolor)
      // debugger

      d3.selectAll('.rowLabel')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.specie')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.strain')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.linksBp')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.vir')
        .filter(function () {
          return groupDecolor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      // aggregated rows
      d3.selectAll('.rowAggr')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.specie')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.strain')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.linksBp')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      d3.selectAll('.vir')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, false)

      //reset
      this.$store.dispatch('setGroupDecolor', null)
    }

    // recolor group
    if (vis.groupToColor !== null) {
      let group = vis.groupToColor //this.$store.getters.getGroupToDecolor

      console.log('>>>>> hi from heatmap groupColor', group)

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]
      console.log('color', color)

      let groupColor = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })
      let groupString = groupColor.sort().join('-')
      console.log('vis.selectedGroups', vis.selectedGroups)
      console.log('groupMembers', groupMembers)
      console.log('groupColor', groupColor)

      d3.selectAll('.rowLabel')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.specie')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.strain')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return groupColor.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      // aggregated rows
      d3.selectAll('.rowAggr')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.specie')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.strain')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return groupString == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      // reset
      this.$store.dispatch('setGroupColor', null)
    }

    // collapse group
    if (vis.groupToCollapse !== null) {
      let group = vis.groupToCollapse //this.$store.getters.getGroupToDecolor

      console.log('>>>>> hi from heatmap groupCollapse', group)

      // set VR back to none
      vis.visualRefSelected = 'none'

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]
      console.log('color', color)

      let groupCollapse = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })

      console.log('vis.selectedGroups', vis.selectedGroups)
      console.log('groupMembers', groupMembers)
      console.log('groupCollapse', groupCollapse)

      // implement aggregation WO check already aggregated
      // hier ben ik !!

      let nodeAggArr = groupCollapse.sort()
      let nodeAgg = groupCollapse.sort().join('-')

      const checkAlreadyAggr = nodeAggArr.some((r) =>
        vis.nodesAggArray.includes(r)
      )

      if (checkAlreadyAggr) {
        let groupDel
        groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )

        // console.log('samples to delete', groupDel)
        let indexDel = d3.map(groupDel, function (d) {
          return d['group']
        })

        indexDel = [...new Set(indexDel)][0]

        let nodeDel = vis.aggregatedSampleString[indexDel]

        let samplesDel = []
        let indecesDel = []
        // debugger

        for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
          let arr = vis.aggregatedSampleString[i].split('-')

          const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
          // // console.log('find sample name to delete', checkAlreadyAggr, vis.aggregatedSampleString[i])
          if (checkAlreadyAggr) {
            samplesDel.push(vis.aggregatedSampleString[i])
            indecesDel.push(
              vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i])
            )
          }
        }

        for (let i = 0; i < samplesDel.length; i++) {
          let nodeDel = samplesDel[i]
          let childsDel = samplesDel[i].split('-')
          let indexDel = indecesDel[i]

          vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
            (d) => d !== nodeDel
          )

          vis.aggregatedRows = vis.aggregatedRows.filter(
            ({ mRNA_id }) => !childsDel.includes(mRNA_id)
          )

          vis.nodesAggArray = vis.nodesAggArray.filter(
            (d) => !childsDel.includes(d)
          )

          vis.aggrIndex = vis.aggrIndex.filter(
            (d) => !indecesDel.includes(vis.aggrIndex.indexOf(d))
          )

          vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
            ({ mRNA_id }) => mRNA_id !== nodeDel
          )
        }
      }

      for (let i = 0; i < nodeAggArr.length; i++) {
        // let nr = vis.counter
        vis.aggregatedRows.push({ group: group, mRNA_id: nodeAggArr[i] })
      }
      // vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

      // console.log('ALL aggregated groups', vis.aggregatedRows)

      //// console.log('dataFlat max index: ', vis.dataSequencesMaxIndex)
      if (vis.maxIndex == null) {
        vis.maxIndex = vis.dataSequencesMaxIndex
      }

      let dataPhenosChilds = vis.dataPhenosFilteredSortedCurrent.filter(
        ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
      )
      // console.log('dataPhenosChilds', dataPhenosChilds)

      let aggregatedChildsPhenos = []
      let virSum = []
      let specieSum = []
      let strainSum = []

      for (let i = 0; i < dataPhenosChilds.length; i++) {
        virSum.push(dataPhenosChilds[i]['virulence'])
        specieSum.push(dataPhenosChilds[i]['species'])
        strainSum.push(dataPhenosChilds[i]['strain_name'])
      }

      aggregatedChildsPhenos.push({
        mRNA_id: nodeAgg,
        virulence: [...new Set(virSum)].join('|'),
        species: [...new Set(specieSum)].join('|'),
        strain_name: [...new Set(strainSum)].join('|'),
        group: group,
      })

      console.log('dataPhenosChilds Aggregated', aggregatedChildsPhenos)

      // vis.counter ++;

      // compute on whole alignment?
      // let dataFilteredChilds = vis.dataSequencesFilteredSortedCurrent.filter(({ mRNA_id }) =>
      // nodeAggArr.includes(mRNA_id))

      let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id)
      )
      // console.log('data filtered nodeAggArr', dataFilteredChilds)

      let groupedChilds = d3.groups(
        dataFilteredChilds,
        (d) => d.position,
        (d) => d.nucleotide
        // d => d.informative,
        // d => d.pheno_specific,
        // d => d.variable
      )
      // console.log('data grouped childs: ', groupedChilds)
      let aggregatedChilds = []

      groupedChilds.forEach(function (el) {
        vis.maxIndex += 1

        let idx = vis.maxIndex
        let pos = el[0]
        let nuc = el[1]
        if (nuc.length > 1) {
          let multi = []
          for (let i = 0; i < nuc.length; i++) {
            multi.push(nuc[i][0])
          }
          nuc = multi.sort().join('|')
        } else {
          nuc = el[1][0][0]
        }
        let info = el[1][0][1]
        let infoSum = []
        let phenoSum = []
        let varSum = []
        for (let i = 0; i < info.length; i++) {
          infoSum.push(info[i]['informative'])
          phenoSum.push(info[i]['pheno_specific'])
          varSum.push(info[i]['variable'])
        }

        // add elements to new array
        aggregatedChilds.push({
          index: String(idx),
          position: pos,
          nucleotide: nuc,
          mRNA_id: nodeAgg,
          variable: [...new Set(varSum)].join('|'),
          informative: [...new Set(infoSum)].join('|'),
          pheno_specific: [...new Set(phenoSum)].join('|'),
        })
      })

      let aggrIndeces = []

      for (let j = 0; j < nodeAggArr.length; j++) {
        //// console.log('index of aggregated sample ', nodeAggArr[j], vis.currentSortingOrder, vis.currentSortingOrder.indexOf(nodeAggArr[j]))
        aggrIndeces.push(vis.currentSortingOrder.indexOf(nodeAggArr[j]))
      }

      vis.aggrIndex = [...vis.aggrIndex.concat(d3.min(aggrIndeces))]
      vis.aggregatedSampleString = [
        ...vis.aggregatedSampleString.concat(nodeAgg),
      ]
      vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
      vis.aggregatedPhenos = [
        ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
      ]

      vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

      vis.currentSortAll = vis.rowSorterCurrentAll

      // vis.drawView()
      vis.drawBipartite(vis.newSortwithAggregated)
      vis.drawHeatMap(vis.newSortwithAggregated)
      vis.drawPhenotypes(vis.newSortwithAggregated)

      // give color to highlight change
      d3.selectAll('.rowLabel')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.specie')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.strain')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      // aggregated rows
      d3.selectAll('.rowAggr')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.specie')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.strain')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return nodeAgg == d3.select(this).attr('mRNA_id') // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      let dataPrevious = _.cloneDeep(this.$store.getters.getGroupsSelected)

      //update value in dict

      for (let i = 0; i < dataPrevious.length; i++) {
        if (dataPrevious[i]['group'] == group) {
          dataPrevious[i]['checkedColor'] = true
        }
      }
      this.$store.dispatch('setGroupsSelected', dataPrevious)

      //reset
      this.$store.dispatch('setGroupCollapse', null)
    }

    // expand group
    if (vis.groupToExpand !== null) {
      let group = vis.groupToExpand //this.$store.getters.getGroupToDecolor

      console.log('>>>>> hi from heatmap groupExpand', group)

      vis.visualRefSelected = 'none' //!! important

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]
      console.log('color', color)

      let checkColor = d3.map(groupMembers, function (d) {
        return d.checkedColor
      })
      checkColor = Array.from(new Set(checkColor))[0]
      console.log('color', checkColor)

      let groupExpand = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })

      console.log('vis.selectedGroups', vis.selectedGroups)
      console.log('groupMembers', groupMembers)
      console.log('groupExpand', groupExpand)

      let nodeAggArr = groupExpand.sort()
      let nodeAgg = groupExpand.sort().join('-')

      // console.log('vis.aggregaredRows', vis.aggregatedRows, vis.aggregatedSampleString)

      if (vis.aggregatedSampleString.includes(nodeAgg)) {
        // console.log('^^^ Expand node')

        let indexDel = vis.aggregatedSampleString.indexOf(nodeAgg)

        vis.aggregatedSampleString = vis.aggregatedSampleString.filter(
          (d) => d !== nodeAgg
        )

        vis.aggregatedRows = vis.aggregatedRows.filter(
          ({ mRNA_id }) => !nodeAggArr.includes(mRNA_id)
        )

        vis.nodesAggArray = vis.nodesAggArray.filter(
          (d) => !nodeAggArr.includes(d)
        )

        vis.aggrIndex = vis.aggrIndex.filter(
          (d) => vis.aggrIndex.indexOf(d) !== indexDel
        )

        vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
          ({ mRNA_id }) => mRNA_id !== nodeAgg
        )

        vis.currentSortAll = vis.rowSorterCurrentAll
        // // // console.log('rowsorter current', vis.rowSorterCurrent)
        // // console.log('rowsorter current ALL', vis.rowSorterCurrentAll)

        //// debugger

        // vis.drawView()

        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
        vis.drawBipartite(vis.newSortwithAggregated)
      }

      // give color to highlight change
      d3.selectAll('.rowLabel')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.specie')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)
      d3.selectAll('.strain')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.vir')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesSource')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.nodesTarget')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      d3.selectAll('.linksBp')
        .filter(function () {
          return nodeAggArr.includes(d3.select(this).attr('mRNA_id')) // filter by single attribute
        })
        .classed('group-selection-' + color, true)

      let dataPrevious = _.cloneDeep(this.$store.getters.getGroupsSelected)

      //update value in dict

      for (let i = 0; i < dataPrevious.length; i++) {
        if (dataPrevious[i]['group'] == group) {
          dataPrevious[i]['checkedColor'] = true
        }
      }
      this.$store.dispatch('setGroupsSelected', dataPrevious)

      //reset
      this.$store.dispatch('setGroupExpand', null)
    }

    // vis.drawView()

    // console.log('>>>> HEATMAP --> side menu collapsed??', vis.bool_collapsed)
    // // console.log('biparite width new', document.getElementById('bipartite').offsetWidth * 0.95)

    if (vis.bool_collapsed) {
      vis.dendroWidth = vis.newDendroWith
      vis.bipartiteWidth = vis.newBipartiteWidth
      vis.bipartiteWidthTotal = vis.newBipartiteWidthTotal
    } else {
      // vis.dendroWidth = document.getElementById('dendro').offsetWidth * 0.93
      // // console.log(' vis.dendroWidth new?',  vis.dendroWidth)

      vis.newDendroWith = document.getElementById('dendro').offsetWidth * 0.93
      vis.newBipartiteWidth =
        document.getElementById('bipartite').offsetWidth * 0.95
      vis.newBipartiteWidthTotal =
        document.getElementById('bipartite').offsetWidth * 0.93
      vis.dendroWidth = vis.initialDendroWith
      vis.bipartiteWidth = vis.initialBipartiteWidth
      vis.bipartiteWidthTotal = vis.initialBipartiteWidthTotal
    }

    // vis.drawDendro()
    vis.drawView()
  },
}
</script>

<style>
.rowBrush .selection {
  stroke: white;
  fill: #ff4d4f;
  /* fill: #ff6251; */
  fill-opacity: 0;
}

.phenoBrush .selection {
  stroke: white;
  fill: #ff4d4f;
  /* fill: #ff6251; */
  fill-opacity: 0;
}

circle.border {
  stroke: black;
}

text.text-hover {
  /* fill: #ff6251; */
  /* fill: #1890ff; */
  fill: black;
  font-weight: bold;
}

text.text-normal {
  fill: darkgrey;
}

text.text-similar-highlight {
  /* fill: orange !important; */
  fill: black !important;
  font-weight: bold;
}

text.text-selection {
  /* fill: #774be5; */
  /* fill: #1890ff; */
  /* fill: #ff9e32; */
  fill: #ff6251 !important;
  /* fill: black; */
  font-weight: bold;
}

text.text-ref {
  /* fill: #ff6251; */
  /* fill: black; */
  font-weight: bold;
  font-style: italic;
}

text.text-highlight {
  /* fill: #ff6251; */
  fill: #1890ff !important;
  font-weight: bold;
}

text.text-selected {
  fill: #1890ff;
  font-weight: bold;
}

circle.node-selection {
  /* stroke: #774be5; */
  /* stroke: black; */
  /* stroke: #1890ff; */
  /* stroke: #ff9e32; */
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

circle.pheno-node-selection {
  /* stroke: #774be5; */
  /* stroke: black; */
  /* stroke: #1890ff; */
  /* stroke: #ff9e32; */
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

path.link-selection {
  /* stroke: #774be5; */
  /* stroke: black; */
  /* stroke: #1890ff; */
  /* stroke: #ff9e32; */
  stroke: #ff6251 !important;
  stroke-width: 1px;
}

path.link-highlight {
  stroke: #1890ff !important;
  /* stroke: #ff6251; */
  z-index: 2;
  stroke-width: 0.5px;
}

path.link-hover {
  stroke: #1890ff;
  stroke-width: 2px;
}

circle.node-highlight {
  /* fill: black; */
  /* stroke: #ff6251; */
  stroke: #1890ff;
}

rect.cell-border {
  stroke: #eee;
  /* stroke: rgb(195, 204, 204); */
  stroke-width: 0.5px;
  paint-order: fill;
}

rect.cell-selection {
  /* stroke: #ff6251; */
  stroke: #ff6251 !important;
  stroke-dasharray: 10, 9, 10, 9;
  stroke-width: 0.2;
  /* paint-order: stroke; */
  stroke-linecap: square;
}

rect.cell-highlight {
  /* stroke: #ff6251; */
  stroke: #1890ff;
  stroke-width: 0.5px;
  stroke-dasharray: 10, 9, 10, 9;
  /* stroke-width: 2px;
    paint-order: stroke; */
  stroke-linecap: square;
}

rect.cell-hover {
  /* stroke: #ff6251; */
  stroke: yellow;
  /* stroke-dasharray: 40; */
  /* paint-order: stroke; */
  stroke-width: 0.5px;
}

rect.aggr-selection {
  /* stroke: #ff6251; */
  stroke: #ff6251 !important;
  /* stroke-dasharray: 40; */
  /* paint-order: stroke; */
  stroke-width: 0.8px;
}

rect.aggr-highlight {
  /* stroke: #ff6251; */
  stroke: #1890ff;
  /* stroke-dasharray: 40; */
  /* paint-order: stroke; */
  stroke-width: 0.5px;
}

rect.cell-highlight-col {
  /* stroke: #ff6251; */
  stroke: #1890ff;
  /* stroke: #1890ff; */
  stroke-dasharray: 0, 9, 10, 9, 10;
  stroke-width: 0.5px;
}

.rowLabel {
  font-size: 9px;
}

.colLabel {
  font-size: 8px;
}

/* text.text-hover {
    font-weight: bold;
  } */

/* The Modal (background) */
#popOverBg {
  position: fixed; /* Stay in place */
  z-index: 3; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
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
  /* font-size: 28px; */
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

#tooltip {
  position: absolute;
  width: 250px;
  height: auto;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
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
  height: auto;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 1);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  pointer-events: none;
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

#heatmap {
  /* height: 400px; */
  /* width: 85%; */
  /* width: 510px; */

  /* width: 500px; */
  padding-left: 1px;
  /* overflow-y: auto;
    overflow-x: auto; */
}

#heatmapRow {
  /* height: 388px; */
  /* height: 400px; */
  /* width: 200px; */
  /* width: 15%; */
  width: 100%;
  /* overflow-y: auto; 
    overflow-x: auto; */
  padding-left: 0px;
  padding-right: 0px;
}

#heatmapCol {
  height: 100px;
  /* width: 488px; */
  /* width: 78.8%; */
  /* width: 85%; */
  width: 100%;

  padding-left: 1px;
  /* overflow-y: auto;
    overflow-x: auto; */
}

.emptyDiv {
  height: 100px;
  /* width: 200px; */
  /* width: 15%; */
  width: 100%;
  /* overflow-y: auto;
    overflow-x: auto; */
}

#heatmapEmpty {
  height: 100px;
  /* width: 200px; */
  /* width: 15%; */
  width: 100%;
  /* overflow-y: auto;
    overflow-x: auto; */
}

#dendroEmpty {
  height: 100px;
  width: 100%;
}

#dendro {
  /* height: 400px; */
  width: 100%;
  /* width: 15%; */
  padding-left: 0px;
  padding-right: 0px;
}

#bipartite {
  /* height: 400px; */
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
  /* width: 15%; */
}

#phenotypes {
  /* height: 400px; */
  width: 100%;
  /* width: 15%; */
}

.rnode {
  font-size: 8px;
  font-family: sans-serif;
  fill: #2c3e50;
}

.container {
  /* height: 500px; */
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
}

.leftContainer {
  float: left;
}

.variantView {
  height: 800px;
  /* height: 50%; */
}

/* #initialOrder {
    margin-right: 5px;
  } */

/* #checkPositions {
    margin-left: 0.25rem;
  } */

/* input[type='checkbox'].smaller {
    width: 8px;
    height: 8px;
    border-radius: 0;
    margin: 1px;
  } */

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
  transition: max-width 0.8s ease;
}

#virulencelabelG {
  cursor: pointer;
}

#specieslabelG {
  cursor: pointer;
}

#strainlabelG {
  cursor: pointer;
}

.colLabel {
  cursor: pointer;
}

.nodeDendro {
  cursor: pointer;
}

.rowLabel {
  cursor: crosshair;
}

.rowAggr {
  cursor: crosshair;
}

.specie {
  cursor: crosshair;
}

.vir {
  cursor: crosshair;
}

.strain {
  cursor: crosshair;
}

.overlay {
  visibility: hidden;
  cursor: crosshair;
}

.ant-btn .anticon.anticon-plus > svg {
  margin-bottom: 6px;
}
.ant-btn .anticon.anticon-partition > svg {
  margin-bottom: 6px;
}
.ant-btn .anticon.anticon-link > svg {
  margin-bottom: 6px;
}
.ant-btn .anticon.anticon-vertical-align-middle > svg {
  margin-bottom: 6px;
}

.form-check-label{
  font-size: 10px;
}
</style>
