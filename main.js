
let hourOffset=0;
let blob=0;
let blobManual=0;
let date;
let dateManual;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    
    this.stop = function () {
        this.sound.pause();
    };
    
}

function setup() {
    console.log(mySounds);

    console.log("HI2");
    
}


function dateCalc(isManual, dlReady){
    
    if(!isManual)
        {
            date = new Date();   
        } else {
            date = new Date(document.getElementById('datepick').value);
        }
    //date.setHours(date.getHours()+hourOffset);

    document.getElementById("dateText").innerText=date.toDateString() + "\n"+ date.toTimeString();

    const weekday= date.getDay().toString();

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    const hour = date.getHours().toString().padStart(2,'0');
    const minute = date.getMinutes().toString().padStart(2,'0');
    //const zone = date.getTimezoneOffset();//.toString.padStart(2,'0');
    //note - go back and 
    const zone='33';
    const formattedDate = `${weekday}${day}${month}${year}${hour}${minute}${zone}`;
    //let blob;

    console.log("DATE HERE");
    console.log(formattedDate);

    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Set the response type to "arraybuffer"
    xhr.responseType = "arraybuffer";

    // Open the request
    xhr.open("GET", "test.uf2", true);

    // Send the request
    xhr.send();

    // Wait for the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Get the array buffer from the response
            var arrayBuffer = xhr.response;

            // Convert the array buffer to a typed array
            var dataView = new Uint8Array(arrayBuffer);

            console.log(dataView);

    const searchString = 'nanoplanktons';
    const replacementString = formattedDate;
    //const replacementString = '2130923204809';

    const searchLength = searchString.length;

    // Iterate over the data view
    for (let i = 0; i < dataView.length - searchLength; i++) {
        // Check if the current bytes match the search string
        let match = true;
        for (let j = 0; j < searchLength; j++) {
            if (dataView[i + j] !== searchString.charCodeAt(j)) {
                match = false;
                break;
            }
        }
        if (match) {
            // Replace the bytes with the replacement string
            for (let j = 0; j < searchLength; j++) {
                dataView[i + j] = replacementString.charCodeAt(j);
            }
        }
    }

        blob = new Blob([dataView], { type: 'document/octet-stream' });
        dlReady(blob);
    


        }
    };
}


//dateCalc();

function dlClickAuto(){
    
            dateCalc(false, function doDownlaod(blob){
            

            const url = URL.createObjectURL(blob);

            // Create a link to the file and trigger a download

            const link = document.createElement('a');
            link.href = url;
            let date = new Date();
            let fileName = "PetRock - "+date.toDateString()+".uf2";
            link.download = fileName;
            link.click();

            // Clean up
            URL.revokeObjectURL(url);
            });
            
}

function dlClickManual(){
    
            dateCalc(true, function doDownloadManual(blob)
            {
    
            const urlManual = URL.createObjectURL(blob);

            // Create a link to the file and trigger a download

            const link = document.createElement('a');
            link.href = urlManual;
            //let date = new Date();
            let fileName = "PetRockFirm "+date.toDateString()+".uf2";
            link.download = fileName;
            link.click();

            // Clean up
            URL.revokeObjectURL(urlManual);
            });
}

function getFormData()
{

}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  //xmlhttp.responseType = "arraybuffer";
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.response;
  }
  //console.log(result);
  return result;
}



