import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import '../ProgressGoals/ProgressDataVisuals.css';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

///////////// MY PROGRESS DATA VISUAL COMPONENT ///////////////
const ProgressDataVisuals = ({ user, dailyBurn, goals }) => {
  const [goalsUpdate, setGoalsUpdate] = useState([]);
  const [progressUpdate, setProgressUpdate] = useState([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState([]);

  ///// PRE-POPULATED DATA FOR CHARTS
  // initial pie chart calories burned // in state below
  const initialPieDataCalories = [
    { name: 'Total Calories Burned', value: 2600, color: '#0EA5E9' },
    { name: 'Calories to Goal', value: 550, color: '#B2E4FB' },
  ];
  const [pieDataCalories, setPieDataCalories] = useState(
    initialPieDataCalories
  );

  // initial pie chart weight data // in state below
  const initialPieDataWeight = [
    { name: 'Total Weight Lost', value: 15, color: '#F59E0B' },
    { name: 'Pounds to Goal', value: 35, color: '#FCE7C5' },
  ];
  const [pieDataWeight, setPieDataWeight] = useState(initialPieDataWeight);

  // Line Data calorie data // in state as progressUpdate
  const lineDataCalories = [{ calories: 256 }, { calories: 150 }];

  // line chart weight data // in state as progressUpdate
  const lineDataWeight = [
    { weight: -5 },
    { weight: 3 },
    { weight: 1 },
    { weight: -1 },
  ];

  // CALCULATE TOTAL CALORIES BURNED
  const updateTotalCalories = () => {
    return progressUpdate.map((progressObj) => {
      if (progressObj.user === user._id) {
        progressObj.lineDataCalories.reduce((totalCals, curr) => {
          totalCals += curr.calories;
          setTotalCaloriesBurned(totalCals);
          return totalCals;
        }, 0);
      }
    });
  };

  // CALCULATE TOTAL WEIGHT LOST
  const totalWeightLost = lineDataWeight.reduce((totalWeightLoss, curr) => {
    totalWeightLoss += curr.weight;
    return totalWeightLoss;
  }, 0);

  //function finds goals to view
  const findGoals = () => {
    axios
      .get(`/goals`)
      .then((response) => {
        // console.log('response data from findCalories', response.data);
        setGoalsUpdate([...response.data]);
      })
      .catch((err) => {
        console.error('find Calories FAILED', err);
      });
  };

  //function finds progress stats for view
  const findProgress = () => {
    axios
      .get(`/progress`)
      .then((response) => {
        // console.log('response data from findProgess', response.data);
        setProgressUpdate([...response.data]);
      })
      // .then(() => {
      //   updateTotalCalories();
      // })
      .catch((err) => {
        console.error('find Calories FAILED', err);
      });
  };

  //function updates progress stats to DB
  const updateProgress = () => {
    axios
      .post('/progress', {
        user: user._id,
        lineDataCalories: lineDataCalories,
        pieDataCalories: pieDataCalories.initialPieDataCalories,
        lineDataWeight: lineDataWeight,
        pieDataWeight: pieDataWeight.initialPieDataWeight,
      })
      .then((response) => {
        // console.log('SUCCESS: update Progress from Axios Post to DB, in ProgressDataVisuals.jsx:', response);
      })
      .catch((err) => {
        console.error('ERROR. Failed to update Goals from Axios Post', err);
      });
  };

  //////////////////////
  //update the view
  useEffect(() => {
    updateProgress();
    findGoals();
    findProgress();
    updateTotalCalories();
  }, []);
  /////////////////////

  console.log('daily burn', dailyBurn);
  console.log('goals update', goalsUpdate);

  ///////////////////// RENDERING COMPONENT TO DASHBOARD ///////////////////////////
  return (
    <div className='flex-col-container'>
      <h2 className='font-bold text-3xl text-black'>My Progress</h2>
      <div className='flex-row-container'>
        {/** CALORIE PIE CHART */}
        <div className='data-pie-graph-container'>
          <div className='text-container'>
            <h3 className='font-semibold text-xl text-black'>
              Calories Burned Goal
            </h3>
            {/* 1500 Needs to be Dynamic*/}
            <span>
              <h3 className='font-bold text-3xl text-sky-500'>
                {pieDataCalories[1].value}
              </h3>
              <p>cals to goal</p>
            </span>
          </div>
          <div className='pie-graph'>
            <ResponsiveContainer width='99%' height='99%'>
              <PieChart>
                <Tooltip labelStyle={{ display: 'none' }} />
                <Pie
                  data={pieDataCalories}
                  innerRadius={'70%'}
                  outerRadius={'90%'}
                  fill='#8884d8'
                  paddingAngle={5}
                  dataKey='value'
                >
                  {pieDataCalories.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/** CALORIE LINE CHART */}
        <div className='data-line-graph-container'>
          <div className='text-container'>
            <h3 className='font-semibold text-xl text-black'>
              Total Calories Burned
            </h3>
            {/* CHECK total calories Dynamic value*/}
            <span>
              <h3 className='font-bold text-3xl text-sky-500 '>
                {dailyBurn}
                {/* {totalCaloriesBurned} */}
              </h3>
              <p>calories</p>
            </span>
          </div>
          <div className='line-graph'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart width={300} height={100} data={lineDataCalories}>
                <Tooltip labelStyle={{ display: 'none' }} />
                <Line
                  type='monotone'
                  dataKey='calories'
                  stroke='#0ea5e9'
                  strokeWidth={3}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
            <h3 className='font-bold text-md text-sky-500'>PER WORKOUT</h3>
          </div>
        </div>
      </div>
      <div className='flex-row-container'>
        {/** WEIGHT LOSS PIE CHART */}
        <div className='data-pie-graph-container'>
          <div className='text-container'>
            <h3 className='font-semibold text-xl text-black'>
              Weight Loss Goal
            </h3>
            {/* 1500 Needs to be Dynamic*/}
            <span>
              <h3 className='font-bold text-3xl text-amber-500 '>
                {pieDataWeight[1].value}
              </h3>
              <p>lbs to goal</p>
            </span>
          </div>
          <div className='pie-graph'>
            <ResponsiveContainer width='99%' height='99%'>
              <PieChart>
                <Tooltip labelStyle={{ display: 'none' }} />
                <Pie
                  data={pieDataWeight}
                  innerRadius={'70%'}
                  outerRadius={'90%'}
                  fill='#8884d8'
                  paddingAngle={5}
                  dataKey='value'
                >
                  {pieDataWeight.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/** WEIGHT LOSS LINE CHART */}
        <div className='data-line-graph-container'>
          <div className='text-container'>
            <h3 className='font-semibold text-xl text-black'>
              Total Weight Lost
            </h3>
            {/* CHECK WEIGHT DYNAMIC VALUE*/}
            <span>
              <h3 className='font-bold text-3xl text-amber-500 '>
                {totalWeightLost}
              </h3>
              <p>pounds</p>
            </span>
          </div>
          <div className='line-graph'>
            <ResponsiveContainer className='mt-12' width='100%' height='50%'>
              <LineChart width={300} height={100} data={lineDataWeight}>
                <Tooltip labelStyle={{ display: 'none' }} />
                <Line
                  type='monotone'
                  dataKey='weight'
                  stroke='#F59E0B'
                  strokeWidth={3}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
            <h3 className='font-bold text-md text-amber-500 '>PER WEIGH IN</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDataVisuals;
