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

function getFormData() {
    var activeEzo = document.getElementsByClassName('econfig active')[0];
    var children = Array.from(activeEzo.children)
    let ezoAttributes = null

    children.forEach(child => {
        if (child.className.includes('eAttributes') > 0) {
            ezoAttributes = child
        }
    })

    if (ezoAttributes == null) {
        alert('Somethign went wrong when gathering form data for selected ezo.  Please refresh and try again')
        return
    }

    data = {}
    let inputs = ezoAttributes.getElementsByTagName('input');
    Array.from(inputs).forEach(input => {
        if (input.type == 'radio') {
            parse_radio_data(input.name, data)
        } else if (input.type == 'number') {
            parse_number_data(input, data)
        }
    })
    data['date'] = document.getElementById("date").value
    parse_radio_data('clock', data)
    parse_radio_data('serialDataContinuous', data)
    parse_radio_data('serialDataTimestamp', data)
    parse_radio_data('temperatureUnits', data)
    parse_radio_data('recordingInterval', data)
    parse_radio_data('fileSaveInterval', data)
    return data
}

function parse_radio_data(radio_name, data) {
    var radios = document.getElementsByName(radio_name);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            data[radio_name] = radios[i].value
            return;
        }
    }
    alert(`The radio field ${radio_name} was not provided a value.  Please select an option and sumbit again`)
}

function setNumericFieldAmount(amount) {
    var activeEzo = document.getElementsByClassName('econfig active')[0]
    var ezoId = activeEzo.id
    let value = activeEzo.getElementsByClassName('calibSolnValues')[0]
    while (value.firstChild) {
        value.removeChild(value.firstChild);
    }
    for (let i = 0; i < amount; i++) {
        createNumberFeild(value, i + 1, ezoId)
    }
}

function createNumberFeild(value, i, ezoId) {
    str = `<input type="number" id="${ezoId}CalibrationPoints${i}Entry" name="${ezoId}SolutionValue${i}">
    <label for="${ezoId}CalibrationPoints${i}Entry">Point</label><br>`
    value.insertAdjacentHTML('beforeend', str);
}

function parse_number_data(number_field, data) {
    if (number_field.value == '') {
        alert(`The numeric field ${number_field.name} was empty.  Please provide a value and resubmit.`)
        return
    }
    data[number_field.name] = number_field.value
}

function ezoSelect(selectedEzo, element) {
    let tabs = document.getElementsByClassName('tab')
    Array.from(tabs).forEach(tab => {
        tab.classList.remove('buttonActive')
    })
    element.classList.add('buttonActive')
    document.getElementById('ezoLabel').textContent = `${selectedEzo} Configuration`;
    var ezos = document.getElementsByClassName('econfig');
    for (let ezo of ezos) {
        ezo.classList.remove("active")
        ezo.classList.add("inactive")
    }
    let activeEzo = document.getElementById(selectedEzo)
    activeEzo.classList.remove("inactive")
    activeEzo.classList.add("active")
}