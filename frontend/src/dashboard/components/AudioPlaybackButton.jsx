import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilledRoundedIcon from '@material-ui/icons/PlayCircleFilledRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 10,
  },
})
)

export default function PlaybackButton(props) {

  const classes = useStyles();

  const [playing, setPlaying] = useState(false)
  const [audio,] = useState(new Audio(props.file))

  useEffect(() => {
    audio.addEventListener('ended', ended)
    return () => audio.removeEventListener('ended', ended)
  }, [audio])

  function ended() {
    setPlaying(false)
  }

  function play(event) {
    audio.play()
    setPlaying(true)
  }

  function stop(event) {
    audio.pause()
    audio.currentTime = 0
    setPlaying(false)
  }

  return (
    <div>
      <IconButton component="label" color="primary" className={classes.iconButton} aria-label="playback"
        onClick={playing ? stop : play}>
        {playing ? <StopRoundedIcon /> : <PlayCircleFilledRoundedIcon />}
      </IconButton>
    </div>
  )
}