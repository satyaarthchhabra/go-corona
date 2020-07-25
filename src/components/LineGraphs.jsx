import React from 'react'
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import numeral from 'numeral';
const options = {
    legend: { display: false },
    element: { point: { radius: 0 } },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipitem, data) {
                return numeral(tooltipitem.value).format("+0,0")
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipformat: "ll",
                }
            }
        ],
        yAxes: [
            {
                gridlines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}
const LineGraphs = ({ casesType = 'cases',...props }) => {
    const [data, setData] = React.useState({})
    const fetchData = async () => {

        const response = await axios.get(" https://disease.sh/v3/covid-19/historical/all?lastdays=120");
        console.log(await response.data);
        const chartData = buildChartData(response.data, casesType)
        setData(chartData)
    }
    React.useEffect(() => {

        fetchData();
    }, [casesType])
    const buildChartData = (data, casesType = 'cases') => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data['cases'][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData
    }
    return (
        <div className={props.className}>
            {data?.length > 0 && (

                <Line data={{
                    datasets: [{
                        data: data,
                        backgroundColor: "rgba(204,16,52,0.5)",
                        borderColor: "#cc1034",
                    }],
                }} options={options} />
            )}
        </div>
    )
}

export default LineGraphs
