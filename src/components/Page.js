import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Deck from './Map';
import DataTable from './DataTable';
import MassChart from './MassChart';
import ClassChart from './ClassChart';
import TogglePanel from './TogglePanel';
import InfoBox from './InfoBox';
import small_data from '../meteorites_small';
import medium_data from '../meteorites_medium';
import large_data from '../meteorites_large';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(1),
    marginBottom: '8px',
    marginRight: '8px',
    textAlign: 'center',
    color: '#4fbbd6',
    fontSize: '40px',
    backgroundColor: '#242730'
  },
  deck: {
    marginBottom: '8px',
  }
}));

export default function Page() {
  const classes = useStyles();
  const [selectedData, setSelectedData] = useState(null);
  const [timeline, setTimeline] = useState([1980, 2020])
  const [totalData, setTotalData] = useState(small_data)
  const [dispData, setDispData] = useState(small_data)
  const MapState = React.createRef();

  function setData(quantity) {
    if(quantity === 'small') {
      setTotalData(small_data);
      setDispData(small_data)
    } else if (quantity === 'medium') {
      const data = small_data.concat(medium_data)
      setTotalData(data);
      setDispData(data)
    } else if (quantity === 'large') {
      const data = small_data.concat(medium_data).concat(large_data);
      setTotalData(data);
      setDispData(data)
    }
  }

  function filter_timeline(values) {
    setTimeline(values);
    setDispData(totalData.filter(d => (d.year >= values[0] && d.year <= values[1])));
  }

  function updateMapHover(d) {
    setSelectedData(d);
    MapState.current.setSelectedData(d);
  }

  return (
    <div>
      <Grid container spacing={1}>

        <Grid item xs={9}>
          <Deck data={dispData} selectedData={selectedData} hoverCallback={setSelectedData} ref={MapState}/>

          <Grid container spacing={1}>
            <Grid item xs={3}>
              <TogglePanel setData={setData} timeline={timeline} setTimeline={filter_timeline} />
            </Grid>

            <Grid item xs={9}>
              <DataTable data={dispData} selectedData={selectedData} hoverCallback={updateMapHover} />
            </Grid>
          </Grid>

        </Grid>

        <Grid item xs={3}>
          <MassChart data={dispData} selectedData={selectedData} setSelectedData={updateMapHover} />
          <ClassChart data={dispData} selectedData={selectedData} />
          <Paper className={classes.paper} style={{minHeight: '31vh'}}>GRAPH 3</Paper>
        </Grid>

      </Grid>

      {/*<InfoBox />*/}

    </div>
  );
}