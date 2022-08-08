<template>
  <!-- <div> -->
    <div
    class="card"
    id="info-container"
    style="width: 100%; height: svgHeight * 3; margin-top: 5px;"
  >
    <div class="card-header" style="padding: 0 1em">
      {{ title }}
    </div>
      <ul class="no-marker">

        <li v-for="item in groupItems" :key="item" :id="'group-name-'+item.color+''">
          <button type="button" class="btn-close btn-close" aria-label="Close" @click="deleteGroup(item.group)" :group_id="item.group" :style="'margin-right: ' + 5 + 'px;'"></button>
          <!-- <a class="badge rounded-pill bg-light text-dark" :style="'margin-right: ' + 5 + 'px; background-color: ' +item.color+' !important;'" @click="deleteGroup(item.group)" :group_id="item.group">x</a> -->
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4.5" stoke-width="0.5" stroke="#babcbe" :fill="item.colorHex" />
          </svg>
          <span style="padding-left: 5px;">{{ 'group '+item.group }}</span>
          <!-- <span :style="{color: item.colorHex}">{{ 'group '+item.group }}</span> -->
          <!-- <a-checkbox v-model:checked="checkedColor" @change="colorGroup(item.group)"></a-checkbox> -->
          <input v-model="item.checkedColor" class="form-check-input check-color" type="checkbox" @change="colorGroup(item.group)" value="checked" :id="'color'+item.group+''" style="margin-left: 5px; margin-top: 3px;" >

          <input v-model="item.checkedCollapse" class="form-check-input check-collapse" type="checkbox" @change="collapseGroup(item.group)" value="" :id="'collapse'+item.group+''" style="margin-left: 5px; margin-top: 3px;" >
          
        </li>
      </ul>
  </div>
</template>

<script>
import * as d3 from 'd3'
// import { mapGetters } from 'vuex'
// import {
//   CloseCircleOutlined
// } from '@ant-design/icons-vue'
import _ from 'lodash'

export default {
  name: 'GroupInfo',
  components: {},

  props: {
    title: String,
  },
  data(){

    return{
      checkedColor: true,
    }
  

  },
  
  methods: {

    deleteGroup(nr){
      console.log('delete group', nr)
      this.$store.dispatch('setGroupDelete', nr) 
      this.$store.getters.getGroupToDelete

      
    },


    colorGroup(nr){

      let checkedVal = d3.select('#color'+nr).property('checked')
    
      console.log('color group', nr, checkedVal)
      let dataPrevious  = _.cloneDeep(this.$store.getters.getGroupsSelected)

      if (checkedVal == false){

        //update value in dict
        
        for (let i=0; i< dataPrevious.length; i++){
          if (dataPrevious[i]['group'] == nr){
            dataPrevious[i]['checkedColor'] = false

          }
          
        }

        this.$store.dispatch('setGroupsSelected', dataPrevious)

        this.$store.dispatch('setGroupDecolor', nr) 

      }
      else{

        for (let i=0; i< dataPrevious.length; i++){
          if (dataPrevious[i]['group'] == nr){
            dataPrevious[i]['checkedColor'] = true

          }
          
        }

        this.$store.dispatch('setGroupsSelected', dataPrevious)

        this.$store.dispatch('setGroupColor', nr) 
      }

      // // get current value checkbox
      // let currentVal = d3.select('#color'+nr).attr('value')

      // if (currentVal == "checked"){
      //   this.$store.dispatch('setGroupDecolor', nr) 
      //   this.$store.getters.getGroupToDecolor

      //   d3.select('#color'+nr).attr('value', '')

      // }
      // else{
      //   this.$store.dispatch('setGroupColor', nr) 
      //   this.$store.getters.getGroupToColor

      //   d3.select('#color'+nr).attr('value', 'checked')
      // }
    },

      collapseGroup(nr){
      console.log('collapse group', nr)

      // get current value checkbox
      // let currentVal = d3.select('#collapse'+nr).attr('value')

      // if (currentVal == "checked"){
      //   this.$store.dispatch('setGroupExpand', nr) 
      //   this.$store.getters.getGroupToExpand

      //   d3.select('#collapse'+nr).attr('value', '')

      // }
      // else{
      //   this.$store.dispatch('setGroupCollapse', nr) 
      //   this.$store.getters.getGroupToCollapse

      //   d3.select('#collapse'+nr).attr('value', 'checked')
      // }

      let checkedVal = d3.select('#collapse'+nr).property('checked')
    
      console.log('color group', nr, checkedVal)
      let dataPrevious  = _.cloneDeep(this.$store.getters.getGroupsSelected)

      if (checkedVal == false){

        //update value in dict
        
        for (let i=0; i< dataPrevious.length; i++){
          if (dataPrevious[i]['group'] == nr){
            dataPrevious[i]['checkedCollapse'] = false

          }
          
        }

        this.$store.dispatch('setGroupsSelected', dataPrevious)
        this.$store.dispatch('setGroupExpand', nr)  

      }
      else{

        for (let i=0; i< dataPrevious.length; i++){
          if (dataPrevious[i]['group'] == nr){
            dataPrevious[i]['checkedCollapse'] = true

          }
          
        }

        this.$store.dispatch('setGroupsSelected', dataPrevious)
        this.$store.dispatch('setGroupCollapse', nr)

   
      }

      
    }


  },
  computed: {
    // checkedColor(){

    //   return true

    // },
    groupItems(){

      let data  = this.$store.getters.getGroupsSelected
      // let dataAggr  = this.$store.getters.getGroups
      console.log('data group info', data)
      // console.log('data groups aggr', dataAggr)

      // let groupsAggr = d3.map(dataAggr, function(d) {
      //   return d.group
      // })

      // let colorsAggr = d3.map(dataAggr, function(d) {
      //   return d.color
      // })

      // let checkedGroupsAggr = d3.groups(dataAggr, d => d.group,  d => d.checkedColor,  d => d.checkedCollapse)
      // console.log('checkedGroupsAggr', checkedGroupsAggr)

      // let checkedColorAggr = []
      // let checkedCollapseAggr = []
      
      // for (let i =0; i< checkedGroupsAggr.length; i++){
      //   let checkColor = checkedGroupsAggr[i][1][0][0]
      //   let checkCollapse = checkedGroupsAggr[i][1][0][1][0][0]
      //   checkedColorAggr.push(checkColor)
      //   checkedCollapseAggr.push(checkCollapse)
      // }
      
      // groupsAggr = Array.from(new Set(groupsAggr))
      // colorsAggr = Array.from(new Set(colorsAggr))

      let groups = d3.map(data, function(d) {
        return d.group
      })

      let colors = d3.map(data, function(d) {
        return d.color
      })

      // let colorCodes = d3.map(data, function(d) {
      //   return d.colorHex
      // })

      let checkedGroups = d3.groups(data, d => d.group,  d => d.checkedColor,  d => d.checkedCollapse)
      console.log('checkedGroups', checkedGroups)


      let checkedColor = []
      let checkedCollapse = []
      
      for (let i =0; i< checkedGroups.length; i++){
      let checkColor = checkedGroups[i][1][0][0]
      let checkCollapse = checkedGroups[i][1][0][1][0][0]
      checkedColor.push(checkColor)
      checkedCollapse.push(checkCollapse)
      }
      
      groups = Array.from(new Set(groups))
      colors = Array.from(new Set(colors))
      // colorCodes = Array.from(new Set(colorCodes))
      // checkedColor = Array.from(new Set(checkedColor))

      console.log('checked Array', checkedColor)

      let dict = []
      // for (let i=0; i< groupsAggr.length; i++ ){
      //   dict.push({'group':groupsAggr[i], 'color': colorsAggr[i], 'checkedColor': checkedColorAggr[i], 'checkedCollapse': checkedCollapseAggr[i]})
      // }
      for (let i=0; i< groups.length; i++ ){

        let color_i = colors[i]

        let colorCode_i = d3.map(data, function (d) {

          if (d.color == color_i){
            return d.colorHex
          }
        })
        colorCode_i = new Set(colorCode_i)
        colorCode_i = Array.from(colorCode_i)

        colorCode_i = colorCode_i.filter(function( element ) {
          return element !== undefined;
        });

        console.log('colorCode_i', colorCode_i[0])
        debugger

        dict.push({'group':groups[i], 'color': colors[i], 'colorHex': colorCode_i,'checkedColor': checkedColor[i], 'checkedCollapse': checkedCollapse[i]})
      }

      console.log('groupItems', dict)

      return dict
    }

  },
  updated() {
    this.groupItems
  },
  mounted() {
    console.log('GroupInfo mounted')
    // console.log('checking data', this.$store.state.homologyData.trees.nuc)

    this.groupItems
    // let vis = this;

    // d3.select('#chosenHomId').on('change', function () {
    //   //console.log('change rowSorting')
    //   let selectValue = d3.select('#chosenHomId').property('value')

    //   vis.$store.dispatch('setHomologyId', selectValue) 
    //   console.log(vis.$store.getters.getPhenos)


    // })
  },
  created() {
    console.log('GroupInfo created')
  },
}
</script>

<style>
.delete {
  font-size: 18px;
  cursor: pointer;
}


.no-marker {
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-left: 15px;
  background-color: rgba(225,225,225,0.02);
  font-size: 10px;
}

</style>
