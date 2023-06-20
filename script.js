const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const idValue = document.getElementById("id-value");
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
];
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: [1, 2, 3, 4, 5, 6],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>You have won: ${i.value} <br>Time now:${time}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
let i=0;
function OnWheelSpun()
        {
            PlayerPrefs.SetString("LastDateSpun", 
                DateTime.Now.Year + "-"
                + DateTime.Now.Month.ToString().PadLeft(2, '0') + "-"
                + DateTime.Now.Day.ToString().PadLeft(2, '0'));
    
            Debug.Log(string.Format("Player spun wheel, saving date: {0}",
                PlayerPrefs.GetString("LastDateSpun")));
        }
    function ShowWheelToPlayer()
    {
        if (DateTime.Now >
                DateTime.ParseExact(PlayerPrefs.GetString("LastDateSpun", "0000-00-00"), "yyyy-MM-dd", 
                System.Globalization.CultureInfo.InvariantCulture)
                .AddDays(1))
            i=0;
        else
            i=1;
    }



//Start spinning
spinBtn.addEventListener("click", () => {
  if(i==0){
        spinBtn.disabled = true;
        //Empty final value
        finalValue.innerHTML = `<p>Good Luck!</p>`;
        //Generate random degrees to stop at
        let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
        //Interval for rotation animation
        let rotationInterval = window.setInterval(() => {
            //Set rotation for piechart
            /*
            Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
            */
            myChart.options.rotation = myChart.options.rotation + resultValue;
            //Update chart with new value;
            myChart.update();
            //If rotation>360 reset it back to 0
            if (myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
            } else if (count > 15 && myChart.options.rotation == randomDegree) {
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
            }
        }, 10);
        i++;
    }
    else{
        finalValue.innerHTML = `<p>Enough for today!  ${deviceID}</p>`;
        onclick=window.close();
    }
    
});