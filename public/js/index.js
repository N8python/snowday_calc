$(".loadingScreen").hide();
let lat;
let long;


document.querySelector('[type="submit"]').addEventListener('click', e => {
  if (!navigator.geolocation.getCurrentPosition) {
    swal("Oh no!", 'Sorry, but your broser does not support geolocation. Please consider enabling it or upgrading to a newer browser.', "error");
    return;
  }
  if(!validateSliders()){
    swal("Invalid form input!", "Please enter a valid number of snow days (Any number).", "error");
    return;
  }
  displayLoadingScreen();
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude;
    long = pos.coords.longitude;
    let outdata = {
      lat,
      long,
      schoolLeniency: parseInt(slider.value),
      snowDays: parseInt(document.querySelector('[name="numSnowDays"]').value)
    }
    $.ajax({
      url: `https://api.darksky.net/forecast/4a883d597937e0ce5f2593e7b6a186b4/${lat}, ${long}`,
      dataType: 'jsonp',
      crossDomain: true,
      success: function(data, status) {
        console.log(data);
        $(".loadingScreen").html(`
          <h1>Your Results:</h1>
          <p style="text-align: center;">There is a${calcPercent(data, outdata.schoolLeniency, outdata.snowDays)} chance of a snow day tommorow.</p>
        `);
      },
      error: function(xhr, status, error) {
        $(".loadingScreen").html(`
          <p style="text-align: center;">We're sorry. An error occured.
          <br> Reload the page to try again.</p>
          `)
      }
    });
  });
});

function displayLoadingScreen() {
  $(".centerContainer").fadeOut(1000, function() {
    $(".centerContainer").hide();
    $(".loadingScreen").fadeIn(1000);
  });
}
function calcPercent(data, len, days) {
  let percent = 0;
  let percent2 = 0;
  let words = {
    "lightsnow": 3,
    "snow": 4,
    "dangerouslywindy": 5,
    "heavysnow": 7,
    "hail": 9,
    "ice": 9,
    "partlycloudy": -0.1,
    "overcast": -0.1,
    "mostlycloudy": -0.3,
    "cloudy": -0.2,
    "sunny": -5,
    "clear": -1
  }
  let predictionStr = "";
  for (let pred of data.hourly.data) {
    predictionStr += pred.summary.toLowerCase().replace(/\s*/g, "");
  }
  console.log(predictionStr);
  let reg;
  for (word in words) {
    reg = new RegExp(word, "g")
    let occurences = (predictionStr.match(reg) || []).length;
    console.log(word, ":", (occurences * words[word]).toFixed(3))
    percent += Number((occurences * words[word]).toFixed(3));
  }

  for (hour of data.hourly.data) {
    if (hour.precipType === "snow") {
      percent2 += (0.4 * hour.precipProbability * (10 - hour.visibility))
    }
  }
  console.log(percent2);
  percent = (percent + percent2) / 2;
  percent*=(0.99**days);
  percent*=(1-((len-1)/40))
  if (percent < 0) {
    return "n almost impossible"
  }
  if (percent > 99) {
    percent = 99;
  }
  percent = Number(percent.toFixed(1));
  return " " + percent + "%";
}

function validateSliders(){
  return /\d+/.test(document.querySelector('[name="numSnowDays"]').value)
}
