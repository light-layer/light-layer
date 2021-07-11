const body = document.body;
const arcSvg = document.getElementById("arc-svg");

function pageSize(){
    if (innerWidth > 750 || innerHeight < innerWidth){
        arcSvg.setAttribute("viewBox", "-60 -40 235.46 300");
        arcSvg.removeAttribute("preserveAspectRatio", "none");
    }
    else {
        arcSvg.setAttribute("viewBox", "-15 -55 150 300");
        arcSvg.setAttribute("preserveAspectRatio", "none");
    }
}
window.onresize = pageSize;

const calendarBody = document.getElementById("ll-calendar-body");
const calendarHeader = document.getElementById("ll-calendar-header");

async function generateCalendar(){
    fetch('json/events.json')
    .then(response => response.json())
    .then(obj => {
                    let calendarEvents = obj;

                    if (calendarEvents.events && calendarEvents.events.length > 0){

                        const currentTime = new Date();

                        for (let i = 0; i < calendarEvents.events.length; i++){
                            const event = calendarEvents.events[i];
                            let date = event.date;
                            let displayTime = event.displayTime;
                            const startTime = event.startTime;
                            const endTime = event.endTime;
                            const location = event.location;
                            const linkToListen = event.linkToListen;

                            let classes = "ll-calendar-element ";
                            if (i === 0){
                                classes += "top-row";
                            }


                            if ((currentTime.getMonth()+1 >= Number(date.slice(0, 2)) && currentTime.getDate() > Number(date.slice(3, 5)))
                            || (currentTime.getMonth()+1 === Number(date.slice(0, 2)) && currentTime.getDate() === Number(date.slice(3, 5)) && currentTime.getHours() >= Number(endTime.slice(0, 2)) && currentTime.getMinutes() >= Number(endTime.slice(3, 5)))){
                                date = ` strike-through">${event.date}`;
                                displayTime = ` strike-through">${event.displayTime}`;
                            }
                            else {
                                date = `">${event.date}`
                                displayTime = `">${event.displayTime}`
                            }

                            calendarBody.innerHTML +=
                            `<tr class="${classes}" date="${event.date}" timeStart="${startTime}" timeEnd="${endTime}" location="${location}" linkToListen="${linkToListen}">
                                <td class="ll-date${date}</td>
                                <td class="ll-location${displayTime} ${location}</td>
                            </tr>`;
                        }
                    }
                }
        );
}

async function checkForBroadcasting(){
    let textCreated = false;

    if (calendarBody.children.length > 0){
        const currentTime = new Date();

        for (let i = 0; i < calendarBody.children.length; i++){

            const calendarMonth = Number(calendarBody.children[i].getAttribute("date").slice(0, 2));
            const calendarDay = Number(calendarBody.children[i].getAttribute("date").slice(3, 5));

            const calendarStartTimeHours = Number(calendarBody.children[i].getAttribute("timeStart").slice(0, 2));
            const calendarStartTimeMins = Number(calendarBody.children[i].getAttribute("timeStart").slice(3, 5));

            const calendarEndTimeHours = Number(calendarBody.children[i].getAttribute("timeEnd").slice(0, 2));
            const calendarEndTimeMins = Number(calendarBody.children[i].getAttribute("timeEnd").slice(3, 5));

            if (calendarMonth === currentTime.getMonth()+1 && calendarDay === currentTime.getDate() && !textCreated){
                if (calendarStartTimeHours <= currentTime.getHours() && calendarEndTimeHours >= currentTime.getHours()){
                    if (calendarStartTimeHours === calendarEndTimeHours && currentTime.getMinutes() >= calendarStartTimeMins && currentTime.getMinutes() <= calendarEndTimeMins){
                        const station = calendarBody.children[i].getAttribute("location");
                        calendarHeader.innerHTML = `<div class="blinking-light"></div>Listen on <a href="${calendarBody.children[i].getAttribute("linkToListen")}">${station}</a>`;
                        textCreated = true;
                        break;
                    }
                    else {
                        if (calendarStartTimeHours !== calendarEndTimeHours){
                            const station = calendarBody.children[i].getAttribute("location");
                            calendarHeader.innerHTML = `<div class="blinking-light"></div>Listen on <a href="${calendarBody.children[i].getAttribute("linkToListen")}">${station}</a>`;
                            textCreated = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    if (!textCreated){
        calendarHeader.innerHTML = "Upcoming Broadcasts";
    }

}

const arcText = document.getElementById("arc-text");

async function generateSongs(){
    fetch('csv/songs.csv')
    .then(response => response.text())
    .then(obj => {

        const songsCsv = obj;
        const songsCsvSeparated = songsCsv.split("\n");

        let arcOutput = "";
        let counter = 0;
        songsCsvSeparated.forEach(value => {
            const songSeparated = value.split("\t");

            if (songSeparated.length === 6){
                const artist = songSeparated[0];
                const song = songSeparated[1];

                arcOutput += song + " - " + artist;

                if (counter !== songsCsvSeparated.length - 1){
                    arcOutput += " / ";
                }
            }
            counter++;
        });

        if (arcOutput !== ""){
            arcText.innerHTML = arcOutput;
            arcText.innerHTML +=
            `<animate
              attributeName="startOffset"
              from="-320%"
              to ="100%"
              dur="60s"
              repeatCount="indefinite"
              restart="always"
              keyTimes="0;1"
              calcMode="paced"
              />
            <!-- change color -->
            <!-- <animate
              attributeName="fill"
              dur="90s"
              values="#006400;#000080;gray"
              calcMode="paced"/> -->`
        }
    });
}

const logo = document.getElementById("ll-logo");
const lightLayerHeaders = document.getElementsByClassName("ll-name-element");
const description = document.getElementById("ll-description");
const station = document.getElementById("ll-station");
const calendarContainer = document.getElementById("ll-calendar-container");
const arc = document.getElementById("arc");
const myPath = document.getElementById("myPath");

async function animatePageLoad(){

    /* Transitions the logo down and un-hides it*/
    logo.classList.remove("above-page");
    logo.classList.add("visible");
    logo.classList.remove("hidden");
    arc.setAttribute("style", "background-color: #f2f2f2");
    myPath.setAttribute("stroke", "#f2f2f2");

    /* Waits 250 milliseconds */
    await new Promise(r => setTimeout(r, 1200));

    /* Transitions the two segments of the logo "light" and "layer", 250 milliseconds apart */
    for (let i = 0; i < lightLayerHeaders.length; i++){
        lightLayerHeaders[i].classList.add("visible");
        lightLayerHeaders[i].classList.remove("hidden");
    }

    /* Waits 250 milliseconds */
    await new Promise(r => setTimeout(r, 100));

    /* Transitions description down */
    description.classList.add("visible");
    description.classList.remove("hidden");
    station.classList.add("visible");
    station.classList.remove("hidden");
    calendarContainer.classList.add("visible");
    calendarContainer.classList.remove("hidden");
}

async function loadPage(){
    pageSize();
    generateCalendar();
    await new Promise(r => setTimeout(r, 250));
    checkForBroadcasting();
    animatePageLoad();
    generateSongs();
}

window.onload = loadPage;
