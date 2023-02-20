<template>
  <div class="accordion accordion-flush" id="accordionGroups">
            <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingGroups">
                <div class="card-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseGroups" aria-expanded="true" aria-controls="flush-collapseGroups">
                    <p class="card-header"> Groups</p>
                  </button>
                </div>
              </h2>
              <div id="flush-collapseGroups" class="accordion-collapse collapse show" aria-labelledby="flush-headingGroups" data-bs-parent="#accordionGroups">
                <div class="accordion-body">
                  <ul class="no-marker">
                    <li>
                      <div style="display: flex;">
                        <div style="margin-left: 75px">
                          <i>color</i>
                        </div>
                        <div style="margin-left: 10px">
                          <i>collapse</i>
                        </div>
                      </div>
                    </li>
                    <li v-for="item in groupItems" :key="item" :id="'group-name-'+item.color+''" style="display: flex;justify-content: flex-start;align-items: center;">
                      <button type="button" class="btn-close btn-close" aria-label="Close" @click="deleteGroup(item.group)" :group_id="item.group" :style="'margin-right: ' + 5 + 'px;'"></button>
                      <svg height="10" width="10">
                        <circle cx="5" cy="5" r="4.5" stoke-width="0.5" stroke="#babcbe" :fill="item.colorHex" />
                      </svg>
                      <span style="padding-left: 5px;">{{ 'group '+item.group }}</span>
                 
                        <input v-model="item.checkedColor" class="form-check-input check-color" type="checkbox" @change="colorGroup(item.group)" value="" :id="'color'+item.group+''" style="margin-left: 10px; margin-top: 0px;" >
                        <input v-model="item.checkedCollapse" class="form-check-input check-collapse" type="checkbox" @change="collapseGroup(item.group)" value="" :id="'collapse'+item.group+''" style="margin-left: 25px; margin-top: 0px;" >
                    
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
</template>

<script>
import * as d3 from 'd3'
// import { mapGetters } from 'vuex'
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
      this.$store.dispatch('setGroupDelete', nr) 
      this.$store.getters.getGroupToDelete

      
    },


    colorGroup(nr){

      let checkedVal = d3.select('#color'+nr).property('checked')
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
    },

      collapseGroup(nr){
      let checkedVal = d3.select('#collapse'+nr).property('checked')
    
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
  
    groupItems(){

      let data  = this.$store.getters.getGroupsSelected
     
      let groups = d3.map(data, function(d) {
        return d.group
      })

      let colors = d3.map(data, function(d) {
        return d.color
      })

      let checkedGroups = d3.groups(data, d => d.group,  d => d.checkedColor,  d => d.checkedCollapse)

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

      let dict = []

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

        dict.push({'group':groups[i], 'color': colors[i], 'colorHex': colorCode_i,'checkedColor': checkedColor[i], 'checkedCollapse': checkedCollapse[i]})
      }

      return dict
    }

  },
  updated() {
    this.groupItems
  },
  mounted() {
    // console.log('GroupInfo mounted')

    this.groupItems
   
  },
  created() {
    // console.log('GroupInfo created')
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
  background-color: rgba(225,225,225,0.02);
  font-size: 10px;
}

</style>
