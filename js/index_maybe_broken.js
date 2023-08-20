const body = document.body;
const main = document.getElementById("main");
const arcSvg = document.getElementById("arc-svg");

function pageSize(){

    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);

    if (innerHeight/innerWidth >= 2){
        arcSvg.setAttribute("viewBox", "-16 -20 150 280");
        arcSvg.setAttribute("preserveAspectRatio", "none");
    }
    else if (innerHeight < innerWidth){
        arcSvg.setAttribute("viewBox", "-60 -40 235.46 300");
        arcSvg.removeAttribute("preserveAspectRatio");
    }
    else {
        arcSvg.setAttribute("viewBox", "-16 -20 150 280");
        arcSvg.removeAttribute("preserveAspectRatio");
    }
}
window.onresize = pageSize;

const calendarBody = document.getElementById("ll-calendar-body");
const calendarHeader = document.getElementById("ll-calendar-header");

async function generateCalendar(){
    fetch('../json/events.json')
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
                            const linkColor = event.linkColor

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
                                <td class="ll-location${displayTime} on <a href=${linkToListen} style="background-color:#FFE0E0;border:none;color:${linkColor};padding:5px7px;text-align:center;text-decoration:none;display:inline-block;margin:4px4px;cursor:pointer;border-radius: 4px;">${location}</a></td>
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
        calendarHeader.innerHTML = "Calendar (PDT)";
    }

}

const arc = document.getElementById("arc");
const arcText = document.getElementById("arc-text");

async function generateSongs() {
    fetch('../csv/songs.csv')
        .then(response => response.text())
        .then(obj => {
            const lines = obj.trim().split("\n");
            // Determine the separator by checking the first line
            const separator = lines[0].includes('\t') ? '\t' : ',';

            let oneArcLength = 143;
            let arcOutput = "Coming up: ";
            let counter = 0;
            lines.forEach(value => {
                const songSeparated = value.split(separator);

                if (songSeparated.length === 2) {
                    const artist = songSeparated[0].trim();
                    const song = songSeparated[1].trim();

                    arcOutput += song + " - " + artist;

                    if (counter !== lines.length - 1) {
                        arcOutput += " / ";
                    }
                }
                counter++;
            });

            let totalLengthPercent = (((arcOutput.length + oneArcLength) - oneArcLength) / oneArcLength) * 100;

            const arcText = document.getElementById('arc-text');
            const arc = document.getElementById('arc');

            if (arcOutput !== "Airing soon: ") {
                arcText.innerHTML = arcOutput;
                arcText.innerHTML +=
                    `<animate
                  attributeName="startOffset"
                  from="100%"
                  to ="-${totalLengthPercent}%"
                  begin="0.5s"
                  dur="60s"
                  repeatCount="indefinite"
                  restart="always"
                  keyTimes="0;1"
                  calcMode="paced"
                  />`;
            }

            arc.classList.add("visible");
            arc.classList.remove("hidden");
        });
}


function backspaceText(element, text, index = text.length) {
    if (index > 0) {
        element.innerHTML = text.substring(0, index - 1);
        setTimeout(() => backspaceText(element, text, index - 1), 100);
    } else {
        element.innerHTML = ""; // Clear the content after the backspace is complete
    }
}

function typeText(element, text, index = 0) {
    if (index < text.length) {
        element.innerHTML = text.substring(0, index + 1);
        setTimeout(() => typeText(element, text, index + 1), 100);
    } else {
        // Wait 2 seconds before starting the backspace animation
        setTimeout(() => backspaceText(element, text), 2000);
    }
}

const announcement = document.getElementById("ll-announcement");

async function createAnnouncements(){
    fetch('../json/announcements.json')
    .then(response => response.json())
    .then(obj => {
        if (obj.announcements.length > 0){
            const announcementText = document.createElement("span");
            announcementText.id = "announcement-text";
            announcementText.className = "hidden";
            announcement.appendChild(announcementText);
            announcementText.innerHTML += `<b>${obj.announcements[0].date}</b> ${obj.announcements[0].announcement}`;
        }
    });
}

function activateAnnouncements(){
    body.classList.add("announcement");
    setTimeout(() => {
        const announcementText = document.getElementById("announcement-text");
        announcementText.classList.add("visible");
        announcementText.classList.remove("hidden");
        typeText(announcementText, announcementText.textContent);
        announcementText.innerHTML = ""; // Clear the content so that typing can start from the beginning
    }, 1000); // Adjust the time based on when you want the typing to start
}

const logo = document.getElementById("ll-logo");
const lightLayerHeaders = document.getElementsByClassName("ll-name-element");
const description = document.getElementById("ll-description");
const station = document.getElementById("ll-station");
const calendarContainer = document.getElementById("ll-calendar-container");
const myPath = document.getElementById("myPath");
const socialLinksContainer = document.getElementById("ll-socials-container")

async function animatePageLoad(){

    /* Transitions the logo down and un-hides it*/
    logo.classList.remove("above-page");
    logo.classList.add("visible");
    logo.classList.remove("hidden");
    arc.setAttribute("style", "background-color: #f2f2f2");
    myPath.setAttribute("stroke", "#f2f2f2");

    /* Waits 1200 milliseconds */
    await new Promise(r => setTimeout(r, 1200));

    /* Transitions the two segments of the logo "light" and "layer" */
    for (let i = 0; i < lightLayerHeaders.length; i++){
        lightLayerHeaders[i].classList.add("visible");
        lightLayerHeaders[i].classList.remove("hidden");
    }

    /* Waits 100 milliseconds */
    await new Promise(r => setTimeout(r, 100));

    /* Transitions description down */
    description.classList.add("visible");
    description.classList.remove("hidden");
    station.classList.add("visible");
    station.classList.remove("hidden");
    calendarContainer.classList.add("visible");
    calendarContainer.classList.remove("hidden");
    socialLinksContainer.classList.add("visible");
    socialLinksContainer.classList.remove("hidden");
}

async function loadPage(){
    pageSize();
    generateCalendar();
    await new Promise(r => setTimeout(r, 250));
    checkForBroadcasting();
    animatePageLoad();
    generateSongs();
    await new Promise(r => setTimeout(r, 5000));
    createAnnouncements();
    await new Promise(r => setTimeout(r, 1000));
    activateAnnouncements();
}

window.onload = loadPage;
