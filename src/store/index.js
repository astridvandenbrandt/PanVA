import { createStore } from 'vuex'
import axios from 'axios'
import * as d3 from 'd3'

export default createStore({
  state: {
    isDataLoaded: false,
    homologyIds: [],
    chosenHomologyId: 13803671, 
    homologyGroup: [],
    alignedPositions: [],
    dendrogramDefault: null,
    accessionsSort: 'dendro-default',
    positionsFilter: 'all',
    positionsCheckboxes: [],
    selectedPositions: [],
    sequences: [],
    variablePositionsCount: [],
    selectedRegion: '1-40',
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
  },
  mutations: {
    setIsDataLoaded: (state, isDataLoaded) => {
      console.log('[mutation] setIsDataLoaded', isDataLoaded)
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
    setPhenos: (state, phenos) => {
      console.log('[mutation] setPhenos', phenos)
      state.phenos = phenos
    },
    setCurrentSortingOrderRows: (state, currentSortingOrderRows) => {
      console.log(
        '[mutation] setCurrentSortingOrderRows',
        currentSortingOrderRows
      )
      state.currentSortingOrderRows = currentSortingOrderRows
    },
    setCurrentSortingOrderWithAggr: (state, currentSortingOrderWithAggr) => {
      console.log(
        '[mutation] setCurrentSortingOrderWithAggr',
        currentSortingOrderWithAggr
      )
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
  },
  actions: {

    async updateViews({ dispatch, commit }, id) {
      commit('setIsDataLoaded', false)
      commit('setGroupsSelected', [])
      commit('setGroups', [])
      commit('setGroupDelete', null)
      commit('setGroupDecolor', null)
      commit('setGroupColor', null)
      commit('setSelectedRegion', '1-40')

      commit('setChosenHomologyId', id)

      await dispatch('fetchSequences', id)
      await dispatch('fetchVarPosCount', id)
      await dispatch('fetchAlignedPositions', id)
      await dispatch('fetchPhenos', id)
      await dispatch('fetchDendrogramDefault', id)

      commit('setIsDataLoaded', true)
    },
    async fetchHomologyIds({ commit }) {
      const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/homology_ids`)
      
      commit('setHomologyIds', response.data)
    },
    async fetchHomologyGroup({ commit }, id) {
      const response = await axios.get(`${process.env.VUE_APP_FLASK_URL}/${id}`)
      
      commit('setHomologyGroup', response.data)
    },
  
    async fetchAlignedPositions({ commit },  id ) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/al_pos`)

      commit('setAlignedPositions', response)
    },
    async fetchSequences({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/sequences`)

      commit('setSequences', response)
    },
    async fetchVarPosCount({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/var_pos_count`)
      commit('setVarPosCount', response)
    },
    async fetchPhenos({ commit }, id) {
      const response = await d3.csv(`${process.env.VUE_APP_FLASK_URL}/${id}/phenos`)
      commit('setPhenos', response)
    },
    async fetchDendrogramDefault({ commit }, id) {
      const response = await d3.json(`${process.env.VUE_APP_FLASK_URL}/${id}/d3dendro`)

      commit('setDendrogramDefault', response)
    },
    setHomologyId({ commit }, id) {
      commit('setChosenHomologyId', id)
    },
    setSelectedPositions({ commit }, positionList) {
      commit('setSelectedPositions', positionList)
    },
    setSelectedRegion({ commit }, region) {
      commit('setSelectedRegion', region)
    },
    setAccessionsSort({ commit }, option) {
      commit('setAccessionsSort', option)
    },
    setPositionsFilter({ commit }, option) {
      commit('setPositionsFilter', option)
    },
    setPositionsCheckboxes({ commit }, positionList) {
      commit('setPositionsCheckboxes', positionList)
    },
    setCurrentSortingOrderRows({ commit }, order) {
      commit('setCurrentSortingOrderRows', order)
    },
    setCurrentSortingOrderWithAggr({ commit }, order) {
      commit('setCurrentSortingOrderWithAggr', order)
    },
    setGroups({ commit }, grouping) {
      commit('setGroups', grouping)
    },
    setGroupsSelected({ commit }, grouping) {
      commit('setGroupsSelected', grouping)
    },
    setGroupDelete({ commit }, group) {
      commit('setGroupDelete', group)
    },
    setGroupDecolor({ commit }, group) {
      commit('setGroupDecolor', group)
    },
    setGroupColor({ commit }, group) {
      commit('setGroupColor', group)
    },
    setGroupExpand({ commit }, group) {
      commit('setGroupExpand', group)
    },
    setGroupCollapse({ commit }, group) {
      commit('setGroupCollapse', group)
    },
  },
  getters: {
    homologyIdList: (state) => {
      return state.homologyIds.map((value) => value.homology_id)
    },
    homologyList: (state) => {
      return state.homologyIds
    },
    chosenHomologyId: (state) => {
      return parseInt(state.chosenHomologyId)
    },
    selectedRegion: (state) => {
      return state.selectedRegion
    },
    // get additional info for chosen id
    getHomologyInfoById: (state, getters) => {
      return state.homologyIds.find(
        (item) => item.homology_id === getters.chosenHomologyId
      )
    },
    getHomologyGroup: (state) => {
      return state.homologyGroup
    },
    getAlignedPositions: (state) => {
      return state.alignedPositions
    },
    getSequences: (state) => {
      return state.sequences
    },
    getVarPosCount: (state) => {
      return state.variablePositionsCount
    },
    getPhenos: (state) => {
      return state.phenos
    },
    getDendrogramDefault: (state) => {
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
      return state.groupDelete
    },
    getGroupToDecolor: (state) => {
      return state.groupDecolor
    },
    getGroupToColor: (state) => {
      return state.groupColor
    },
    getGroupToExpand: (state) => {
      return state.groupExpand
    },
    getGroupToCollapse: (state) => {
      return state.groupCollapse
    },
  },
})
