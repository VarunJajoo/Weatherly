const SELECTORS = {
    section: '[data-section]',
    scrollTo: '[data-scroll-to]',
    scrollDir: '[data-scroll-dir]'
}
const sectionsArray = Array.from(document.querySelectorAll(SELECTORS.section))
const scrollToElements = document.querySelectorAll(SELECTORS.scrollTo)
const scrollDirElements = document.querySelectorAll(SELECTORS.scrollDir)

let currentSectionIndex = 0

const getScrollTarget = dir => {
    if (dir === 'prev' && currentSectionIndex > 0) {
        currentSectionIndex--
        return sectionsArray[currentSectionIndex]
    }
    if (dir === 'next' && currentSectionIndex < sectionsArray.length - 1) {
        currentSectionIndex++
        return sectionsArray[currentSectionIndex]
    }
    return false
}

scrollDirElements.forEach(el => {
    el.addEventListener('click', () => {
        const direction = el.dataset.scrollDir
        const target = getScrollTarget(direction)

        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    })
})

scrollToElements.forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault()
        const targetId = el.getAttribute('href')
        const target = document.querySelector(targetId)

        if (target) {
            sectionsArray.forEach((section, index) => {
                if (section.id === targetId.replace('#', '')) {
                    currentSectionIndex = index
                }
            })
            target.scrollIntoView({ behavior: 'smooth' });
        }
    })
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var d = new Date();
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
document.getElementById("time").innerHTML = days[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()] + " | " + d.getHours() + ":" + d.getMinutes();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var cityArray = ["London", "Cappadocia", "Alaska"];
loadAll(cityArray);

function loadAll(cityArray) {
    for (var count = 0; count < 3; count++) {
        getCityImage(cityArray[count], count + 1);
        articleContent(cityArray[count], count + 1);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getCityImage(query, position) {
    var client_Id = "<<--YOUR UNSPLASH API-->>";
    var url = "https://api.unsplash.com/search/photos/?client_id=" + client_Id + "&query=" + query;
    var alternate_query = "scenery";
    var result;

    fetch(url)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            console.log(data);

            if (data.results[0] == null) {
                //console.log("success");
                url = "https://api.unsplash.com/search/photos/?client_id=" + client_Id + "&query=" + alternate_query;
                fetch(url)
                    .then(function (data) {
                        return data.json();
                    })
                    .then(function (data) {
                        result = data.results[0].urls.regular;
                        document.getElementById("header-" + position).style.backgroundImage = "url('" + result + "')";
                        document.getElementById("nav-" + position).src = result;
                    });
            }
            else {
                //console.log("fail");
                result = data.results[0].urls.regular;
                document.getElementById("header-" + position).style.backgroundImage = "url('" + result + "')";
                document.getElementById("nav-" + position).src = result;
            }
        });
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var url2;
var query1;
var client_Id1;
var url1;

function articleContent(query, position) {

    document.getElementById("title" + position).innerHTML = query;

    query1 = query;
    client_Id1 = "<<--YOUR OPEN WEATHER API-->>";
    url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + query1 + "&appid=" + client_Id1;


    fetch(url1)
        .then(function (data1) {
            return data1.json();
        })
        .then(function (data1) {
            console.log(data1);

            if (data1.cod == "404" || data1.name.toUpperCase().search(query.toUpperCase()) < 0) {
                //console.log("City not found");
                document.getElementById("title" + position).innerHTML = query + "'s weather not found";
                document.getElementById("coordinate" + position).style.visibility = "hidden";
                document.getElementById("controls" + position).style.visibility = "hidden";
                document.getElementById("section__content" + position).style.visibility = "hidden";
                document.getElementById("page_date" + position).style.visibility = "hidden";
                document.getElementById("nav-city" + position).innerHTML = `<strong>` + "Weather not found" + `</strong>`;
            }
            else {
                //console.log("found");

                document.getElementById("coordinate" + position).style.visibility = "visible";
                document.getElementById("controls" + position).style.visibility = "visible";
                document.getElementById("section__content" + position).style.visibility = "visible";
                document.getElementById("page_date" + position).style.visibility = "visible";

                var lon = data1.coord.lon;
                var lat = data1.coord.lat;
                var lon_dir = "&deg;E";
                var lat_dir = "&deg;N";
                if (lon < 0) {
                    lon_dir = "&deg;W";
                    lon *= -1;
                }
                if (lat < 0) {
                    lat_dir = "&deg;S";
                    lat *= -1;
                }

                document.getElementById("nav-city" + position).innerHTML = `<strong>` + query + `</strong><br>` + data1.sys.country;

                let unixTimestamp = data1.dt;
                let dateObj = new Date(unixTimestamp * 1000);
                let utcString = dateObj.toUTCString();
                let day = utcString.slice(-29, -26);
                let date = utcString.slice(-24, -22);
                let month = utcString.slice(-21, -18);

                document.getElementById("page_date" + position).innerHTML = day + ", " + date + " " + month;
                document.getElementById("pressure" + position).innerHTML = data1.main.pressure + "hPa";
                document.getElementById("temp" + position).innerHTML = `<span class="text--large">` + Math.round(data1.main.temp - 273) + "&deg;C" + `</span><br/>` + data1.weather[0].main;
                document.getElementById("coordinate" + position).innerHTML = lat + lat_dir + ", " + lon + lon_dir;
                document.getElementById("description" + position).innerHTML = data1.weather[0].description;
                document.getElementById("wind" + position).innerHTML = Math.round(data1.wind.speed * 3.6) + "Km/h";
                document.getElementById("humid" + position).innerHTML = data1.main.humidity + "%";
                document.getElementById("max-min-" + position).innerHTML = Math.round(data1.main.temp_max - 273) + "&deg; / " + Math.round(data1.main.temp_min - 273) + "&deg;C";

                if (data1.weather[0].main == "Haze" || data1.weather[0].main == "Clouds" || data1.weather[0].main == "Smoke") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon cloudy">
                                                            <div class="cloud"></div>
                                                            <div class="cloud"></div>
                                                        </div>`;
                }
                if (data1.weather[0].main == "Rain") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon rainy">
                                                            <div class="cloud"></div>
                                                            <div class="rain"></div>
                                                        </div>`;
                }
                //////////////////////////////////////////////////////////////////////////////
                if (data1.weather[0].main == "Sunny" || data1.weather[0].main == "Clear") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon sunny">
                                                            <div class="sun">
                                                            <div class="rays"></div>
                                                            </div>
                                                        </div>`;
                }
                if (data1.weather[0].main == "Snow") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon flurries">
                                                            <div class="cloud"></div>
                                                            <div class="snow">
                                                            <div class="flake"></div>
                                                            <div class="flake"></div>
                                                            </div>
                                                        </div>`;
                }
                if (data1.weather[0].main == "Thunder" || data1.weather[0].main == "Extreme") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon thunder-storm">
                                                            <div class="cloud"></div>
                                                            <div class="lightning">
                                                            <div class="bolt"></div>
                                                            <div class="bolt"></div>
                                                            </div>
                                                        </div>`;
                }
                if (data1.weather[0].main == "Shower" || data1.weather[0].main == "Mist") {
                    document.getElementById("user" + position).innerHTML = `<div class="icon sun-shower">
                                                            <div class="cloud"></div>
                                                            <div class="sun">
                                                            <div class="rays"></div>
                                                            </div>
                                                            <div class="rain"></div>
                                                        </div>`;
                }




                url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,alerts&appid=" + client_Id1;
                fetch(url2)
                    .then(function (data2) {
                        return data2.json();
                    })
                    .then(function (data2) {
                        //console.log(data2);
                        let uvi = data2.current.uvi;
                        let uvi_description = "";

                        if (uvi >= 0 && uvi <= 2) {
                            uvi_description = "Low";
                        }
                        if (uvi > 2 && uvi <= 5) {
                            uvi_description = "Moderate";
                        }
                        if (uvi > 5 && uvi <= 7) {
                            uvi_description = "High";
                        }
                        if (uvi > 7 && uvi <= 10) {
                            uvi_description = "Very high";
                        }
                        if (uvi > 10) {
                            uvi_description = "Extreme";
                        }
                        document.getElementById("uvi" + position).innerHTML = `<span class="text--large">` + uvi + `</span><br>UV index (` + uvi_description + `)`;
                    });
            }
        });

}


//////////////////////////////////////////////////////////////////////////////


var pageCounter1 = 0;
var pageCounter2 = 0;
var pageCounter3 = 0;

document.getElementById('btn--next1').onclick = function () {
    document.getElementById('section__content1').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content1').style.animation = "slide-left 3s ease";
    }, 20);

    if (pageCounter1 >= 0 && pageCounter1 < 6) {
        pageCounter1++;
    }
    else {
        pageCounter1 = 0;
    }
    update_page_on_scroll(1, pageCounter1);
};

document.getElementById('btn--prev1').onclick = function () {
    document.getElementById('section__content1').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content1').style.animation = "slide-right 3s ease";
    }, 20);

    if (pageCounter1 > 0 && pageCounter1 <= 6) {
        pageCounter1--;
    }
    else {
        pageCounter1 = 6;
    }
    update_page_on_scroll(1, pageCounter1);
};

document.getElementById('btn--next2').onclick = function () {
    document.getElementById('section__content2').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content2').style.animation = "slide-left 3s ease";
    }, 20);

    if (pageCounter2 >= 0 && pageCounter2 < 6) {
        pageCounter2++;
    }
    else {
        pageCounter2 = 0;
    }
    update_page_on_scroll(2, pageCounter2);
};

document.getElementById('btn--prev2').onclick = function () {
    document.getElementById('section__content2').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content2').style.animation = "slide-right 3s ease";
    }, 20);

    if (pageCounter2 > 0 && pageCounter2 <= 6) {
        pageCounter2--;
    }
    else {
        pageCounter2 = 6;
    }
    update_page_on_scroll(2, pageCounter2);
};

document.getElementById('btn--next3').onclick = function () {
    document.getElementById('section__content3').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content3').style.animation = "slide-left 3s ease";
    }, 20);

    if (pageCounter3 >= 0 && pageCounter3 < 6) {
        pageCounter3++;
    }
    else {
        pageCounter3 = 0;
    }
    update_page_on_scroll(3, pageCounter3);
};

document.getElementById('btn--prev3').onclick = function () {
    document.getElementById('section__content3').style.animation = "none";
    setTimeout(function () {
        document.getElementById('section__content3').style.animation = "slide-right 3s ease";
    }, 20);

    if (pageCounter3 > 0 && pageCounter3 <= 6) {
        pageCounter3--;
    }
    else {
        pageCounter3 = 6;
    }
    update_page_on_scroll(3, pageCounter3);
};

function update_page_on_scroll(position, pageCounter) {

    client_Id1 = "<<--YOUR OPEN WEATHER API-->>";
    url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityArray[position - 1] + "&appid=" + client_Id1;

    fetch(url1)
        .then(function (data1) {
            return data1.json();
        })
        .then(function (data1) {
            let url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data1.coord.lat + "&lon=" + data1.coord.lon + "&exclude=minutely,alerts&appid=" + client_Id1;
            fetch(url2)
                .then(function (data2) {
                    return data2.json();
                })
                .then(function (data2) {
                    let uvi = data2.daily[pageCounter].uvi;
                    let uvi_description = "";

                    if (uvi >= 0 && uvi <= 2) {
                        uvi_description = "Low";
                    }
                    if (uvi > 2 && uvi <= 5) {
                        uvi_description = "Moderate";
                    }
                    if (uvi > 5 && uvi <= 7) {
                        uvi_description = "High";
                    }
                    if (uvi > 7 && uvi <= 10) {
                        uvi_description = "Very high";
                    }
                    if (uvi > 10) {
                        uvi_description = "Extreme";
                    }

                    var unixTimestamp = data2.daily[pageCounter].dt;
                    var dateObj = new Date(unixTimestamp * 1000);
                    var utcString = dateObj.toUTCString();
                    var day = utcString.slice(-29, -26);
                    var date = utcString.slice(-24, -22);
                    var month = utcString.slice(-21, -18);

                    document.getElementById("page_date" + position).innerHTML = day + ", " + date + " " + month;
                    document.getElementById("pressure" + position).innerHTML = data2.daily[pageCounter].pressure + "hPa";
                    document.getElementById("uvi" + position).innerHTML = `<span class="text--large">` + uvi + `</span><br>UV index (` + uvi_description + `)`;
                    document.getElementById("temp" + position).innerHTML = `<span class="text--large">` + Math.round(data2.daily[pageCounter].temp.day - 273) + "&deg;C" + `</span><br/>` + data2.daily[pageCounter].weather[0].main;
                    document.getElementById("description" + position).innerHTML = data2.daily[pageCounter].weather[0].description;
                    document.getElementById("wind" + position).innerHTML = Math.round(data2.daily[pageCounter].wind_speed * 3.6) + "Km/h";
                    document.getElementById("humid" + position).innerHTML = data2.daily[pageCounter].humidity + "%";
                    document.getElementById("max-min-" + position).innerHTML = Math.round(data2.daily[pageCounter].temp.max - 273) + "&deg; / " + Math.round(data2.daily[pageCounter].temp.min - 273) + "&deg;C";

                    if (data2.daily[pageCounter].weather[0].main == "Haze" || data2.daily[pageCounter].weather[0].main == "Clouds" || data2.daily[pageCounter].weather[0].main == "Smoke") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon cloudy">
                                                                                <div class="cloud"></div>
                                                                                <div class="cloud"></div>
                                                                            </div>`;
                    }
                    if (data2.daily[pageCounter].weather[0].main == "Rain") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon rainy">
                                                                                <div class="cloud"></div>
                                                                                <div class="rain"></div>
                                                                            </div>`;
                    }
                    //////////////////////////////////////////////////////////////////////////////
                    if (data2.daily[pageCounter].weather[0].main == "Sunny" || data2.daily[pageCounter].weather[0].main == "Clear") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon sunny">
                                                                                <div class="sun">
                                                                                <div class="rays"></div>
                                                                                </div>
                                                                            </div>`;
                    }
                    if (data2.daily[pageCounter].weather[0].main == "Snow") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon flurries">
                                                                                <div class="cloud"></div>
                                                                                <div class="snow">
                                                                                <div class="flake"></div>
                                                                                <div class="flake"></div>
                                                                                </div>
                                                                            </div>`;
                    }
                    if (data2.daily[pageCounter].weather[0].main == "Thunder" || data2.daily[pageCounter].weather[0].main == "Extreme") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon thunder-storm">
                                                                                <div class="cloud"></div>
                                                                                <div class="lightning">
                                                                                <div class="bolt"></div>
                                                                                <div class="bolt"></div>
                                                                                </div>
                                                                            </div>`;
                    }
                    if (data2.daily[pageCounter].weather[0].main == "Shower" || data2.daily[pageCounter].weather[0].main == "Mist") {
                        document.getElementById("user" + position).innerHTML = `<div class="icon sun-shower">
                                                                                <div class="cloud"></div>
                                                                                <div class="sun">
                                                                                <div class="rays"></div>
                                                                                </div>
                                                                                <div class="rain"></div>
                                                                            </div>`;
                    }

                });
        });
}


function search(element) {
    if (event.key === 'Enter') {
        var input = element.value.charAt(0).toUpperCase() + element.value.slice(1);
        if (cityArray[0].toUpperCase() != input.toUpperCase()) {
            cityArray = [input, cityArray[0], cityArray[1]];
        }
        loadAll(cityArray);
        document.activeElement.blur();
    }
}
