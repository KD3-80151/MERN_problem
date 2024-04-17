import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ClickDataChart = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ numOnes: 0, numZeros: 0, contZeroStreak: 0, contOneStreak: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data'); // Replace with your API endpoint
      const jsonData = await response.json();
      setData(jsonData);
      calculateSummary(jsonData);
    };

    fetchData();
  }, []);

  const calculateSummary = (data) => {
    let numOnes = 0;
    let numZeros = 0;
    let currentStreak = 0;
    let maxZeroStreak = 0;
    let maxOneStreak = 0;

    data.forEach((d) => {
      if (d.click_value === 0) {
        numZeros++;
        currentStreak++;
        maxZeroStreak = Math.max(maxZeroStreak, currentStreak);
      } else if (d.click_value === 1) {
        numOnes++;
        currentStreak = 0; // Reset streak for 1s
      } else {
        currentStreak = 0; // Reset streak for missing data
      }
      maxOneStreak = Math.max(maxOneStreak, currentStreak);
    });

    setSummary({ numOnes, numZeros, contZeroStreak: maxZeroStreak, contOneStreak: maxOneStreak });
  };

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Click Data',
      data: data.map(d => d.click_value === 0 ? 'yellow' : d.click_value === 1 ? 'green' : 'red'),
      backgroundColor: [...], // set colors accordingly
      borderColor: 'black',
      borderWidth: 1,
    }]
  };

  return (
    <div className="container">
      <h1>Click Data Visualization</h1>
      <canvas id="clickDataChart" width="800" height="400"></canvas>
      <DataSummaryTable {...summary} />
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

const DataSummaryTable = ({ numOnes, numZeros, contZeroStreak, contOneStreak }) => {
  return (
    <div className="summary-table">
      <h2>Summary</h2>
      <table>
        <tbody>
          <tr>
            <td>Number of 1s:</td>
            <td>{numOnes}</td>
          </tr>
          <tr>
            <td>Number of 0s:</td>
            <td>{numZeros}</td>
          </tr>
          <tr>
            <td>Longest Consecutive 0s:</td>
            <td>{contZeroStreak}</td>
          </tr>
          <tr>
            <td>Longest Consecutive 1s:</td>
            <td>{contOneStreak}</td>
          </tr>
        </tbody>
      </table>
      <style jsx>{`
        .summary-table {
          margin-top: 20px;
          border: 1px solid #ddd;
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

useEffect(() => {
  const ctx = document.getElementById('clickDataChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time',
          }
        },
        y: {
          title: {
            display: true,
            text: 'Click Value',
          }
        }
      }
    }
  });
}, [data]);

export default ClickDataChart;
