<template>
  <div
    class="card"
    id="gene-container"
    :style="{ 'height':  svgHeight*4 +'px'}"
  >
    <div class="card-header" style="padding: 0 1em">
      {{ title }}
    </div>
    <a-row>
      <!-- <a-col :span="3">
          <div class="container leftContainer emptyDiv">
            <div class="iconsSelect">
              <div class="iconsDiv" style="display: inline-block">
                <InfoCircleOutlined />
              </div>
              <div style="width: calc(100% - 25px); display: inline-block">
                <select
                  class="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option value="no-choice" selected disabled>
                    Annotation ref
                  </option> -->
      <!-- <option value="initial">Initial</option>
                          <option value="dendro-default">Dendrogram Default</option>
                          <option value="dendro-custom">Dendrogram Custom</option>
                          <option value="position-custom">Nucleotide (single position)</option> -->
      <!-- </select>
              </div>
            </div>
            <div class="iconsSelect">
              <div class="iconsDiv" style="display: inline-block">
                <InfoCircleOutlined />
              </div>
              <div style="width: calc(100% - 25px); display: inline-block">
                <select
                  class="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                >
                  <option value="no-choice" selected disabled>Protein ref</option> -->
      <!-- <option value="initial">Initial</option>
                          <option value="dendro-default">Dendrogram Default</option>
                          <option value="dendro-custom">Dendrogram Custom</option>
                          <option value="position-custom">Nucleotide (single position)</option> -->
      <!-- </select>
              </div>
            </div>
          </div>
        </a-col> -->
      <a-col :span="24">
        <svg id="geneOverviewSvg" width="100%" :height="svgHeight * 3">
          <g
            id="geneOverview"
            :transform="'translate(' + 30 + ',' + 10 + ')'"
          ></g>
        </svg>
      </a-col>
    </a-row>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
// import { InfoCircleOutlined } from '@ant-design/icons-vue'

export default {
  name: 'GeneOverview',
  components: {
    // InfoCircleOutlined,
  },
  props: {
    title: String,
    data_seqs: {},
    data_var_pos: {},
    bool_collapsed: Boolean,
  },
  data() {
    return {
      name: 'GeneOverview',
      msg: '👋 from the Gene Overview',
      svgWidth: 1200,
      svgHeight: 20,
      start: 0,
      end: 100,

      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    }
  },
  computed: {
    lengthGene() {
      return this.data_seqs[0].nuc_trimmed_seq.length
    },
    nrSequences() {
      return this.data_seqs.length
    },
    consensusXvalues() {
      var xValues = d3.map(this.data_var_pos, function (d) {
        return parseInt(d.position)
      })

      //   console.log('consensusXvalues: ', xValues)
      return xValues
    },
    consensusYvalues() {
      var yValues = d3.map(this.data_var_pos, function (d) {
        return parseInt(d.conservation)
      })

      //   console.log('consensusYvalues: ', yValues)
      return yValues
    },
    conservedXvalues() {
      const arrayGene = [
        ...Array.from({ length: this.lengthGene }, (_, i) => i + 1),
      ]
      const arrConsensus = this.consensusXvalues
      return arrayGene.filter((item) => !arrConsensus.includes(item))
    },
    conservedYvalues() {
      const arr = []
      const total = this.lengthGene - this.data_var_pos.length

      for (let i = 0; i < total; i++) {
        arr.push(this.nrSequences)
      }

      return arr
    },
    allX() {
      return this.conservedXvalues.concat(this.consensusXvalues)
    },
    allY() {
      return this.conservedYvalues.concat(this.consensusYvalues)
    },
    allScores() {
      let that = this
      var z = this.allX.map(function (e, i) {
        // return [e, that.allY[i]]
        return [e, (that.allY[i] / that.nrSequences) * 100] // percent
      })

      z.sort(sortFunction)

      function sortFunction(a, b) {
        if (a[0] === b[0]) {
          return 0
        } else {
          return a[0] < b[0] ? -1 : 1
        }
      }
      return z
    },
    xScale() {
      return d3
        .scaleLinear()
        .domain([1, this.lengthGene])
        .range([0, this.svgWidth])
    },
    yScale() {
      return (
        d3
          .scaleLinear()
          // .domain([0, this.nrSequences])
          .domain([0, 100]) // percent
          .range([this.svgHeight, 0])
      )
    },
    brushRegion() {
      let selected = this.$store.getters.selectedRegion
      const region = selected.split('-')
      let start = parseInt(region[0])
      let end = parseInt(region[1])

      return [start, end]
    },
  },
  methods: {
    drawGeneIntrons() {
      console.log('drawing gene overview..')
      //   console.log('all score data', this.allScores)

      let vis = this

      vis.geneOverviewGroup
        .selectAll('.line-all')
        .data([vis.allScores], (d) => d)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'line-all')
              .attr('fill', 'rgba(211,211,211, 0.4)')
              .attr('stroke', 'rgba(190,190,190, 1)')
              // .attr("stroke-width", 1)

              //line instead of area
              // .attr("d", d3.line()
              // .x(function(d) {
              //     // console.log('d x', d[0])
              //     return vis.xScale(d[0])
              // })
              // .y(function(d) {
              //     // console.log('d y', d[1])
              //     return vis.yScale(d[1]) })
              // .curve(d3.curveMonotoneX)),

              .attr(
                'd',
                d3
                  .area()
                  .x(function (d) {
                    return vis.xScale(d[0])
                  })
                  .y0(vis.yScale(0))
                  .y1(function (d) {
                    return vis.yScale(d[1])
                  })
                  .curve(d3.curveMonotoneX)
              ),
          (update) => update,
          (exit) => exit.remove()
        )
    },

    drawGeneBrush() {
      console.log('drawing gene brush..')

      let vis = this

      //   console.log('brushRegion', vis.brushRegion)

      vis.geneOverviewGroup
        .selectAll('.brush')
        .call(vis.brush)
        .call(vis.brush.move, vis.brushRegion.map(vis.xScale))

      updateLabelBrush('left', vis.brushRegion[0], vis.brushRegion[1])
      updateLabelBrush('right', vis.brushRegion[0], vis.brushRegion[1])

      vis.brush.on('end', brushed) //change 'end' to 'brush' if want to see inbetween
      vis.brush.on('start brush', updateLabels)

      function brushed({ selection }) {
        // console.log('selection', selection)
        const [x0, x1] = selection.map(vis.xScale.invert)
        // console.log('selection inverted', [Math.round(x0), Math.round(x1)])
        let region = [Math.round(x0), Math.round(x1)]
        let slice = region[0] + '-' + region[1]
        // console.log('slice', slice)

        vis.$emit('regionBrush', slice)
        vis.$store.dispatch('setSelectedRegion', slice) // update store

        // console.log('store selectedRegion', vis.$store.getters.selectedRegion)

        // vis.$store.dispatch('fetchAlignedPositions', {
        //   id: vis.$store.getters.chosenHomologyId,
        //   region: vis.$store.getters.selectedRegion,
        // })
      }

      function updateLabels({ selection }) {
        const [x0, x1] = selection.map(vis.xScale.invert)
        // console.log('selection inverted', [Math.round(x0), Math.round(x1)])
        let region = [Math.round(x0), Math.round(x1)]

        updateLabelBrush('left', region[0], region[1])
        updateLabelBrush('right', region[0], region[1])
      }

      // updates labels brush
      function updateLabelBrush(side, start, end) {
        if (side == 'left') {
          var brushClass = '.brushLabelL'
          var style = 'end'
          var data = [start]
          var xPos = 0
        } else {
          brushClass = '.brushLabelR'
          style = 'start'
          data = [end]
          xPos = 1
        }
        const textUpdate = vis.svgContextLabels.selectAll(brushClass).data(data)

        textUpdate.selectAll('text').remove() //remove old label

        const textEnter = textUpdate.append('text')

        const textExit = textUpdate.exit().remove()

        textEnter
          .merge(textUpdate)
          .style('text-anchor', style)
          .attr('x', [start, end].map(vis.xScale)[xPos])
          // .attr("y", vis.svgHeight + 16)
          .attr('y', -2)
          .text((d) => d)
      }
    },
    generateRange(min, max, step) {
      let arr = []
      for (let i = min; i <= max; i += step) {
        if (i == min) {
          arr.push(i)
        } else {
          arr.push(i - 1)
        }
      }

      return arr
    },

    drawGeneExons() {
      console.log('drawing gene selection..')

      let vis = this

      // const selectedScores = []
      // for (let i = 0; i <  vis.allScores.length; i++) {
      //     // console.log('i', i, vis.allScores[i][0])
      //     if (vis.allScores[i][0] >= vis.brushRegion[0] && vis.allScores[i][0] < vis.brushRegion[1]){
      //     selectedScores.push(vis.allScores[i])
      //     }

      // }
      // console.log('selectedScores', selectedScores)

      vis.geneOverviewGroup
        .selectAll('.line-select')
        .data([vis.allScores], (d) => d)
        // .data([selectedScores], d => d)
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('class', 'line-select')
              // .attr("fill", "rgba(100,149,237, 0.7)")
              // .attr("stroke", "cornflowerblue")
              .attr('fill', 'rgba(128,128,128, 0.4)')
              .attr('stroke', 'rgba(128,128,128, 1)')
              // .attr("stroke-width", 1)

              //line instead of area
              // .attr("d", d3.line()
              // .x(function(d) {
              //     // console.log('d x', d[0])
              //     return vis.xScale(d[0])
              // })
              // .y(function(d) {
              //     // console.log('d y', d[1])
              //     return vis.yScale(d[1]) })
              // .curve(d3.curveMonotoneX)),

              .attr(
                'd',
                d3
                  .area()
                  .x(function (d) {
                    return vis.xScale(d[0])
                  })
                  .y0(vis.yScale(0))
                  .y1(function (d) {
                    return vis.yScale(d[1])
                  })
                  .curve(d3.curveMonotoneX)
              ),
          (update) => update,
          (exit) => exit.remove()
        )
    },
  },
  created() {
    console.log(this.name + ' created')
  },
  mounted() {
    console.log(this.name + ' mounted')

    this.svgWidth = document.getElementById('gene-container').offsetWidth * 0.94 //aangepast omdat geen annotatie

    let smallWidth =
      document.getElementById('gene-container').offsetWidth * 0.94 //aangepast omdat geen annotatie
    this.smallWidth = smallWidth

    let vis = this

    let geneOverviewGroup = d3
      .select('#geneOverview')
      .append('g')
      .attr('class', 'gene--summary')

    let tickEnd = vis.lengthGene

    function generateRange(min, max, step) {
      let arr = []
      for (let i = min; i <= max; i += step) {
        if (i == min) {
          arr.push(i)
        } else {
          arr.push(i - 1)
        }
      }

      return arr
    }

    let stepSize
    let stepFactor = vis.lengthGene / 1000
    stepSize = Math.ceil(stepFactor) * 100
    console.log('stepfactor', stepFactor, 'stepsize', stepSize)
    // if (vis.lengthGene > 3000){
    //   stepSize = 300
    // }
    // else{
    //   stepSize = 200
    // }
    let ticksXdomain = vis.generateRange(1, vis.lengthGene, stepSize)

    let ticksX = ticksXdomain.push(tickEnd)
    const firstElement = ticksXdomain.shift()
    const last2 = ticksXdomain.slice(-2)
    if (last2[1] - last2[0] < stepSize) {
      ticksXdomain.splice(ticksXdomain.length - 2, 1)
    }

    //append axes
    geneOverviewGroup
      .append('g')
      .attr('class', 'gene--x-axis')
      .attr('transform', 'translate(0,' + vis.svgHeight + ')')
      .call(d3.axisBottom(vis.xScale).tickValues(ticksXdomain))

    geneOverviewGroup
      .append('g')
      .attr('class', 'gene--y-axis')
      .call(d3.axisLeft(vis.yScale).ticks(2).tickSizeOuter(0))

    // geneOverviewGroup
    // .append("rect")
    // .attr("class", "gene--annotation")
    // .attr("width", vis.svgWidth)
    // .attr("height", vis.svgHeight);

    vis.geneOverviewGroup = geneOverviewGroup

    // vis.drawGeneIntrons() // there are no introns in this dataset!!

    vis.drawGeneExons()

    // initalize brush
    const brush = d3.brushX().extent([
      [0, 0],
      [vis.svgWidth, vis.svgHeight + 10],
    ])
    vis.brush = brush

    // append brush
    geneOverviewGroup
      .append('g')
      .attr('class', 'brush')
      .attr('transform', 'translate(0,' + -5 + ')')

    const svgContextLabels = geneOverviewGroup
      .append('g')
      .attr('class', 'brushLabels')
      .style('font-size', 10)
      .style('font-family', 'sans-serif')
      .style('fill', 'cornflowerblue')
      .style('font-weight', 600)
    // .attr("transform", `translate(${0}, ${vis.margin.top - 10})`);

    vis.svgContextLabels = svgContextLabels

    const labelL = svgContextLabels.append('g').attr('class', 'brushLabelL')
    vis.labelL = labelL

    const labelR = svgContextLabels.append('g').attr('class', 'brushLabelR')
    vis.labelR = labelR

    vis.drawGeneBrush()
  },
  updated() {
    console.log(this.name + ' updated')

    let vis = this

    console.log('>>>> side collapsed??', vis.bool_collapsed)

    let newWidth = vis.smallWidth

    if (!vis.bool_collapsed) {
      newWidth = vis.smallWidth

      console.log('make area smaller!', newWidth)
    } else {
      newWidth = newWidth + 175

      console.log('make area bigger!', newWidth)
    }

    //remove all old elements
    vis.geneOverviewGroup.selectAll('*').remove()

    vis.svgWidth = newWidth
    // this.svgWidth = document.getElementById('gene-container').offsetWidth * 0.84

    let geneOverviewGroup = d3
      .select('#geneOverview')
      .append('g')
      .attr('class', 'gene--summary')

    let tickEnd = vis.lengthGene

    let stepSize
    let stepFactor = vis.lengthGene / 1000
    stepSize = Math.ceil(stepFactor) * 100
    console.log('stepfactor', stepFactor, 'stepsize', stepSize)
    // if (stepFactor < 0){
    //   stepSize = 100
    // }
    // else{

    // }
    // if (vis.lengthGene > 3000){
    //   stepSize = 300
    // }
    // else{
    //   stepSize = 200
    // }
    let ticksXdomain = vis.generateRange(1, vis.lengthGene, stepSize)

    let ticksX = ticksXdomain.push(tickEnd)
    const firstElement = ticksXdomain.shift()
    const last2 = ticksXdomain.slice(-2)
    if (last2[1] - last2[0] < stepSize) {
      ticksXdomain.splice(ticksXdomain.length - 2, 1)
    }

    //append axes
    geneOverviewGroup
      .append('g')
      .attr('class', 'gene--x-axis')
      .attr('transform', 'translate(0,' + vis.svgHeight + ')')
      .call(d3.axisBottom(vis.xScale).tickValues(ticksXdomain))

    geneOverviewGroup
      .append('g')
      .attr('class', 'gene--y-axis')
      .call(d3.axisLeft(vis.yScale).ticks(2).tickSizeOuter(0))

    // geneOverviewGroup
    // .append("rect")
    // .attr("class", "gene--annotation")
    // .attr("width", vis.svgWidth)
    // .attr("height", vis.svgHeight);

    vis.geneOverviewGroup = geneOverviewGroup

    // vis.drawGeneIntrons() // there are no introns in this dataset!!

    vis.drawGeneExons()

    // initalize brush
    const brush = d3.brushX().extent([
      [0, 0],
      [vis.svgWidth, vis.svgHeight + 10],
    ])
    vis.brush = brush

    // append brush
    geneOverviewGroup
      .append('g')
      .attr('class', 'brush')
      .attr('transform', 'translate(0,' + -5 + ')')

    const svgContextLabels = geneOverviewGroup
      .append('g')
      .attr('class', 'brushLabels')
      .style('font-size', 10)
      .style('font-family', 'sans-serif')
      .style('fill', 'cornflowerblue')
      .style('font-weight', 600)
    // .attr("transform", `translate(${0}, ${vis.margin.top - 10})`);

    vis.svgContextLabels = svgContextLabels

    const labelL = svgContextLabels.append('g').attr('class', 'brushLabelL')
    vis.labelL = labelL

    const labelR = svgContextLabels.append('g').attr('class', 'brushLabelR')
    vis.labelR = labelR

    vis.drawGeneBrush()
  },
}
</script>

<style>
#gene-container {
  margin-bottom: 4px;
}

.brush .selection {
  stroke: white;
  fill: #1890ff;
  /* fill: #ff6251; */
  fill-opacity: 0.3;
}

.gene--annotation {
  fill: #e7298a;
  fill-opacity: 0.06;
}

.tick {
  font-size: 8px !important;
}
</style>
