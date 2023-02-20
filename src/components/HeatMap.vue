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
                <option value="no-choice" disabled>
                  Color cells by
                </option>
                <option disabled value="default">Default</option>
                <option value="clustal" selected>Clustal</option>
                <option disabled value="cg-at">CG vs AT</option>
                <option disabled value="pur-pyr">Purine vs Pyrimidine</option>
              </select>
            </div>
          </div>
          <div class="iconsSelect" style="float: left">
            <div class="iconsDiv" style="float: left">
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
      <div class="ant-col ant-col-11" :style="heatmapStyle" id="heatmap-cells">
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
      </div>
      <a-col :span="5" width="100%">
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
                :transform="'translate(' + 100 + ',' + 70 + ')'"
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
    <div id="tooltip-mrna" class="hidden">
      <p><span id="value-mrna"></span></p>
    </div>
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
  SortAscendingOutlined,
  BgColorsOutlined,
  LinkOutlined,
  ColumnWidthOutlined,
  SwapOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'

export default {
  name: 'Heatmap',
  components: {
    checkboxGroup,
    SortAscendingOutlined,
    BgColorsOutlined,
    LinkOutlined,
    ColumnWidthOutlined,
    SwapOutlined,
    PlusOutlined
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
      cellColors: 'clustal',
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
      visualRefSelected: 'none', 
      boolGroups: false,
      selectionGroups: [],
      altSelection: [],
      selectionLst: [],
      levelCollapse: 12, 
      boolSorted: {
        position: true,
        phenos: true,
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

      // code to parse newick based on Jason Davies newick.js: https://github.com/jasondavies/newick.js/blob/master/src/newick.js
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
      return data
    },
    getCoreSNPLeafs() {
      let dataDendro = this.getCoreSNP

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

      for (let i = 0; i < leafNames.length; i++) {
        let leaf = leafNames[i].split('+')[0]
        leafNamesClean.push(leaf)
      }
      return leafNamesClean
    },
    groupToCollapse() {
      let data = this.group_collapse

      return data
    },
    groupToExpand() {
      let data = this.group_expand

      return data
    },
    groupToDelete() {
      let data = this.group_delete

      return data
    },
    groupToDecolor() {
      let data = this.group_decolor

      return data
    },
    groupToColor() {
      let data = this.group_color

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
        this.$store.dispatch('setGroups', this.aggregatedRows)

        let mrnaArr = d3.map(data, function (d) {
          return d.mRNA_id
        })

        for (let i = 0; i < this.aggregatedRows.length; i++) {
          let idx = mrnaArr.indexOf(this.aggregatedRows[i]['mRNA_id'])
          data[idx]['group'] = this.aggregatedRows[i]['group']
        }
      }
      return data
    },
    dataSequences() {

      return this.data_heatmap
    },
    dataPhenosFiltered() {
      let dataPheno = this.dataPhenos
      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let data_aggr_phenos = this.aggregatedPhenos

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

      return dataPhenotypes
    },
    currentSortingOrder() {
      let sortingOrder
      if (this.currentSort == null) {
        sortingOrder = this.dendroLeaves
      } else {
        sortingOrder = this.currentSort
      }
      return sortingOrder
    },
    currentSortingOrderAll() {
      let sortingOrder
      if (this.currentSortAll == null) {
        sortingOrder = this.dendroLeavesAll
      } else {
        sortingOrder = this.currentSortAll
      }

      this.$store.dispatch('setCurrentSortingOrderRows', sortingOrder)
      return sortingOrder
    },
    dataPhenosFilteredSortedCurrent() {

      let sortingOrder = this.currentSortingOrderAll


      let mRNA_arr = this.subsetTest
      let data_aggr = this.aggregatedSampleString
      let aggr_idx = this.aggrIndex
      let phenos_by_current_order = []

      if (data_aggr.length !== 0) {

        sortingOrder = sortingOrder.filter(
          (d) => !this.nodesAggArray.includes(d)
        )


        for (let i = 0; i < aggr_idx.length; i++) {
          let idx = this.aggrIndex[i]

          sortingOrder.splice(idx, 0, this.aggregatedSampleString[i])
        }

        sortingOrder = [...new Set(sortingOrder)]
      }

      if (this.rowFilter == 'all' && data_aggr.length == 0) {
        sortingOrder = this.currentSortingOrderAll
      }

      if (this.rowFilter == 'subset') {
        sortingOrder = sortingOrder.filter((d) => mRNA_arr.includes(d)) 
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
        let row = {
          idx: i,
          virulence: data[i].virulence,
          species: data[i].species,
          strain_name: data[i].strain_name,
          mRNA_id: data[i].mRNA_id,
          group: data[i].group,
        }

        values_idx.push(row)
      }

      return values_idx
    },
    metadataFilteredCurrentOrderIdx() {
      let data = this.dataPhenosFilteredSortedCurrent

      let values_idx = []

      for (let i = 0; i < data.length; i++) {

        let row = {
          idx: i,
          virulence: data[i].virulence,
          species: data[i].species,
          mRNA_id: data[i].mRNA_id,
          group: data[i].group,
        }

        values_idx.push(row)
      }

      return values_idx
    },

    rowSorterCurrentAll() {
      let data = this.metadataCurrentOrderIdx
      let rowSorting
      if (this.rowSort == 'strain_name') {
        rowSorting = this.getRowSorting2(data, this.rowSort, 'mean')
      } else {
        rowSorting = this.getRowSorting2(data, this.rowSort, 'median')
      }

      return rowSorting
    },
    newSortwithAggregated() {

      let dataByGroup = d3.group(this.aggregatedRows, (d) => d.group)
      let keysGroups = [...dataByGroup.keys()]

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

        tmpSortingArr = tmpSortingArr.filter((d) => !groupValues.includes(d))

        tmpSortingArr.splice(
          d3.min(groupedIdxArr),
          0,
          [...groupValues].sort().join('-')
        )
      }
      this.$store.dispatch('setCurrentSortingOrderWithAggr', tmpSortingArr)


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
      let lowEnd = Number(region.split('-')[0])
      let highEnd = Number(region.split('-')[1])
      function range(start, end) {
        return Array(end - start + 1)
          .fill()
          .map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd)

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

      }

      if (aggregatedChilds.length !== 0) {

        let aggregatedChildsRegion = aggregatedChilds.filter(({ position }) =>
          regionArray.includes(Number(position))
        )

        dataHeat = dataHeatM.concat(aggregatedChildsRegion)
      }

      let showPositions = this.colFilter

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
      let lowEnd = Number(region.split('-')[0])
      let highEnd = Number(region.split('-')[1])
      function range(start, end) {
        return Array(end - start + 1)
          .fill()
          .map((_, idx) => start + idx)
      }
      let regionArray = range(lowEnd, highEnd) 

      let dataHeat = dataHeatmap.filter(({ position }) =>
        regionArray.includes(Number(position))
      )

      let showPositions = this.colFilter

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

        dataFiltered = dataHeat.filter(({ position }) =>
          positionsPheno.includes(position)
        )
        return dataFiltered
      }


      return dataFiltered
    },

    visualRefData() {
      let data = this.dataSequencesFilteredSortedCurrent
      let dummyVR = this.phenosNamesCopy[0]['mRNA_id']
      let VR = this.visualRefSelected

      let dataVR = data.filter(function (d) {
        return d.mRNA_id == dummyVR 
      })

      if (VR !== 'none') {
        dataVR = data.filter(function (d) {
          return d.mRNA_id == VR 
        })
      }


      return dataVR
    },
    dataSequencesFilteredSortedCurrent() {
      let dataSortedCurrent = []
      for (let i = 0; i < this.dendroLeaves.length; i++) {
        let row = this.dataSequencesFiltered.filter(
          ({ mRNA_id }) => mRNA_id == this.dendroLeaves[i]
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
    phenosNamesCopy() {

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
    numYLabelsAll() {
      return this.phenosNamesAll.length
    },
    dendroDefault() {
      return this.data_dendro
    },
    dendroLeavesDefault() {
      let dataDendro = this.dendroDefault

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
    dendroLeavesDefaultFiltered() {
      let leafNames = this.dendroLeavesDefault

      let showRows = this.rowFilter
      if (showRows == 'subset') {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
      }
      if (this.aggregatedSampleString.length !== 0) {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))

        let aggr_idx = this.aggrIndex
        for (let i = 0; i < aggr_idx.length; i++) {
          let idx = this.aggrIndex[i]

          leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }

      }

      return leafNames //.reverse()
    },
    dendroLeavesAll() {
      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default') {

        dataDendro = this.dendroDefault
      } else {
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
      // to filter out rows
      let leafNames = this.dendroLeavesAll
      let showRows = this.rowFilter
      if (showRows == 'subset') {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))
      }

      if (this.aggregatedSampleString.length !== 0) {
        leafNames = leafNames.filter((item) => this.phenosNames.includes(item))

        let aggr_idx = this.aggrIndex
        for (let i = 0; i < aggr_idx.length; i++) {
          let idx = this.aggrIndex[i]

          leafNames.splice(idx, 0, this.aggregatedSampleString[i])
        }
      }

      return leafNames //.reverse()
    },
    root() {
      let dataDendro = this.dendroDefault

      if (this.linkedDendro == 'dendro-default' && this.toggleButton == true) {
        dataDendro = this.dendroDefault
      }
      if (this.linkedDendro == 'dendro-custom' && this.toggleButton == true) {
        dataDendro = this.dendroCustom
      }


      // }
      if (this.toggleButton == false) {
        if (this.showCoreSNP == true) {
          dataDendro = this.getCoreSNP // make checkbox for core SNP
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
        if (e.height <= level && e.height > 0) {

          lst_nodes.push(e.data.name)
        }
      })
      lst_nodes.sort((a, b) => b.length - a.length)

      let lst_nodes_included = []
      let lst_nodes_aggr_initial = lst_nodes.filter(function (d) {
        let arr1 = d.split('-')

        const containsAll = arr1.every((element) => {
          return lst_nodes_included.includes(element)
        })

        if (containsAll == true) {
          return false
        } else {
          lst_nodes_included = [...lst_nodes_included.concat(d.split('-'))]
          return true
        }
      })

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
      return this.cellSize * this.getCoreSNPLeafs.length + 10

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

          '#FFF'

            // '#f99372',
            // '#89b2ff',
            // '#eedd80',
            // '#74936e',

            // '#f99372',
            // '#89b2ff',
            // '#eedd80',
            // '#74936e',

            // '#f6ffff',
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

      // collapse initially
      vis.selectedGroups = vis.$store.getters.getGroupsSelected

      for (let j = 0; j < lst_nodes_aggr_initial.length; j++) {
        let nodeAggInit = lst_nodes_aggr_initial[j]

        let nodeAggArr = nodeAggInit.split('-')
        let nodeAgg = nodeAggArr.sort().join('-')

        let color = vis.colorsGroups.shift()

        let colorName =color['color']
        let colorHex =color['hexcode']
        
        for (let i = 0; i < nodeAggArr.length; i++) {
          let nr = vis.counter

          vis.aggregatedRows.push({'group': nr, 'mRNA_id':nodeAggArr[i], 'color': colorName, 'colorHex': colorHex, 'checkedColor': false, 'checkedCollapse': true})
          vis.selectedGroups.push({'group': nr, 'mRNA_id':nodeAggArr[i], 'color': colorName, 'colorHex': colorHex, 'checkedColor': false, 'checkedCollapse': true})
        }
        this.$store.dispatch('setGroups', vis.aggregatedRows)
        this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

        // make color classess
        var styleText = document.createElement('style')
        styleText.type = 'text/css'
        styleText.innerHTML =
          'text.group-selection-' +
          colorName +
          ' { fill: ' +
          colorHex +
          ';   font-weight: bold; }'

        document.getElementsByTagName('head')[0].appendChild(styleText)

        var styleLinks = document.createElement('style')
        styleLinks.type = 'text/css'
        styleLinks.innerHTML =
          'path.group-selection-' +
          colorName +
          ' { stroke: ' +
          colorHex +
          '; z-index: 2000;}'

        document.getElementsByTagName('head')[0].appendChild(styleLinks)

        var styleNodePheno = document.createElement('style')
        styleNodePheno.type = 'text/css'
        styleNodePheno.innerHTML =
          'circle.group-selection-' + colorName + ' { stroke: ' + colorHex + '; }'

        document.getElementsByTagName('head')[0].appendChild(styleNodePheno)

        var styleRowAggr = document.createElement('style')
        styleRowAggr.type = 'text/css'
        styleRowAggr.innerHTML =
          'rect.group-selection-' + colorName + ' { stroke: ' + colorHex + '; }'

        document.getElementsByTagName('head')[0].appendChild(styleRowAggr)

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

        let groupedChilds = d3.groups(
          dataFilteredChilds,
          (d) => d.position,
          (d) => d.nucleotide
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable
        )
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

      }

    },
    drawView() {
      let vis = this
      // vis.metadataDictCat

      vis.groupToDelete
      vis.groupToDecolor

      let sortOrder = vis.rowSorterCurrentAll

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
      //let starttime = new Date()
      // console.log('drawing dendrogram...')

      // make dendro
      let vis = this
      let dendroGraph = this.dendroGroup
      const t_dendro = dendroGraph.transition().duration(vis.transitionTime)

      let dataLinks = vis.colCluster(vis.root).links()

      let dataNodes = vis.root.descendants()

      let dendroDepth = vis.dendroDepth

      let dendroX = vis.dendroX

      const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)

      dendroGraph
        .selectAll('path.linkDendro')
        .data(dataLinks)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linkDendro')
              .attr('fill', 'none')

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
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();
            let childs = d3.select(this).attr('name')
            vis.childs = childs
            const childsSelected = childs.split('-').sort()
            vis.childsSelected = [...vis.childsSelected.concat(childsSelected)]

            if (d3.select(this).attr('class') == 'nodeDendro node-selection') {
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

            let altSelection = []

            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          } else {
            let childs = d3.select(this).attr('name')
            vis.childs = childs
            const childsSelected = childs.split('-').sort()
            vis.childsSelected = childsSelected

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
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]

          }
        })
    },
    drawPhenotypes(sortingOrderArray) {
      // let starttime = new Date()

      let dataMeta = this.dataPhenosFilteredSortedCurrent

      let vis = this

      // make virulence plot
      let virulenceGraph = this.virulenceGroup
      const t_phenos = virulenceGraph.transition().duration(vis.transitionTime)
      virulenceGraph
        .selectAll('circle.vir')
        .data(dataMeta, (d) => d.mRNA_id)
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

                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })
              .attr('r', vis.cellSize / 2.5)
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

          let groupNrSelected = ''
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(
            ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
          )
          let groupArr = d3.map(groupSelected, (d) => d.group)
          groupNrSelected = Array.from(new Set(groupArr))[0]

          if (isNaN(groupNrSelected)) {
            groupNrSelected = ''
          }

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

          if (!(event.altKey && event.ctrlKey)){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                30 +
                // - document.getElementById('heatmap').scrollLeft

                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 +
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
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
        })
        .on('mouseout', function (event, d) {
          if (event.altKey && event.ctrlKey)
          {
          d3.select('#tooltip-phenos').classed('hidden', false)
          }
          else {
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();
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

            let altSelection = []
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)) {
            event.preventDefault();
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {

              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

          }
        })

      // make species plot
      let speciesGraph = this.speciesGroup
      const t_species = speciesGraph.transition().duration(vis.transitionTime)

      speciesGraph
        .selectAll('text.specie')
        .data(dataMeta, (d) => d.mRNA_id)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', 'darkgrey')
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

          let groupNrSelected = ''
          let groupSelected = vis.$store.getters.getGroupsSelected.filter(
            ({ mRNA_id }) => nodeAggArr.includes(mRNA_id)
          )
          let groupArr = d3.map(groupSelected, (d) => d.group)
          groupNrSelected = Array.from(new Set(groupArr))[0]

          if (isNaN(groupNrSelected)) {
            groupNrSelected = ''
          }

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
          items.sort((first, second) => {
            return second[1] - first[1]
          })

          // Step - 3
          let keys = items.map((e) => {
            return e[0]
          })

          let myStringCounts = ''
          for (let i = 0; i < values.length; i++) {
            myStringCounts =
              myStringCounts +
              (keys[i] + ': ' + '<i>' + counts[keys[i]] + '</i>' + '<br>')
          }

          if (!(event.altKey && event.ctrlKey)){
          //Update the tooltip position and value
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                // document.getElementById('virulence').offsetWidth / 5 +
                // document.getElementById('virulence').offsetWidth  +
                50 + 
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 +
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
          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
          
        })
        .on('mouseout', function (event) {
          d3.selectAll('.specie').classed('text-similar-highlight', false)
          if (event.altKey && event.ctrlKey){
            d3.select('#tooltip-phenos').classed('hidden', false)
          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();
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


            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)) {
            event.preventDefault();
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {

              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)


          }
        })

      // make species plot
      let strainGraph = this.strainGroup
      const t_strain = strainGraph.transition().duration(vis.transitionTime)

      strainGraph
        .selectAll('text.strain')
        .data(dataMeta, (d) => d.mRNA_id)
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
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                return row * vis.cellSize
              })

              .text(function (d) {
                if (d.strain_name.split('|').length > 1) {
                  return 'multiple'
                } else {
                  let strain = d.strain_name.split('_')
                  if (strain[0] !== 'P.') {
                    const removeFirst = strain.splice(0, 1)
                    return strain.join('_')
                  } else {
                    const removeFirstTwo = strain.splice(0, 2)
                    return strain.join('_')
                  }
                }

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

          if (!(event.altKey && event.ctrlKey)){
          d3.select('#tooltip-phenos')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft +
                document.getElementById('heatmap-cells').offsetWidth +
                // document.getElementById('virulence').offsetWidth * 0. +
                + 130 +
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 +
                'px'
            )
            .select('#value-phenos')
            .html('<strong>strain_name: </strong>' + '<br>' + myStringCounts)

          }
          //Show the tooltip
          d3.select('#tooltip-phenos').classed('hidden', false)
          
        })
        .on('mouseout', function (event) {

          d3.selectAll('.strain').classed('text-similar-highlight', false)

          if (event.altKey && event.ctrlKey){
            d3.select('#tooltip-phenos').classed('hidden', false)
          }
          else{
            d3.select('#tooltip-phenos').classed('hidden', true)
          }
          
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();
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

            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)) {
            event.preventDefault();
            const brush_elm = d3
              .select('#brushview')
              .select('.phenoBrush > .overlay')
              .node()
            const brush_selection = d3
              .select('#brushview')
              .select('.phenoBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {
              // Click happened on a dot, inside the current brush selection, so, don't do anything
              return
            }

            // Click happened on a dot, with no rectangle selection or outside the rectangle selection
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

      // console.log('[DONE] drawing phenotypes')
      //// console.log('time drawing phenotypes', (new Date().getTime() - starttime.getTime())/1000)
    },
    drawBipartite(sortingOrderArray) {
      //// make bipartite

      let starttime = new Date()
      // console.log('drawing bipartite...')

      let dataMeta = this.dataPhenosFiltered //this.metadataDendroOrderIdx
      let vis = this

      let bipartiteGraph = this.bipartiteGroup
      const t_bipartite = bipartiteGraph
        .transition()
        .duration(vis.transitionTime)

      bipartiteGraph
        .selectAll('circle.nodesSource')
        .data(vis.dataPhenosSortedCurrent, (d) => d.mRNA_id) 
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('class', 'nodesSource')
              .attr('label-r', function (d, i) {

                if (vis.linkedDendro == 'dendro-custom') {
                  return vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                } else {
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

                if (vis.linkedDendro == 'dendro-custom') {
                  let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                  return row * vis.cellSize
                } else {
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
              .style('fill', '#ccc')
              .call((enter) => enter.transition(t_bipartite).attr('cx', 2)),
          (update) =>
            update
              .attr('label-r', function (d, i) {
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
                    if (vis.linkedDendro == 'dendro-custom') {
                      let row = vis.dendroLeavesCustom.indexOf(d.mRNA_id)
                      return row * vis.cellSize
                    } else {
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
                30 +
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
                return vis.newSortwithAggregated.indexOf(d.mRNA_id)
              })
              .attr('mRNA_id', function (d, i) {
                return d.mRNA_id
              })
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('cx', 0)
              .attr('cy', function (d, i) {
                let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

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
                update
                  .transition(t_bipartite)
                  .style('fill', '#ccc')
                  .attr('cy', function (d, i) {
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
        .data(dataSourceNodes, (d) => d.mRNA_id) 
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'linksBp')
              .attr('label-r', function (d, i) {
                if (vis.toggleButton == true) {
                  return vis.dendroLeavesAll.indexOf(d.mRNA_id)
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
              .attr('transform', 'translate(0,' + vis.cellSize / 2 + ')')
              .attr('d', function (d, i) {

                return vis.drawLine(
                  vis.dendroLeavesAll.indexOf(d.mRNA_id),
                  vis.dendroLeavesAll.indexOf(d.mRNA_id)
                )
              })
              .attr('stroke', 'rgba(192, 192, 192, 0.5)')
              .attr('stroke-width', '1px')
              .attr('fill', 'none')
              .call((enter) =>
                enter.transition(t_bipartite).attr('d', function (d, i) {

                  if (vis.toggleButton == true) {

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {
   
                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }

                    }

                    return vis.drawLine(
                      vis.dendroLeavesAll.indexOf(d.mRNA_id),
                      row
                    )
                  } else {

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {

                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }
                    }

                    if (vis.showCoreSNP == true) {

                      return vis.drawLine(
                        vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0]),
                        row
                      )
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
                }
              })
              .attr('mRNA_id', function (d) {
                return d.mRNA_id
              })
              .call((update) =>
                update.transition(t_bipartite).attr('d', function (d, i) {
                  if (vis.toggleButton == true) {

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {

                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }

                    }

                    return vis.drawLine(
                      vis.dendroLeavesAll.indexOf(d.mRNA_id),
                      row
                    )
                  } else {

                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    if (vis.nodesAggArray.includes(d.mRNA_id)) {

                      for (
                        let i = 0;
                        i < vis.aggregatedSampleString.length;
                        i++
                      ) {
                        let str = vis.aggregatedSampleString[i]
                        let arr = str.split('-')
                        if (arr.includes(d.mRNA_id)) {
                          row = vis.newSortwithAggregated.indexOf(str)
                        }
                      }
                    }

                    if (vis.showCoreSNP == true) {

                      return vis.drawLine(
                        vis.getCoreSNPLeafs.indexOf(d.mRNA_id.split('_')[0]),
                        row
                      )
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
      // console.log('time drawing bipartite', (new Date().getTime() - starttime.getTime())/1000)
    },
    drawAnnotations() {

      let vis = this

      // make annotations plot
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
              .attr('fill', 'lightgrey')
              .attr('class', 'annotation')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + ((i * vis.cellSize)) + ', 2)'
              })
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

      // make visual ref plot
      let visRef = this.visualRefGroup
      const t_visref = visRef.transition().duration(vis.transitionTime)

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
                  return '#e9ecef'
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
              .attr('class', 'visRef')
              .attr('fontsize', '8px')
              .style('text-anchor', 'left')
              .attr('transform', function (d, i) {
                return 'translate(' + (i * vis.cellSize)  + ', 2)'
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
                if (vis.visualRefSelected == 'none') {
                  return '#e9ecef'
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

      let vis = this

      // make row labels
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
        .on('mouseover', function (event, d) {
          let idr = d3.select(this).attr('label-r') // row
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)

          if (!(event.altKey && event.ctrlKey)){

          d3.select('#tooltip-mrna')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('bipartiteCol').offsetLeft +
                document.getElementById('bipartiteCol').offsetWidth * 0.9 +
                // - document.getElementById('heatmap').scrollLeft
                30 +
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 +
                'px'
            )
            d3.select('#tooltip-mrna').classed('hidden', true)
          }
            
  
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();

            if (
              d3.select(this).attr('class') ==
              'rowLabel text-selection text-highlight'
            ) {
              d3.select(this).classed('text-selection', false)
            } else {
              d3.select(this).classed('text-selection', true)
              vis.selectionLst.push(d)

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

            let altSelection = []
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {

              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey || event.ctrlKey)) {
            event.preventDefault();
            const brush_elm = rowLabels.select('.rowBrush > .overlay').node()
            const brush_selection = rowLabels
              .select('.rowBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {

              return
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
              view: window,
            })
            brush_elm.dispatchEvent(new_click_event)

          }
        })

      // make row labels aggregated
      let rowsAggr = this.rowLabelGroup
      const t_rows_aggr = rowsAggr.transition().duration(vis.transitionTime)

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
        .on('mouseover', function (event, d) {
         
          let mrna = d3.select(this).attr('mRNA_id')
          vis.highlightRow(mrna)
          //Update the tooltip position and value
          let values = d.split('-')
          let myString = ''

          let groupNrSelected = ''
          for (let i = 0; i < values.length; i++) {
            myString = myString + (values[i] + '<br>')

            let groupSelected = vis.$store.getters.getGroupsSelected.filter(
              ({ mRNA_id }) => values.includes(mRNA_id)
            )
            let groupArr = d3.map(groupSelected, (d) => d.group)
            groupNrSelected = Array.from(new Set(groupArr))[0]

          }

          if (!(event.altKey && event.ctrlKey)){
          d3.select('#tooltip-mrna')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('bipartiteCol').offsetLeft +
                document.getElementById('bipartiteCol').offsetWidth * 0.9 +
                // - document.getElementById('heatmap').scrollLeft
                30 + 
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 +
                'px'
            )
            .select('#value-mrna')
            .html(
              '<strong>group: </strong>' +
                groupNrSelected +
                '<br> <strong>mRNA_id: </strong>' +
                '<br>' +
                myString
            )
          }
          //Show the tooltip
          d3.select('#tooltip-mrna').classed('hidden', false)
        
        })
        .on('mouseout', function (event) {
          if (event.altKey && event.ctrlKey){
            d3.select('#tooltip-mrna').classed('hidden', false)
          }
          else{
            d3.select('#tooltip-mrna').classed('hidden', true)
          }
          
        })
        .on('contextmenu', function(event){
          event.preventDefault();

        })
        .on('mousedown', function (event, d) {
          if (event.altKey || event.ctrlKey) {
            event.preventDefault();
            if (
              d3.select(this).attr('class') ==
              'rowAggr aggr-selection aggr-highlight'
            ) {
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

            let altSelection = []
            d3.selectAll('.aggr-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.text-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            d3.selectAll('.pheno-node-selection').each(function (d, i) {
              let mrna = d3.select(this).attr('mRNA_id').split('-')
              altSelection = [...altSelection.concat(mrna)]
            })
            vis.altSelection = [...new Set(altSelection)]
          }

          if (!(event.altKey|| event.ctrlKey)) {
            event.preventDefault();
            const brush_elm = rowsAggr.select('.rowBrush > .overlay').node()
            const brush_selection = rowsAggr
              .select('.rowBrush > .selection')
              .node()
            const bbox = brush_selection.getBoundingClientRect()

            if (
              brush_selection.style.display !== 'none' &&
              event.pageX > bbox.left &&
              event.pageX < bbox.left + bbox.width &&
              event.pageY > bbox.top &&
              event.pageY < bbox.top + bbox.height
            ) {

              return
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

      // make col labels
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
                return (
                  'translate(' + +(i + 1) * vis.cellSize + ', 2) rotate(-90)'
                )
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
                update
                  .transition(t_cols)

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

          let clickedValue = i

          d3.select('#rowSorting').property('selectedIndex', 4).node().focus()

          vis.boolSorted.position = !vis.boolSorted.position
          if (i !== vis.currentSortRow) {
            vis.boolSorted.position = false // start with best sorting
          }
          sortByValues(i, vis.colSortOrder)

        
          d3.selectAll('.colLabel').classed('text-selected', function (d) {
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
                  if (vis.visualRefSelected !== 'none') {
                    nucVR = vis.visualRefData.filter(function (d) {
                      return d.position == posRef 
                    })[0].nucleotide
                  }
                  let nucVRlist = nucVR.split('|')
                  if (
                    d.nucleotide == nucVR &&
                    d.mRNA_id !== vis.visualRefSelected
                  ) {
                    return '#e9ecef'
                  }
                  if (
                    nucVRlist.includes(d.nucleotide) &&
                    d.mRNA_id !== vis.visualRefSelected
                  ) {
                    return '#e9ecef'
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
                if (vis.visualRefSelected !== 'none') {
                  nucVR = vis.visualRefData.filter(function (d) {
                    return d.position == posRef 
                  })[0].nucleotide
                }
                let nucVRlist = nucVR.split('|')
                if (
                  d.nucleotide == nucVR &&
                  d.mRNA_id !== vis.visualRefSelected
                ) {
                  return '#e9ecef'
                }
                if (
                  nucVRlist.includes(d.nucleotide) &&
                  d.mRNA_id !== vis.visualRefSelected
                ) {
                  return '#e9ecef'
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
                  return '#e9ecef'
                }

                return vis.colorScaleNuc(d.nucleotide)
              })
              .call((update) =>
                update
                  .transition(t_cells)
                  .attr('x', function (d, i) {
                    let c = d3.select(this).attr('data-c')
                    return c * vis.cellSize 
                  })
                  .attr('y', function (d) {
                 
                    let row = vis.newSortwithAggregated.indexOf(d.mRNA_id)

                    return row * vis.cellSize 
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
       
          var idr = d3.select(this).attr('data-r') // row
          var idc = d3.select(this).attr('data-c') // column
          var value = d3.select(this).attr('data-value') // data value
          let mrna = d3.select(this).attr('mRNA_id')

          vis.highlightRow(mrna)

          // highlight this rect
          d3.select(this).classed('cell-hover', true)

          d3.selectAll('.colLabel').classed('text-highlight', function (c, ci) {
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

          let allNucs = d3.map(valuesNucl, function (d) {
            return d.nucleotide
          })

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
          if (!(event.altKey && event.ctrlKey)){
          d3.select('#tooltip')
            .style(
              'left',
              d3.pointer(event)[0] +
                document.getElementById('heatmap-cells').offsetLeft -
                document.getElementById('heatmap').scrollLeft +
                // - 125  // width tooltip/2
                20 +
                'px'
            )
            .style(
              'top',
              d3.pointer(event)[1] +
                document.getElementById('heatmap').getBoundingClientRect().top -
                document.getElementById('heatmap').scrollTop -
                40 + 
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
         
            )
          }
          //Show the tooltip
          d3.select('#tooltip').classed('hidden', false)
          
        })
        .on('mouseleave', function (event) {
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

        let dataSeqPos = vis.dataSequencesFilteredAll.filter(
          ({ position }) => position == i
      
        )
  

        d3.selectAll('.cc' + vis.xLabelsNames.indexOf(i)).filter(function (d) {
          dataColSelected.push({ mRNA_id: d.mRNA_id, nucleotide: d.nucleotide })
        })

        for (let i = 0; i < vis.numYLabels; i++) {
          let mrna = dataColSelected[i]['mRNA_id']
     
          let idx = vis.rowSorterCurrentAll.indexOf(mrna)
          dataColSelected[i]['idx'] = idx
        }
        dataColSelected = dataColSelected.sort(function (a, b) {
          //sort data before index computation!!
          return a.idx - b.idx
        })
      
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

        if (vis.boolSorted.position == true) {
          let reverse_mrnas_all = _.cloneDeep(mRNAsAll)
          let reverse_mrnas = _.cloneDeep(mRNAs)
          reverse_mrnas_all.reverse()
          reverse_mrnas.reverse()

          vis.currentSort = reverse_mrnas
          vis.currentSortAll = reverse_mrnas_all
        }

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
    
    },
    highlightRow(mrna) {
      d3.selectAll('.nodesSource').classed('node-highlight', function (l, li) {
       
        return mrna.split('-').includes(l.mRNA_id)
      })

      d3.selectAll('.linksBp').classed('link-highlight', function (l, li) {
        return mrna.split('-').includes(l.mRNA_id)
      })

      d3.selectAll('.nodesTarget').classed('node-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

       
        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.rowLabel').classed('text-highlight', function (l, li) {
        if (l.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l
        }

       
        return l.split('-').includes(mrna)
      })

      d3.selectAll('.rowAggr').classed('aggr-highlight', function (l, li) {
        return mrna == l
      })

      d3.selectAll('.cell').classed('cell-highlight', function (l, li) {

        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.vir').classed('node-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }
     
        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.specie').classed('text-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        return l.mRNA_id.split('-').includes(mrna)
      })

      d3.selectAll('.strain').classed('text-highlight', function (l, li) {
        if (l.mRNA_id.split('-').length > 1 && mrna.split('-').length > 1) {
          return mrna == l.mRNA_id
        }

        return l.mRNA_id.split('-').includes(mrna)
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
      //  assigns the data to a hierarchy using parent-child relationships
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
        vis.drawBipartite(vis.newSortwithAggregated) //vis.rowSorterCurrent
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
    drawLine(sourceNodeIds, targetNodeIds) {
      let vis = this

      return d3.linkHorizontal()({
        source: [2, sourceNodeIds * vis.cellSize],
        target: [vis.bipartiteWidth, targetNodeIds * vis.cellSize],
      })
    },
    toggleGroupCreate() {
      let vis = this

      let selection = vis.selectionGroups

      let brushSelection = []
      if (selection !== null) {
        let selectedRegion = [
          Math.round(selection[0]),
          Math.round(selection[1]),
        ]

        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)
        for (let i = 0; i < rangeSlice.length; i++) {
          brushSelection = brushSelection.concat(rangeSlice[i].split('-'))
        }
      }

      // 1. get all current selected elements
      let allSelected = []
      allSelected = Array.from(
        new Set(brushSelection.concat(vis.altSelection, vis.childsSelected))
      )

      // get most recent file from store
      vis.selectedGroups = vis.$store.getters.getGroupsSelected

      // delete group if items in new selection
      let group_del = vis.selectedGroups.filter(function (d) {
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
      let colorsDel = [...new Set(color_del)]
      let groupsDel = [...new Set(group_nr_del)]

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

      vis.selectedGroups = vis.selectedGroups.filter(function (d) {
        return !colorsDel.includes(d.color)
      })

      let color = vis.colorsGroups.shift()

      let colorName =color['color']
      let colorHex =color['hexcode']

      let nr;
      for (let i =0; i < allSelected.length; i++){
            nr = vis.counter
            vis.selectedGroups.push({'group': nr, 'mRNA_id':allSelected[i], 'color': colorName,'colorHex': colorHex,'checkedColor': false, 'checkedCollapse': false})
      }
      vis.counter = vis.counter+ 1;

      this.$store.dispatch('setGroupsSelected', vis.selectedGroups)

      // 2. assign color and make classes
      var styleText = document.createElement('style')
      styleText.type = 'text/css'
      styleText.innerHTML =
        'text.group-selection-' +
        colorName +
        ' { fill: ' +
        colorHex +
        ';   font-weight: bold; }'

      document.getElementsByTagName('head')[0].appendChild(styleText)

      var styleLinks = document.createElement('style')
      styleLinks.type = 'text/css'
      styleLinks.innerHTML =
        'path.group-selection-' +
        colorName +
        ' { stroke: ' +
        colorHex +
        '; z-index: 2000;}'

      document.getElementsByTagName('head')[0].appendChild(styleLinks)

      var styleNodePheno = document.createElement('style')
      styleNodePheno.type = 'text/css'
      styleNodePheno.innerHTML =
        'circle.group-selection-' + colorName + ' { stroke: ' + colorHex + '; }'

      document.getElementsByTagName('head')[0].appendChild(styleNodePheno)

      var styleRowAggr = document.createElement('style')
      styleRowAggr.type = 'text/css'
      styleRowAggr.innerHTML =
        'rect.group-selection-' + colorName + ' { stroke: ' + colorHex + '; }'

      document.getElementsByTagName('head')[0].appendChild(styleRowAggr)

      // always collapse group after created
      let nodeAggArr = allSelected.sort()
      let nodeAgg = allSelected.sort().join('-')

      const checkAlreadyAggr = nodeAggArr.some((r) =>
        vis.nodesAggArray.includes(r)
      )

      if (checkAlreadyAggr) {
        vis.visualRefSelected = 'none' //! important

        let groupDel
        groupDel = vis.aggregatedRows.filter(({ mRNA_id }) =>
          nodeAggArr.includes(mRNA_id)
        )

        let indexDel = d3.map(groupDel, function (d) {
          return d['group']
        })

        indexDel = [...new Set(indexDel)][0]

        let samplesDel = []
        let indecesDel = []
        let indexVals = [] // IMPORTANT!

        for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
          let arr = vis.aggregatedSampleString[i].split('-')

          const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
          if (checkAlreadyAggr) {
            samplesDel.push(vis.aggregatedSampleString[i])
            indecesDel.push(
              vis.aggregatedSampleString.indexOf(vis.aggregatedSampleString[i])
            )
            indexVals.push(vis.aggrIndex[i])
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

          vis.aggrIndex = vis.aggrIndex.filter((d) => !indexVals.includes(d))
          vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
            ({ mRNA_id }) => mRNA_id !== nodeDel
          )
        }

      }

      // add new group
      for (let i = 0; i < nodeAggArr.length; i++) {
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

      aggregatedChildsPhenos.push({
        mRNA_id: nodeAgg,
        virulence: [...new Set(virSum)].join('|'),
        species: [...new Set(specieSum)].join('|'),
        strain_name: [...new Set(strainSum)].join('|'),
        group: nr,
      })

      let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id)
      )

      let groupedChilds = d3.groups(
        dataFilteredChilds,
        (d) => d.position,
        (d) => d.nucleotide
        // d => d.informative,
        // d => d.pheno_specific,
        // d => d.variable
      )

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
      vis.aggregatedChilds = [...vis.aggregatedChilds.concat(aggregatedChilds)]
      vis.aggregatedPhenos = [
        ...vis.aggregatedPhenos.concat(aggregatedChildsPhenos),
      ]

      vis.nodesAggArray = [...vis.nodesAggArray.concat(nodeAggArr)] // push new childs to aggregated list

      vis.currentSortAll = vis.rowSorterCurrentAll

      // vis.visualRefSelected = 'none' //!! important
      if (vis.nodesAggArray.includes(vis.visualRefSelected)){
          // set VR back to none
          vis.visualRefSelected = 'none'

      }

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

      d3.select('.phenoBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
      d3.select('.phenoBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible

      d3.select('.rowBrush > .selection').attr('height', '0').attr('y', '-30') //make invisible
      d3.select('.rowBrush > .handle').attr('height', '0').attr('y', '-30') //make invisible
    },
    toggleGroupCollapse() {

      let vis = this

      vis.boolGroups = true

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

          let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
          let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
          let rangeSlice = vis.newSortwithAggregated.slice(
            idx_start,
            idx_end + 1
          )
          for (let i = 0; i < rangeSlice.length; i++) {
            nodeAggArr = nodeAggArr.concat(rangeSlice[i].split('-'))
          }
        }

        // include items alt
        if (vis.altSelection.length > 0) {
          let difference = vis.altSelection.filter(
            (x) => !nodeAggArr.includes(x)
          )
          nodeAggArr = [...nodeAggArr.concat(difference)]

          vis.altSelection = []
        }
        if (vis.childsSelected.length > 0) {
          nodeAggArr = [...new Set([...nodeAggArr.concat(vis.childsSelected)])]
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

          let indexDel = d3.map(groupDel, function (d) {
            return d['group']
          })
          indexDel = [...new Set(indexDel)][0]

          let nodeDel = vis.aggregatedSampleString[indexDel]

          let samplesDel = []
          let indecesDel = []
          let indexVals = []

          for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
            let arr = vis.aggregatedSampleString[i].split('-')

            const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
    
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

            vis.aggregatedPhenos = vis.aggregatedPhenos.filter(
              ({ mRNA_id }) => mRNA_id !== nodeDel
            )
          }

          vis.aggrIndex = vis.aggrIndex.filter((n) => !indexVals.includes(n))

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


        let groupedChilds = d3.groups(
          dataFilteredChilds,
          (d) => d.position,
          (d) => d.nucleotide
          // d => d.informative,
          // d => d.pheno_specific,
          // d => d.variable
        )

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
      var categories = d3.map(data, function (d) {
        return d[attr]
      })
      categories = new Set(categories)
      categories = Array.from(categories)

      return categories
    },
    getCategoryDict(data, categories, attr) {
      let cat_dict = []
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

      return dataSorted
    },
    getRowSorting2(dataCurrent, orderNew, mode = 'median') {
      let data = _.cloneDeep(dataCurrent)
      let dataSorted

      if (this.metadataAttributes.includes(orderNew)) {
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
        dataSorted = this.currentSortAll 
      }

      return dataSorted
    },
   
  },
  created() {
  },
  mounted() {

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

    vis.drawView()


    // Add brush before rowlabels
    vis.rowLabelGroup.selectAll('.rowBrush').call(vis.brushRowLabels)

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
          let indexDel = d3.map(groupDel, function (d) {
            return d['group']
          })

          indexDel = [...new Set(indexDel)][0]

          let nodeDel = vis.aggregatedSampleString[indexDel]

          let samplesDel = []
          let indecesDel = []

          for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
            let arr = vis.aggregatedSampleString[i].split('-')

            const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
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

        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)

        let rangeItems = d3.filter(rangeSlice, function (d) {
          let rangeItemsArr = []
          vis.rangeItemsArr = rangeItemsArr
          return d.split('-').length > 1
        })
        for (let i = 0; i < rangeItems.length; i++) {
          let items = rangeItems[i].split('-')
          vis.rangeItemsArr = [...vis.rangeItemsArr.concat(items)]
        }

        d3.selectAll('.rowLabel').classed('text-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.rowAggr').classed('aggr-selection', function (l, li) {
          return rangeSlice.includes(l)
        })

        d3.selectAll('.specie').classed('text-selection', function (l, li) {

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
     
        let idx_start = Math.floor(selectedRegion[0] / vis.cellSize)
        let idx_end = Math.floor(selectedRegion[1] / vis.cellSize)
        let rangeSlice = vis.newSortwithAggregated.slice(idx_start, idx_end + 1)

        d3.selectAll('.specie').classed('text-selection', function (l, li) {
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
        let selectValue = 'strain_name'
        vis.rowSort = 'strain_name'

        d3.selectAll('.phenoLabel').classed('text-selected', function (d, i) {
          return selectValue == d
        })

        sortRows(selectValue)

      })
      .on('mouseover', function (d) {
        d3.select(this).classed('text-hover', true)
      })
      .on('mouseout', function (d) {
        // on mouseout rect
        d3.select(this).classed('text-hover', false)
      })

    //close grouping pop-up menu
    var span = document.getElementsByClassName('close')[0]
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
      let selectValue = d3.select('#colFilter').property('value')
     
      vis.$store.dispatch('setPositionsFilter', selectValue) //update store

      vis.drawHeatMap(vis.newSortwithAggregated) 
      vis.drawAnnotations()
    })

    // filter rows
    d3.select('#rowFilter').on('change', function () {
      let selectValue = d3.select('#rowFilter').property('value')

      if (selectValue == 'subset') {
        vis.drawBipartite(vis.newSortwithAggregated)
        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
      }
      if (selectValue == 'all') {

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
      d3.selectAll('.rowLabel').classed('text-ref', function (d) {
        return d == selectValue // make label pop out
      })

      vis.drawHeatMap(vis.newSortwithAggregated)
      vis.drawAnnotations(vis.newSortwithAggregated)
    })

    // change sorting rows
    d3.select('#rowSorting').on('change', function () {
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
        return selectValue == d
      })
    })

    // row sort function
    function sortRows(selectValue) {

      vis.rowSort = selectValue
      if (
        (vis.rowSort == 'dendro-default') |
        (vis.rowSort == 'dendro-custom')
      ) {
        vis.rowSortSteps = [vis.rowSort] // reset steps
      } else {
        vis.rowSortSteps.push(vis.rowSort)
      }

      vis.currentSortAll = vis.rowSorterCurrentAll


      vis.drawView()

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
    
    let vis = this

    // delete group
    if (vis.groupToDelete !== null) {
      let group = vis.groupToDelete 
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

        vis.drawHeatMap(vis.newSortwithAggregated)
        vis.drawPhenotypes(vis.newSortwithAggregated)
        vis.drawBipartite(vis.newSortwithAggregated)
      }
      this.$store.dispatch('setGroupsSelected', vis.selectedGroups)
      this.$store.dispatch('setGroupDelete', null)
    }

    // decolor group
    if (vis.groupToDecolor !== null) {
      let group = vis.groupToDecolor 

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]

      let groupDecolor = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })
      let groupString = groupDecolor.sort().join('-')

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
      let group = vis.groupToColor 

      let groupMembers = vis.selectedGroups.filter(function (d) {
        return d.group == group
      })
      let color = d3.map(groupMembers, function (d) {
        return d.color
      })
      color = Array.from(new Set(color))[0]
  
      let groupColor = d3.map(groupMembers, function (d) {
        return d.mRNA_id
      })
      let groupString = groupColor.sort().join('-')

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
      let group = vis.groupToCollapse 

      let groupMembers = vis.selectedGroups.filter(function (d) {
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

        let indexDel = d3.map(groupDel, function (d) {
          return d['group']
        })

        indexDel = [...new Set(indexDel)][0]

        let nodeDel = vis.aggregatedSampleString[indexDel]

        let samplesDel = []
        let indecesDel = []

        for (let i = 0; i < vis.aggregatedSampleString.length; i++) {
          let arr = vis.aggregatedSampleString[i].split('-')

          const checkAlreadyAggr = nodeAggArr.some((r) => arr.includes(r))
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
        vis.aggregatedRows.push({ group: group, mRNA_id: nodeAggArr[i] })
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

      aggregatedChildsPhenos.push({
        mRNA_id: nodeAgg,
        virulence: [...new Set(virSum)].join('|'),
        species: [...new Set(specieSum)].join('|'),
        strain_name: [...new Set(strainSum)].join('|'),
        group: group,
      })

      let dataFilteredChilds = vis.data_heatmap.filter(({ mRNA_id }) =>
        nodeAggArr.includes(mRNA_id)
      )

      let groupedChilds = d3.groups(
        dataFilteredChilds,
        (d) => d.position,
        (d) => d.nucleotide
        // d => d.informative,
        // d => d.pheno_specific,
        // d => d.variable
      )
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
      let group = vis.groupToExpand 

      let groupMembers = vis.selectedGroups.filter(function (d) {
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

      let nodeAggArr = groupExpand.sort()
      let nodeAgg = groupExpand.sort().join('-')

      if (vis.aggregatedSampleString.includes(nodeAgg)) {

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


    if (vis.bool_collapsed) {
      vis.dendroWidth = vis.newDendroWith
      vis.bipartiteWidth = vis.newBipartiteWidth
      vis.bipartiteWidthTotal = vis.newBipartiteWidthTotal
    } else {
 

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
  /* stroke: #eee; */
  /* stroke: darkgrey; */
  stroke: white;
  /* stroke: rgb(195, 204, 204); */
  stroke-width: 0.5px;
  paint-order: fill;
  shape-rendering: crispEdges;
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

#tooltip-mrna {
  position: absolute;
  width: 250px;
  /* height: auto; */
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.9);
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
  /* pointer-events: none; */
}

#tooltip-mrna.hidden {
  display: none;
}

#tooltip-mrna p {
  margin: 0;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 20px;
}

#tooltip {
  position: absolute;
  width: 250px;
  /* height: auto; */
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
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
  /* height: auto; */
  overflow-y: auto;
  height: 100px;
  padding: 10px;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.9);
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

#heatmap {
  /* height: 400px; */
  /* width: 85%; */
  /* width: 510px; */

  /* width: 500px; */
  /* padding-left: 1px; */
  /* overflow-y: auto;
    overflow-x: auto; */
}

/* .outlined {
  outline-color: rgb(0, 0, 255);;
  outline-style: solid;
  outline-width: 2px;
  outline-offset: -2px;
} */

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

  /* padding-left: 1px; */
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

  scrollbar-width: none; /*to hide scrollbars in FireFox */
  -ms-overflow-style: none; /*to hide scrollbars in Edge/IE */

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
