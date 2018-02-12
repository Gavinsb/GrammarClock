
import { user } from "user-profile";




// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function setHRzone(heartrate) {
    console.log("HR Colour:" + user.heartRateZone(heartrate || 0));
    //Set up the colour based on heart rate zone.
    switch (user.heartRateZone(heartrate || 0)) {
        case "out-of-range":
            return "black";
            break;
        case "fat-burn":
            return "green";
            break;
        case "cardio":
            return  "orange";
            break;
        case "peak":
            return "red";
            break;
    }

}


export function colourStat(iPercentage)
{
 
  if (iPercentage >= 100)
  {
    return "fb-green";
  }
  else
  {
    if (iPercentage > 80)
    {
      return "fb-mint";
    }
    else if (iPercentage > 50)
    {
      return "fb-peach";
    }
    else if (iPercentage < 25)
    {
      return "fb-orange";
    }
    else
    {
      return "fb-red";
    }
  }
}