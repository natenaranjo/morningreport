// Set today's date in the Date Input, Date can still be changed manually.
(function updatePage(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    // Set the date in the format for input box.
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('today-date').value = today;

}())

// Updates the Header of the page once all critera is met.
document.addEventListener('input', function Components() {
    // Updates the Footage remaining based off of TD Depth and Current Footage
    let tdepth = document.getElementById('tdepth').value;
    let cdepth = document.getElementById('cdepth').value;
    document.getElementById('footage').value = tdepth - cdepth;

    // Updates the header of the Page which is also the subject line for the email report.
    let client = document.getElementById('client').value;
    let rig = document.getElementById('rig').value;
    let well = document.getElementById('well').value;
    let job = document.getElementById('job').value;

    if(client == '' || rig == '' || well == '' || job == ''){
        document.getElementById('subject-line').textContent = '';
    } else {
        document.getElementById('subject-line').textContent = client + ', ' + rig + ', ' + well + ', ' + job;
    }

})

//Stores the well report into an object to load, save, and create new wells.  
let Report = {
    date: "",
    client: "",
    well: "",
    rig: "",
    plan: "",
    job: "",
    dcost: "",
    tcost: "",
    comments: "",
    hole: "",
    formation: "",
    tool: "",
    pulse: "",
    last: "",
    cdepth: "",
    tdepth: "",
    footage: "",
    summary: "",
    dcompany: "",
    ncompany: "",
    ddd: "",
    ndd: "",
    dmwd: "",
    nmwd: "",
    bdd: "",
    bmwd: "",
    pulsers: [],
    ddtools: []
}


// Will send the report through email by using html in the body to style the report.
function sendReport(){

}

// Will clear all the input areas when New Well is clicked.
document.getElementById('newWell').addEventListener('click', function newWell(){
    document.getElementById('reportForm').reset();
    document.getElementById('subject-line').textContent = '';
})

// Will create a new well into localstorage by well name.
document.getElementById('saveWell').addEventListener('click', function saveWell() {

    let wellName = document.getElementById('well').value;
    if(wellName == ''){
        alert('You must fill out form before saving!');      
        return;
    } else {
        Report.date = document.getElementById('today-date').value;
        Report.client = document.getElementById('client').value;
        Report.rig = document.getElementById('rig').value;
        Report.well = document.getElementById('well').value;
        Report.job = document.getElementById('job').value;
        Report.plan = document.getElementById('current-plan').value;
        Report.dcost = document.getElementById('daily-cost').value;
        Report.tcost = document.getElementById('total-cost').value;
        Report.comments = document.getElementById('comments').value;
        Report.hole = document.getElementById('hole-section').value;
        Report.formation = document.getElementById('formation').value;
        Report.tool = document.getElementById('tool-size').value;
        Report.pulse = document.getElementById('pulse-width').value;
        Report.last = document.getElementById('last').value;
        Report.cdepth = document.getElementById('cdepth').value;
        Report.tdepth = document.getElementById('tdepth').value;
        Report.footage = document.getElementById('footage').value;
        Report.summary = document.getElementById('summary').value;
        Report.dcompany = document.getElementById('dcompany').value;
        Report.ncompany = document.getElementById('ncompany').value;
        Report.ddd = document.getElementById('ddd').value;
        Report.ndd = document.getElementById('ndd').value;
        Report.dmwd = document.getElementById('dmwd').value;
        Report.nmwd = document.getElementById('nmwd').value;
        Report.bdd = document.getElementById('bdd').value;
        Report.bmwd = document.getElementById('bmwd').value;
        
        let pulserCell = [];
        let pulsers = document.getElementById('pulsers');
        for(let i = 0, row; i < pulsers.rows.length; i++){
            let row = pulsers.rows[i]

            for (let j = 0,cell; j < row.cells.length; j++){
                let col = row.cells[j].textContent
                pulserCell.push(col);            
            }
            Report.pulsers.push(pulserCell)
            pulserCell = [];
        }

        let toolsCell = [];
        let ddtools = document.getElementById('ddtools');
        for (let i = 0, row; i < ddtools.rows.length; i++) {
            let row = ddtools.rows[i];

            for (let j = 0, cell; j < row.cells.length; j++) {
                let col = row.cells[j].textContent;
                toolsCell.push(col);
            }
            Report.ddtools.push(toolsCell);
            toolsCell = [];
        }

        localStorage.setItem('Well: ' + Report.well, JSON.stringify(Report));
        console.log(Report);
    }
})

// Pull a list of all wells in the localstorage allowing to select one to load onto the page.
document.getElementById('loadWell').addEventListener('click', function loadWell() {
    
    document.getElementById('infoModalHeader').textContent = "Which Well to Load?";
    let body = document.getElementById('infoModalBody')
    if(!body.textContent == '') {
        body.textContent = '';
    }
    body.innerHTML += `<form id="loadWellModal" onsubmit="restoreWell();"></form>`;

    let form = document.getElementById('loadWellModal');

     if(!form.textContent == ''){
        form.textContent = '';
    }

    const loadWellKeys = [];

    for (let i = 0, l = localStorage.length; i < l; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("Well: ")){
        loadWellKeys.push([ key ]);
            form.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="loadWell" id="${key.replace("Well: ", "")}">
                <label class="form-check-label" for="flexRadioDefault1">${key.replace("Well: ", "")}</label>
            </div>
            `
        }
    }
    form.innerHTML +=
    `
        <input class="btn btn-primary mt-5" type="submit" name="submit" value="Submit" />
    `

})

// Pulls a list of all wells in the localstorage allowing user to select the well wants to remove.
document.getElementById('deleteWell').addEventListener('click', function deleteWell() {

    document.getElementById('infoModalHeader').textContent = "Which Well to Delete?";
    let body = document.getElementById('infoModalBody');
    if(!body.textContent == '') {
        body.textContent = '';
    }
    body.innerHTML += `<form id="deleteWellModal" onsubmit="removeWell()"></form>`;
    let form = document.getElementById('deleteWellModal');
    
    if(!form.textContent == ''){
        form.textContent = '';
    }

    const deleteWellKeys = [];
    console.log(deleteWellKeys);

    for (let i = 0, l = localStorage.length; i < l; i++) {
    let key = localStorage.key(i);
    if (key.startsWith("Well: "))
            form.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="wellSelected" id="${key.replace("Well: ", "")}">
                <label class="form-check-label" for="flexRadioDefault1">${key.replace("Well: ", "")}</label>
            </div>
            `
    }
    form.innerHTML +=
        `
            <input type="submit" name="submit" value="Submit" />
        `
})

function restoreWell() {
    let wellSelected = document.querySelector('input[name="loadWell"]:checked').id;
    localStorage.setItem('UpdatePage', JSON.stringify(wellSelected));
}

function removeWell(){
    let wellSelected = document.querySelector('input[name="wellSelected"]:checked').id;
    if(wellSelected == ''){
      return false;
    }
    else{
      window.localStorage.removeItem('Well: ' + wellSelected);
    }
}

window.addEventListener('load', function updatePage(){

    let pageData = JSON.parse(localStorage.getItem('UpdatePage'));

        if(pageData == null){
            return;
        } else {

            const pageLoad = JSON.parse(localStorage.getItem("Well: " + pageData));
            
            this.document.getElementById('client').value = pageLoad.client;
            this.document.getElementById('rig').value = pageLoad.rig;
            this.document.getElementById('well').value = pageLoad.well;
            this.document.getElementById('job').value = pageLoad.job;
            this.document.getElementById('current-plan').value = pageLoad.plan;
            this.document.getElementById('daily-cost').value = pageLoad.dcost;
            this.document.getElementById('total-cost').value = pageLoad.tcost;
            this.document.getElementById('comments').textContent = pageLoad.comments;
            this.document.getElementById('hole-section').value = pageLoad.hole;
            this.document.getElementById('formation').value = pageLoad.formation;
            this.document.getElementById('tool-size').value = pageLoad.tool;
            this.document.getElementById('pulse-width').value = pageLoad.pulse;
            this.document.getElementById('last').value = pageLoad.last;
            this.document.getElementById('cdepth').value = pageLoad.cdepth;
            this.document.getElementById('tdepth').value = pageLoad.tdepth;
            this.document.getElementById('footage').value = pageLoad.footage;
            this.document.getElementById('summary').textContent = pageLoad.summary;
            this.document.getElementById('dcompany').value = pageLoad.dcompany;
            this.document.getElementById('ncompany').value = pageLoad.ncompany;
            this.document.getElementById('ddd').value = pageLoad.ddd;
            this.document.getElementById('ndd').value = pageLoad.ndd;
            this.document.getElementById('dmwd').value = pageLoad.dmwd;
            this.document.getElementById('nmwd').value = pageLoad.nmwd;
            this.document.getElementById('bdd').value = pageLoad.bdd;
            this.document.getElementById('bmwd').value = pageLoad.bmwd;

            this.document.getElementById('subject-line').textContent = 
                pageLoad.client + ", " + pageLoad.rig + ", " + pageLoad.well + ", " + pageLoad.job;
        
            let pulsers = this.document.getElementById('pulsers');

            for(let i = 0; i < pageLoad.pulsers.length; i++){
                
            }
        
        }
})

document.getElementById('pulserAdd').addEventListener('click', function pulserAdd(){
    let tbody = document.getElementById('pulsers');
    let trow = tbody.rows.length;
    tbody.innerHTML += 
    `
        <tr id="prow-${trow + 1}">
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
        </tr>
    `
    console.log(trow);
})

// function saveTable() {

//     let tableData = [];
//     let tableCell = [];
//     let table = document.getElementById('pulsers');

//      for(let i = 0, row; i < table.rows.length; i++){
//         let row = table.rows[i]

//         for (let j = 0,cell; j < row.cells.length; j++){
//             let col = row.cells[j].textContent
//             tableCell.push(col);            
//         }
//         tableData.push(tableCell)
//         tableCell = [];
//      }

//     console.log(tableData);
// }