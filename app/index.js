import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { user            } from "user-profile";
import { battery         } from "power";
import { today           } from "user-activity";
import { Barometer       } from "barometer";
import { goals           } from "user-activity";
import * as util           from "../common/utils";
//Arrays
var dateword     = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth", "ninth", "tength", "eleventh", "twelth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth",
                    "eighteenth", "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", 
                    "thirtieth", "thirty-first"];
var days         = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var months       = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'septempber', 'october', 'november', 'december'];
var hourTiming   = ["midnight", "one", "two" , "three" , "four" , "five" , "six" , "seven" , "eight" , "nine" , "ten" , "eleven" , "twelve" ];
var minuteTiming = ["exactly","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","quarter",
                    "sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five","twenty-six","twenty-seven",
                    "twenty-eight","twenty-nine","half"];

// Change this variable if concole log messages are required.
var debug = false;
util.debufinfo("In application",debug);
// Update the clock every minute
// This ensure clock has very minimal usage 
clock.granularity = "minutes";
var hrm = new HeartRateSensor();
hrm.start();

// Get documents handle
let myTime = document.getElementById("myTime");
let myHR = document.getElementById("HR");
let myHRinfo = document.getElementById("HRinfo");
let myRHR = document.getElementById("RHR");
let mySTEPS = document.getElementById("STEPS");
let mySTEPSINFO = document.getElementById("STEPSBAR");
let myWEIGHT = document.getElementById("WEIGHT");
let myBL = document.getElementById("BL");
let myinfo = document.getElementById("info");
let myBLinfo = document.getElementById("BLinfo");


// Update the <text> element with the current time
function updateClock() {

    let now = new Date();
    let hours = now.getHours();
    let mins = now.getMinutes();
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let wordday = dateword[now.getDate() - 1];

    // Set up the time string.
//    myTime.text = "It's " + minutetoword(mins) + " " + hourtoword(hours, mins) + " on " + day + " the " + wordday + " of " + month + ", " + now.getFullYear();
    myTime.text = "It's " + minutetoword(mins) + " " + hourtoword(hours, mins);
    myinfo.text = now.getDate() + "/" + ( now.getMonth() + 1) ;
    console.log("Day:" + now.getDate());
    console.log("Month:" + ( now.getMonth() + 1));
    console.log("In update clock:" + myTime.text );
    hrm.start();
}

//Make sure batery life is preserved.
hrm.onreading = function() {
    let iStatSteps = (today.adjusted.steps || 0);
    let iGoalSteps = (goals.steps || 0);
    let iPercentSteps = Math.floor(iStatSteps/iGoalSteps * 100);
 
  
    myHR.text = hrm.heartRate;
    console.log("In hrm on reading:" + myHR.text);
    myRHR.text = user.restingHeartRate;
    mySTEPS.text = today.adjusted.steps;
    let iStepWidth = iPercentSteps / 100 * 174;
    if (iStepWidth > 174) {  iStepWidth = 174; }
    mySTEPSINFO.width = iStepWidth;
    mySTEPSINFO.style.fill = util.colourStat(iPercentSteps);
    
    console.log("My adjusted steps:" + today.adjusted.steps );
    console.log("My step goal percentage:" + iPercentSteps );
    console.log("My step goal width:" + iStepWidth );
  
    myWEIGHT.text = user.weight + " KG";
  
    console.log("My weight:" + user.weight );
  
    myBL.text = Math.floor(battery.chargeLevel) + "%";
    myBLinfo.style.fill = util.colourStat(battery.chargeLevel);
    //Set up the colour based on heart rate zone.
    myHRinfo.style.fill = util.setHRzone(hrm.heartRate);
    hrm.stop();
}



function hourtoword(hour, minute) {
    //If we're past 30 mins then we move TO the hour rather than PAST the current one
    if (minute > 30) {
        hour = hour + 1;
    }
    //if it's PM then subtract 12 to get the reference
    if (hour > 12) {
        hour = hour - 12;
    }

    return hourTiming[hour];
}

function minutetoword(time) {

    //decide if we're past the hour or to the next hour
    var suffix = (time < 30) ? " minutes past" : " minutes to";
    //The milestones
    switch (time) {
        case 0:
            suffix = "";
            break;
        case 1:
            suffix = " minute past";
            break;
        case 59:
            suffix = " minute to";
            break;
            //Past the hour
        case 5:
        case 10:
        case 15:
        case 20:
        case 25:
        case 30:
            suffix = " past";
            break;
            //To the hour
        case 35:
        case 40:
        case 45:
        case 50:
        case 55:
            suffix = " to";
            break;
    }
    if (time > 30) {
        time = 60 - time;
    }

    return minuteTiming[time] + suffix;
}



// Update the clock every tick event
updateClock();
clock.ontick = () => updateClock();
