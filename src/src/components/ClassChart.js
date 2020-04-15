import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { scaleBand, scaleLinear, scaleOrdinal, scaleCategory20} from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { histogram } from 'd3-array';
import { hierarchy } from 'd3-hierarchy';
import { pie, arc } from 'd3-shape';
import { entries } from 'd3-collection';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginBottom: '8px',
    marginRight: '8px',
    marginTop: '8px',
    textAlign: 'center',
    color: '#4fbbd6',
    fontSize: '40px',
    backgroundColor: '#242730',
    minHeight: '31vh',
    padding: '0 0 0 0'
  },
  svg: {
    minHeight: '30vh',
    minWidth: '100%',
  },
  text: {
    textAnchor: "end",
    color: '#4fbbd6',
    fontSize: '25px'
  },
}));


export default function ClassChart(props) {
  const classes = useStyles();
  const data = props.data;

  function vw(view_width) {
    return view_width * (window.innerWidth / 100)
  }

  function vh(view_height) {
    return view_height * (window.innerHeight / 100)
  }

  const svgWidth = vw(23),
        svgHeight = vh(24);

  const margin = { top: vh(1), right: 0, bottom: 0, left: vw(5) },
         width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

  var radius = Math.min(width, height) / 2

  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }


  var all_classes = Array.from(data.map(function(d)
      {return d.class
                .replace(/[0-9]/g, '')
                .replace(/(.*)\s/g,'')
                .replace(/(^[.*+\-?^${}()|[\]\\/])/g,'')
                .replace(/([.*+\-?^${}()|[\]\\/]$)/g,'');
      }).values())

  var unique_classes = all_classes.filter(onlyUnique)

  var counts = {};

  for (var i = 0; i < all_classes.length; i++) {
    var cls = all_classes[i];
    counts[cls] = counts[cls] ? counts[cls] + 1 : 1;
  }

  var data1 = {a: 9, b: 20, c:30, d:8, e:12}

  var color = scaleOrdinal()
  .domain(counts)
  .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])

  // var root_tree = hierarchy(counts).sum(function(d){ return d.value})
  // const x = scaleBand()
  //           .range([0, width])
  //           .domain(Object.keys(counts));
  var make_pie = pie()
    .value(function(d) {return d.value; });
  var data_ready = make_pie(entries(counts));
  console.log(data_ready);
  
  // var y_max = max(Object.values(counts))

  // const y = scaleLinear()
  //           .domain([0, y_max])
  //           .range([height, 0]);

  var x = arc().innerRadius(0).outerRadius(radius).startAngle(0).endAngle(Math.PI * 2);

  // console.log(Object.keys(counts));
  return (
    <Paper className={classes.paper}>
      <svg className={classes.svg} id="ClassChart">
        <g transform={`translate(${width / 2+radius/2}, ${height/2})`}>
           {
            data_ready.map(d => {
              x = arc().innerRadius(0).outerRadius(radius).startAngle(d.startAngle).endAngle(d.endAngle);
              
              if((d.startAngle-d.endAngle) >= Math.PI/8){
                console.log("Test")
                return (
                  <g className="arc">
                    <path d={x()} fill={color(d.data.key)} />
                      <text transform={`translate(${x.centroid(d)})`} dy="0em" style={{fontSize:"12px"}}>
                        {d.data.key}
                      </text>
                    />
                  </g>
                )
              }

              return (
                  <g className="arc">
                    <path d={x()} fill={color(d.data.key)} />
                  </g>
                )
            })
          }
        </g>
      </svg>
    </Paper>
  )
};
