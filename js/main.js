/*jslint browser:true */
'use strict';

function addMonths(el) {
  let annualUseKW = 0,
    dailyUseKW = 0,
    i = 0,
    x = 0;

  let months = document.getElementById(el).getElementsByTagName('input');

  for (let i = 0; i < months.length; i++) {
    x = Number(months[i].value);

    annualUseKW += x;
  }

  dailyUseKW = annualUseKW / 365;
  return dailyUseKW.toFixed(2);
}

function sunHours() {
  let hrs,
    theZone = document.forms.solarForm.zone.selectedIndex;

  theZone += 1;

  switch (theZone) {
    case 1:
      hrs = 6;
      break;
    case 2:
      hrs = 5.5;
      break;
    case 3:
      hrs = 5;
      break;
    case 4:
      hrs = 4.5;
      break;
    case 5:
      hrs = 2.5;
      break;
    case 6:
      hrs = 3.5;
      break;
    default:
      hrs = 0;
  }

  return hrs;
}

function calculatePanel() {
  let userChoice = document.forms.solarForm.panel.selectedIndex;
  let panelOptions = document.forms.solarForm.panel.options;
  let power = panelOptions[userChoice].value;
  let name = panelOptions[userChoice].text;

  let x = [power, name];

  return x;
}

function validate() {
  let isValid = true;
  let months = document.getElementById('mpc').getElementsByTagName('input');
  for (let i = 0; i < months.length; i++) {
    if (months[i].value === '' || isNaN(months[i].value) || months[i].value < 0) {
      isValid = false;
      break;
    }
  }
  let zone = document.forms.solarForm.zone.value;
  let panel = document.forms.solarForm.panel.value;
  if (zone === "" || panel === "") {
    isValid = false;
  }
  return isValid;
}

function calculateSolar() {
  let errorMessage = document.getElementById('error');
  if (!validate()) {
    errorMessage.style.display = 'block';
    return;
  } else {
    errorMessage.style.display = 'none';
  }

  let dailyUseKW = addMonths('mpc');
  let sunHoursPerDay = sunHours();

  let minKwNeed = dailyUseKW / sunHoursPerDay;

  let realKwNeed = minKwNeed * 1.25;

  let realWattNeeds = realKwNeed * 1000;

  let panelInfo = calculatePanel();
  let panelOutput = panelInfo[0];
  let panelName = panelInfo[1];

  let panelNeed = Math.ceil(realWattNeeds / panelOutput);

  let feedback = '';

  feedback +=
    '<p>Based on your average daily use of ' +
    Math.round(dailyUseKW) +
    ' kWh, you will need to purchase ' +
    panelNeed +
    ' ' +
    panelName +
    ' solar panel to offset 100% of your electric bill</p>';
  feedback += '<h2>Additional Details</h2>';
  feedback +=
    '<p>Your average daily electricity consumption is ' +
    Math.round(dailyUseKW) +
    ' Kwh per day</p>';
  feedback +=
    '<p>Average sunshine hours per day: ' + sunHoursPerDay + ' hours</p>';
  feedback +=
    '<p>Realistic watts needed per hour: ' +
    Math.round(realWattNeeds) +
    ' watts/hour. </p>';
  feedback +=
    '<p>The ' +
    panelName +
    ' panel you selected generates ' +
    panelOutput +
    ' watts per hour</p>';

  document.getElementById('feedback').innerHTML = feedback;
}

document.getElementById('mpc').addEventListener('input', function() {
  let dailyUseKW = addMonths('mpc');
  document.getElementById('dailyUseKW').innerText = dailyUseKW;
});
