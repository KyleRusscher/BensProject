
function download() {
    const filename = 'config.json'
    const data = getFormData()

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)))
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  function getFormData(){
    var activeEzo = document.getElementsByClassName('econfig active')[0];
    var children = Array.from(activeEzo.children)
    let ezoAttributes = null

    children.forEach(child => {
        if(child.className.includes('eAttributes') > 0) {
            ezoAttributes = child
        }
      })
    if(ezoAttributes == null){
        alert('Somethign went wrong when gathering form data for selected ezo.  Please refresh and try again')
        return
    }
       
    
    data = {}
    Array.from(ezoAttributes.children).forEach(attribute => {
        if(attribute.tagName.toLowerCase() == 'div') {
            if(attribute.dataset.type=='radio'){
                parse_radio_data(attribute.dataset.name, data)
            } else if (attribute.dataset.type == 'number'){
                parse_number_data(attribute, data)
            }
        }
      })

      data['date'] = document.getElementById("date").value
      parse_radio_data('clock_radio', data)

      parse_radio_data('serialDataContinuous', data)
      parse_radio_data('serialDataTimestamp', data)
      parse_radio_data('temperatureUnits', data)
      parse_radio_data('recordingInterval', data)
      parse_radio_data('fileSaveInterval', data)
       
    return data
  }

function parse_radio_data(radio_name, data){
    var radios = document.getElementsByName(radio_name);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            data[radio_name] = radios[i].value
            return;
        }
    }
    alert(`The radio field ${radio_name} was not provided a value.  Please select an option and sumbit again`)
}

function setNumericFieldAmount(amount){
    let value = document.getElementById('calibSolnValues')
    while (value.firstChild) {
        value.removeChild(value.firstChild);
    }
    for(let i = 0; i < amount; i++){
        createNumberFeild(value, i+1)
    } 
}

function createNumberFeild(value, i){
    str = `<input type="number" id="phCalibrationPoints${Math.floor(Math.random() * 99999999)}Entry" name="phSolutionValue${i}">
    <label for="phCalibrationPoints1Entry">Point</label><br>`
    value.insertAdjacentHTML( 'beforeend', str );
}

function parse_number_data(attribute, data){
    Array.from(attribute.children).forEach(number_field => {
        if(number_field.tagName.toLowerCase() == 'input') {
            if(number_field.value == ''){
                alert(`The numeric field ${number_field.name} was empty.  PLease provide a value and resubmit.`)
            }
            data[number_field.name] = number_field.value
        }
      })

}

function ezoSelect(selectedEzo){
    var ezos = document.getElementsByClassName('econfig');
    for (let ezo of ezos) {
        ezo.classList.remove("active")
        ezo.classList.add("inactive")
    }
    let activeEzo = document.getElementById(selectedEzo)
    activeEzo.classList.remove("inactive")
    activeEzo.classList.add("active")
}
  