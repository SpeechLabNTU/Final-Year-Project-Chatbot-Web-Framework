import React, { useRef } from 'react';
import Plot from 'react-plotly.js';

export default function SplineChart(props) {

  let chart = useRef();
  let xData = []
  let yData = []

  props.responseScoreArray.map((s, i) => {
    return (
      xData.push(i + 1),
      yData.push(s)
    )
  })
  const trace = {
    x: xData,
    y: yData,
    type: "scatter",
    mode: 'markers',
    marker: { color: 'blue' },
    name: props.chatbot,
    showlegend: false
  }
  const layout = {
    width: 570,
    height: 570,
    title: 'Similarity Threshold',
    xaxis: { title: { text: 'Question Number' } },
    yaxis: { title: { text: 'Similarity Score' } },
    font: { family: 'Courier New, monospace', size: 16, color: "#2b2d2f" }
  }

  return (
    <div className="App">
      <Plot
        data={[trace]}
        layout={layout}
        onRef={ref => (chart.current = ref)}
      />
    </div>
  );

}                        