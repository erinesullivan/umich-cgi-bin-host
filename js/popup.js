const getContainer = document.getElementById('host-information');
          
const appendElement = (element) => {
  getContainer.appendChild(element);
}

const fieldID = (suffix) => {
  return `field${suffix}`;
}

const createLabel = (label, index) => {
  const labelElement = document.createElement('label');
  labelElement.innerHTML = label;
  labelElement.htmlFor = fieldID(index);
  appendElement(labelElement);
}

const buttonID = (suffix) => {
  return `button${suffix}`;
}

const createButton = (index) => {
  const buttonElement = document.createElement('button');
  buttonElement.id = buttonID(index);
  buttonElement.innerHTML = '<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon-copy"><path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" class=""></path></svg>';
  buttonElement.ariaLabel = buttonElement.title = `Copy the value from ${fieldID(index)}`;
  appendElement(buttonElement);
}

const createInput = (value, index) => {
  const inputElement = document.createElement('input');
  inputElement.name = inputElement.id = fieldID(index);
  inputElement.type = 'text';
  inputElement.value = value;
  inputElement.readOnly = true;
  appendElement(inputElement);
}

const copyInput = (index) => {
  const input = document.getElementById(fieldID(index));
  input.select();
  document.execCommand('copy');
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true }, (tabs) => {
    const currentURL = new URL(tabs[0].url);
    const cgiBinHost = `${currentURL.protocol}//${currentURL.hostname}/cgi-bin/host`;
    const notFound = () => {
      getContainer.innerHTML = '<p>Hosting information could not be located.</p>';
    }
    if(currentURL.protocol.startsWith('http')) {
      fetch(cgiBinHost)
        .then((response) => {
          if(response.ok) return response.text();
        })
        .then((data) => {
          if(!data || !data.startsWith('host')) {
            notFound();
          } else {
            getContainer.innerHTML = '';
            const hostDetails = data.split('\n');
            hostDetails
              .reverse()
              .forEach((hostDetail, index) => {
                const detail = hostDetail.split(': ');
                if(hostDetail == '') return;
                createLabel(detail[0], index);
                createButton(index);
                createInput(detail[1], index);
                document
                  .getElementById(buttonID(index))
                  .addEventListener('click', {
                    handleEvent: () => copyInput(index)
                  });
              });
          }
        });
    } else {
      notFound();
    }
  });
});
