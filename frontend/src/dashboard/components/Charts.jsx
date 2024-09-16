import React, { useRef } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function SplineChart(props) {

  let chart = useRef();
  let responseData = []

  props.responseScoreArray.map((s, i) => {
    return (
      responseData.push({ label: i + 1, y: s })
    )
  })

  const options = {
    animationEnabled: true,
    backgroundColor: "transparent",
    axisX: {
      valueFormatString: "MMM"
    },
    axisY: {
      title: "Similarity Threshold",
      includeZero: false
    },
    data: [{
      yValueFormatString: "##.00",
      type: "scatter",
      name: props.chatbot,
      dataPoints: responseData
    }
    ]
  }

  return (
    <div className="App">
      <CanvasJSChart
        key={responseData.toString()}
        options={options}
        onRef={ref => (chart.current = ref)}
      />
    </div>
  );

}                        