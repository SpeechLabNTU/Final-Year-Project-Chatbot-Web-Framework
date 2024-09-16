import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AISG from "../../img/aisg.png";
import MSF from "../../img/msf.png";
import NTU from "../../img/ntu.png";
import NUS from "../../img/nus.png";


const useStyles = makeStyles(theme => ({
  logosGrid: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}))

export default function LogoHeaders(props) {

  const classes = useStyles()

  return (
    <React.Fragment>

      <Grid container className={classes.logosGrid} spacing={3}>

        <Grid item xs={6} md={3} container justify="center">
          <img src={AISG} style={{ width: '80px', height: '70px' }} alt="AISG Logo" />
        </Grid>
        <Grid item xs={6} md={3} container justify="center">
          <img src={NTU} style={{ width: '160px', height: '70px' }} alt="NTU Logo" />
        </Grid>
        <Grid item xs={6} md={3} container justify="center">
          <img src={NUS} style={{ width: '160px', height: '70px' }} alt="NUS Logo" />
        </Grid>
        <Grid item xs={6} md={3} container justify="center">
          <img src={MSF} style={{ width: '140px', height: '70px' }} alt="MSF Logo" />
        </Grid>

      </Grid>

    </React.Fragment>
  )
}