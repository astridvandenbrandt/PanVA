import { createStore } from 'vuex'
// import homologyIds from '@/database/data_homology_ids.json'
// import homologyData from '@/api/13805694.json' // this should be replaced by an API call
import axios from 'axios'
import * as d3 from 'd3'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

export default createStore({
  state: {
    isDataLoaded: false,
    homologyIds: [],
    chosenHomologyId: 14541976,//14522883,
    // homologyData: homologyData,
    homologyGroup: [],
    alignedPositions: [],
    dendrogramDefault: null,
    accessionsSort: 'dendro-default',
    positionsFilter: 'all',
    positionsCheckboxes: [],
    selectedPositions: [],
    sequences: [],
    variablePositionsCount: [],
    nucStructure: [],
    selectedRegion: '1-49',
    phenos: [],
    currentSortingOrderRows: [],
    currentSortingOrderWithAggr: [],
    groups: [],
    groupsSelected: [],
    groupDelete: null,
    groupDecolor: null,
    groupColor: null,
    groupExpand: null,
    groupCollapse: null,
    annotationReference: "no-choice",

    //not yet implemented:
    sequenceInfo: [],
    trees: [],
  },
  mutations: {
    setIsDataLoaded: (state, isDataLoaded) => {
      console.log('[mutation] setDataLoaded', isDataLoaded)
      state.isDataLoaded = isDataLoaded
    },
    setHomologyIds: (state, homologyIds) => {
      console.log('[mutation] setHomologyIds', homologyIds)
      state.homologyIds = homologyIds
    },
    setChosenHomologyId: (state, chosenHomologyId) => {
      console.log('[mutation] setChosenHomologyId', chosenHomologyId)
      state.chosenHomologyId = chosenHomologyId
    },
    setSelectedRegion: (state, selectedRegion) => {
      console.log('[mutation] setSelectedRegion', selectedRegion)
      state.selectedRegion = selectedRegion
    },
    setHomologyGroup: (state, homologyGroup) => {
      console.log('[mutation] setHomologyGroup', homologyGroup)
      state.homologyGroup = homologyGroup
    },
    setAlignedPositions: (state, alignedPositions) => {
      console.log('[mutation] setAlignedPositions', alignedPositions)
      state.alignedPositions = alignedPositions
    },
    setDendrogramDefault: (state, dendrogramDefault) => {
      console.log('[mutation] setDendrogramDefault', dendrogramDefault)
      state.dendrogramDefault = dendrogramDefault
    },
    setAccessionsSort: (state, accessionsSort) => {
      console.log('[mutation] setAccessionsSort', accessionsSort)
      state.accessionsSort = accessionsSort
    },
    setPositionsFilter: (state, positionsFilter) => {
      console.log('[mutation] setPositionFilter', positionsFilter)
      state.positionsFilter = positionsFilter
    },
    setSelectedPositions: (state, selectedPositions) => {
      console.log('[mutation] setSelectedPositions', selectedPositions)
      state.selectedPositions = selectedPositions
    },
    setPositionsCheckboxes: (state, positionsCheckboxes) => {
      console.log('[mutation] setPositionsCheckboxes', positionsCheckboxes)
      state.positionsCheckboxes = positionsCheckboxes
    },
    setSequences: (state, sequences) => {
      console.log('[mutation] setSequences', sequences)
      state.sequences = sequences
    },
    setVarPosCount: (state, variablePositionsCount) => {
      console.log('[mutation] setVarPosCount', variablePositionsCount)
      state.variablePositionsCount = variablePositionsCount
    },
    setNucStructure: (state, nucStructure) => {
      console.log('[mutation] setNucStructure', nucStructure)
      state.nucStructure = nucStructure
    },
    setPhenos: (state, phenos) => {
      console.log('[mutation] setPhenos', phenos)
      state.phenos = phenos
    },
    setCurrentSortingOrderRows: (state, currentSortingOrderRows) => {
      console.log('[mutation] setCurrentSortingOrderRows', currentSortingOrderRows)
      state.currentSortingOrderRows = currentSortingOrderRows
    },
    setCurrentSortingOrderWithAggr: (state, currentSortingOrderWithAggr) => {
      console.log('[mutation] setCurrentSortingOrderWithAggr', currentSortingOrderWithAggr)
      state.currentSortingOrderWithAggr = currentSortingOrderWithAggr
    },
    setGroups: (state, groups) => {
      console.log('[mutation] setGroups', groups)
      state.groups = groups
    },
    setGroupsSelected: (state, groupsSelected) => {
      console.log('[mutation] setGroupsSelected', groupsSelected)
      state.groupsSelected = groupsSelected
    },
    setGroupDelete: (state, groupDelete) => {
      console.log('[mutation] setGroupDelete', groupDelete)
      state.groupDelete = groupDelete
    },
    setGroupDecolor: (state, groupDecolor) => {
      console.log('[mutation] setGroupDecolor', groupDecolor)
      state.groupDecolor = groupDecolor
    },
    setGroupColor: (state, groupColor) => {
      console.log('[mutation] setGroupColor', groupColor)
      state.groupColor = groupColor
    },
    setGroupExpand: (state, groupExpand) => {
      console.log('[mutation] setGroupExpand', groupExpand)
      state.groupExpand = groupExpand
    },
    setGroupCollapse: (state, groupCollapse) => {
      console.log('[mutation] setGroupCollapse', groupCollapse)
      state.groupCollapse = groupCollapse
    },
    setAnnotationRef: (state, annotationReference) => {
      console.log('[mutation] setGroupCollapse', annotationReference)
      state.annotationReference = annotationReference
    },
  },
  actions: {
    async updateGeneOverview({ dispatch, commit }, id) {
      // console.log('[action] setChosenHomologyId', id)
      commit('setChosenHomologyId', id)
      await dispatch('fetchSequences', id) 
      await dispatch('fetchVarPosCount', id)
      await dispatch('fetchNucStructure', id)


    },
    async updateLocusView({ dispatch }, id) {
  
      await dispatch('fetchAlignedPositions', {id})
      await dispatch('fetchPhenos', id)
      await dispatch('fetchDendrogramDefault', id) 
      await dispatch('fetchNucStructure', id)



    },
    async updateViews({ dispatch, commit }, id) {
      commit('setIsDataLoaded', false)
      commit('setGroupsSelected', [])
      commit('setGroups', [])
      commit('setGroupDelete', null)
      commit('setGroupDecolor', null)
      commit('setGroupColor', null)
      commit('setAnnotationRef', 'no-choice')
      commit('setSelectedRegion', '1-40')

      commit('setChosenHomologyId', id)

      await dispatch('fetchSequences', id)
      await dispatch('fetchVarPosCount', id)
      await dispatch('fetchNucStructure', id)
      await dispatch('fetchAlignedPositions', id)
      await dispatch('fetchPhenos', id)
      await dispatch('fetchDendrogramDefault', id)

      commit('setIsDataLoaded', true)
    },

    // JSON server: port 3000, FLASK server: port 5000
    async fetchHomologyIds({ commit }) {
      const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/homology_ids`)
      // console.log('[action] fetchHomologyIds', response.data)
      commit('setHomologyIds', response.data)
    },
    async fetchHomologyGroup({ commit }, id) {
      const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}`)
      // console.log('[action] fetchHomologyGroup', response.data)
      commit('setHomologyGroup', response.data)
    },
    // async fetchAlignedPositions({ commit }, { id, region }) {
    //   // console.log('id', id)
    //   // console.log('region', region)

    //   // const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`)
    //   const response = await d3.csv(
    //     `${process.env.VUE_APP_FLASK_URL}/${id}/al_pos/${region}`
    //   )

    //   console.log('[action] fetchAlignedPositions')
    //   commit('setAlignedPositions', response)
    // },
    async fetchAlignedPositions({ commit },  id) {
      console.log('id', id)

      // const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`)
      const response = await d3.csv(
        `${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`
      )

      // console.log('[action] fetchAlignedPositions')
      commit('setAlignedPositions', response)
    },
    async fetchSequences({ commit }, id) {
      // const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`)
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/sequences`)

      // console.log('[action] fetchSequences')
      commit('setSequences', response)
    },
    async fetchVarPosCount({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/var_pos_count`)
      // console.log('[action] fetchVarPosCount')
      commit('setVarPosCount', response)
    },
    async fetchNucStructure({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/nuc_structure`)
      // console.log('[action] etchVarPosCount')
      commit('setNucStructure', response)
    },
    async fetchPhenos({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/phenos`)
      // console.log('[action] fetchPhenos')
      commit('setPhenos', response)
    },
    async fetchDendrogramDefault({ commit }, id) {
      // const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`)
      const response = await d3.json(`${process.env.VUE_APP_FLASK_URL}/${id}/d3dendro`, {
        headers: new Headers({
          "content-type": "application/json"
        })
      })

      // console.log('[action] fetchDendrogramDefault')
      commit('setDendrogramDefault', response)
    },
    setHomologyId({ commit }, id) {
      // console.log('[action] setChosenHomologyId', id)
      commit('setChosenHomologyId', id)
    },
    setSelectedPositions({ commit }, positionList) {
      // console.log('[action] setSelectedPositions', positionList)
      commit('setSelectedPositions', positionList)
    },
    setSelectedRegion({ commit }, region) {
      // console.log('[action] setSelectedRegion', region)
      commit('setSelectedRegion', region)
    },
    setAccessionsSort({ commit }, option) {
      // console.log('[action] setAccessionsSort', option)
      commit('setAccessionsSort', option)
    },
    setPositionsFilter({ commit }, option) {
      console.log('[action] setPositionsFilter', option)
      commit('setPositionsFilter', option)
    },
    setPositionsCheckboxes({ commit }, positionList) {
      // console.log('[action] setPositionsCheckboxes', positionList)
      commit('setPositionsCheckboxes', positionList)
    },
    setCurrentSortingOrderRows({ commit }, order) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setCurrentSortingOrderRows', order)
    },
    setCurrentSortingOrderWithAggr({ commit }, order) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setCurrentSortingOrderWithAggr', order)
    },
    setGroups({ commit }, grouping) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroups', grouping)
    },
    setGroupsSelected({ commit }, grouping) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupsSelected', grouping)
    },
    setGroupDelete({ commit }, group) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupDelete', group)
    },
    setGroupDecolor({ commit }, group) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupDecolor', group)
    },
    setGroupColor({ commit }, group) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupColor', group)
    },
    setGroupExpand({ commit }, group) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupExpand', group)
    },
    setGroupCollapse({ commit }, group) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setGroupCollapse', group)
    },
    setAnnotationRef({ commit }, ref) {
      // console.log('[action] setCurrentSortingOrderRows', order)
      commit('setAnnotationRef', ref)
    },
  },
  getters: {
    homologyIdList: (state) => {
      // console.log('[getter] homologyIdList', state.homologyIds.map((value) => value.homology_id))
      return state.homologyIds.map((value) => value.homology_id)
    },
    homologyList: (state) => {
      // console.log('[getter] homologyList', state.homologyIds)
      return state.homologyIds
    },
    chosenHomologyId: (state) => {
      // console.log('[getter] chosenHomologyId', state.chosenHomologyId)
      return parseInt(state.chosenHomologyId)
    },
    selectedRegion: (state) => {
      // console.log('[getter] chosenHomologyId', state.chosenHomologyId)
      return state.selectedRegion
    },
    // get additional info for chosen id
    getHomologyInfoById: (state, getters) => {
      // console.log('[getter] getHomologyInfoById', state.chosenHomologyId)
      return state.homologyIds.find(
        (item) => item.homology_id === getters.chosenHomologyId
      )
    },
    getHomologyGroup: (state) => {
      // console.log('[getter] homologyGroup', state.homologyGroup)
      return state.homologyGroup
    },
    getAlignedPositions: (state) => {
      // console.log('[getter] getAlignedPositions')
      return state.alignedPositions
    },
    getSequences: (state) => {
      // console.log('[getter] getSequences', state.sequences)
      return state.sequences
    },
    getVarPosCount: (state) => {
      return state.variablePositionsCount
    },
    getNucStructure: (state) => {
      return state.nucStructure
    },
    getPhenos: (state) => {
      return state.phenos
    },
    getDendrogramDefault: (state) => {
      // console.log('[getter]  getDendrogramDefault')
      return state.dendrogramDefault
    },
    selectedPositions: (state) => {
      return state.selectedPositions
    },
    positionsCheckboxes: (state) => {
      return state.positionsCheckboxes
    },
    accessionsSort: (state) => {
      return state.accessionsSort
    },
    positionsFilter: (state) => {
      return state.positionsFilter
    },
    getCurrentSortingOrderRows: (state) => {
      return state.currentSortingOrderRows
    },
    getCurrentSortingOrderWithAggr: (state) => {
      return state.currentSortingOrderWithAggr
    },
    getGroups: (state) => {
      return state.groups
    },
    getGroupsSelected: (state) => {
      return state.groupsSelected
    },
    getGroupToDelete: (state) => {
      console.log('[getter] getGroupToDelete', state.groupDelete)
      return state.groupDelete
    },
    getGroupToDecolor: (state) => {
      console.log('[getter] getGroupToDecolor', state.groupDecolor)
      return state.groupDecolor
    },
    getGroupToColor: (state) => {
      console.log('[getter] getGroupToColor', state.groupColor)
      return state.groupColor
    },
    getGroupToExpand: (state) => {
      console.log('[getter] getGroupToExpand', state.groupExpand)
      return state.groupExpand
    },
    getGroupToCollapse: (state) => {
      console.log('[getter] getGroupToCollapse', state.groupCollapse)
      return state.groupCollapse
    },
    getAnnotationRef: (state) => {
      console.log('[getter] getAnnotationRef', state.annotationReference)
      return state.annotationReference
    },
  },
})
