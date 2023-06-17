let myMessage = "";
const threshold = 5;
let translation = {}
const client = {language: ""};

const execute = (conversationPanelWrapper) => {
    scanChatForMessages(conversationPanelWrapper).then(messages => {
        const messagesText = collectText(messages);
        const relevantMessages = filterText(messagesText);
        const countOccurrences = searchTextInMessages(relevantMessages, translation.textToSearch);
        if (countOccurrences >= threshold && notSentYet(messages, messagesText)) {
            const confirmation = window.confirm(translation.messageDialog);
            if (confirmation) {
                const dialog = createDialog();
                conversationPanelWrapper.appendChild(dialog);
                dialog.showModal();
            }
        }
    })
}

const scanChatForMessages = (conversationPanelWrapper) => {
    const msgSelectorAll = '[data-testid="msg-container"]';
    return waitForNodes(conversationPanelWrapper, msgSelectorAll);
}

const collectText = (messages) => {
    const textArr = [];
    Array.from(messages).forEach(msg => {
        textArr.push(msg.textContent);
    })
    return textArr;
}

const filterText = (messagesText) => {
    const firstCongratsIndex = getFirstCongratsIndex(messagesText);
    return messagesText.slice(firstCongratsIndex)
}

const getFirstCongratsIndex = (messagesText) => {
    return messagesText.findIndex(text => text.includes(translation.textToSearch));
}

const searchTextInMessages = (messagesText, textToSearch) => {
    return messagesText.filter(text => text.includes(textToSearch)).length;
}

const notSentYet = (messages, messagesText) => {
    const firstCongratsIndex = getFirstCongratsIndex(messagesText);
    return !Array.from(messages).slice(firstCongratsIndex).find((msg) => {
        const sentByMeElement1 = msg.querySelector('[data-testid="msg-dblcheck"]');
        const sentByMeElement = msg.querySelector('[data-testid="msg-check"]');
        return (sentByMeElement || sentByMeElement1);
    })
}

const waitForNodes = (parentNode, selector) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = parentNode.querySelectorAll(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 1000);
    });
}

const createDialog = () => {
    const dialog = document.createElement("dialog");
    dialog.open = false;
    dialog.id = "dialog";
    dialog.style.direction = translation.direction;
    dialog.style.width = "340px";
    dialog.style.height = "320px";
    dialog.style.borderRadius = "5%";
    dialog.style.border = "2px solid rgba(106,162,89,0.75)";
    dialog.style.background = "rgba(243,255,238,0.5)";
    dialog.style.padding = "8px";
    dialog.style.display = "flex";
    dialog.style.flexDirection = "column";
    dialog.style.justifyContent = "center";
    dialog.style.alignItems = "center";

    const title = createTitle();
    const slider = createSlider();
    const div = labelDiv();
    const sliderDiv = createSliderDiv();
    const buttonsDiv = createButtonsDiv();
    const submit = createSubmitButton();
    const cancelButton = createCancelButton();

    sliderDiv.appendChild(slider)
    buttonsDiv.appendChild(submit);
    buttonsDiv.appendChild(cancelButton);
    dialog.appendChild(title);
    dialog.appendChild(sliderDiv);
    dialog.appendChild(div);
    dialog.appendChild(buttonsDiv);

    return dialog;
}

const createTitle = () => {
    const title = document.createElement("h1");
    title.id = "title";
    title.textContent = translation.titleText;
    title.style.fontFamily = translation.font;
    title.style.fontSize = "1.8em";
    title.style.marginTop = "0px";
    title.style.marginBottom = "15px";
    return title;
}

const createSliderDiv = () => {
    const div = document.createElement("div");
    div.style.marginTop = "10px";
    div.style.marginBottom = "15px";
    div.style.background = "#fafdff";
    div.style.border = "2px solid #2780e5";
    div.style.borderRadius = "8px";
    return div;
}

const createSlider = () => {
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "slider";
    slider.min = "1";
    slider.max = "10";
    slider.value = "5";
    slider.step = "0.01";
    slider.style.width = "160px";
    slider.style.margin = "5px 7px 5px 7px";
    slider.style.cursor = "pointer";
    slider.addEventListener("input", () => {
        document.getElementById("label").innerHTML = getLevelByValue(slider.value);
    })
    return slider;
}

const labelDiv = () => {
    const div = document.createElement("div");
    div.id = "label";
    div.style.fontFamily = translation.font;
    div.style.fontSize = "1.4em";
    div.innerHTML = translation.labelMedium;
    myMessage = translation.messageMedium;
    div.style.marginTop = "10px";
    div.style.marginBottom = "15px";
    return div;
}

const createButtonsDiv = () => {
    const div = document.createElement("div");
    div.id = "buttons";
    div.style.width = "200px";
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.marginTop = "15px";
    div.style.marginBottom = "0";
    return div;
}

const createSubmitButton = () => {
    const submit = document.createElement("button");
    submit.id = "submit";
    submit.textContent = translation.send;
    submit.style.fontFamily = translation.font;
    submit.style.fontSize = "1.3em";
    submit.style.padding = "5px";
    submit.style.height = "40px";
    submit.style.width = "90px";
    submit.style.borderRadius = "8px";
    submit.style.cursor = "pointer";
    submit.style.border = "1px solid #016701";
    submit.style.color = "#016701";
    submit.style.background = "#c9f8c9";
    submit.addEventListener('mouseover', function () {
        this.style.transition = 'all 0.3s';
        this.style.color = "white";
        this.style.background = "#016701";
    })
    submit.addEventListener('mouseout', function () {
        this.style.transition = 'all 0.5s';
        this.style.color = "#016701";
        this.style.background = "#c9f8c9";
    });
    submit.addEventListener("click", () => {
        const dialog = document.getElementById("dialog");
        dialog.close();
        dialog.remove();
        sendMessage();
    });
    return submit;
}

const createCancelButton = () => {
    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel";
    cancelButton.textContent = translation.cancel;
    cancelButton.style.fontFamily = translation.font;
    cancelButton.style.fontSize = "1.3em";
    cancelButton.style.padding = "5px";
    cancelButton.style.height = "40px";
    cancelButton.style.width = "90px";
    cancelButton.style.borderRadius = "8px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.border = "1px solid #790000"
    cancelButton.style.color = "#790000";
    cancelButton.style.background = "#ffd6d6";
    cancelButton.addEventListener('mouseover', function () {
        this.style.transition = 'all 0.3s';
        this.style.color = "white";
        this.style.background = "#790000";
    })
    cancelButton.addEventListener('mouseout', function () {
        this.style.transition = 'all 0.5s';
        this.style.color = "#790000";
        this.style.background = "#ffd6d6";
    });
    cancelButton.addEventListener("click", () => {
        const dialog = document.getElementById("dialog");
        dialog.close();
        dialog.remove();
    });
    return cancelButton;
}

const getLevelByValue = (val) => {
    let label;
    if (val > 6) {
        label = translation.labelHigh;
        myMessage = translation.messageHigh;
    } else if (val < 4) {
        label = translation.labelLow;
        myMessage = translation.messageLow;
    } else {
        label = translation.labelMedium;
        myMessage = translation.messageMedium;
    }
    return label;
}

const sendMessage = () => {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text', myMessage);
    const event = new ClipboardEvent('paste', {
        clipboardData: dataTransfer,
        bubbles: true
    });
    let conversationInputElement = document.querySelector('[data-testid="conversation-compose-box-input"]');
    setTimeout(() => {
        conversationInputElement.click();
        conversationInputElement.dispatchEvent(event);
    }, 500);
    setTimeout(() => {
        const send = document.querySelector('[data-testid="send"]');
        send.click();
    }, 1500);
}

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            const addedNodes = Array.from(mutation.addedNodes);
            const newChatNodes = addedNodes.filter(node =>
                node.getAttribute && node.getAttribute("data-testid") === "conversation-panel-wrapper"
            );
            if (newChatNodes.length > 0) {
                const conversationPanelWrapper = newChatNodes[0];
                execute(conversationPanelWrapper);
            }
        }
    }
})

const observerConfig = {childList: true, subtree: true};
observer.observe(document.body, observerConfig);
initTranslations().catch(error => console.log(error));

async function initTranslations() {
    let clientLanguage = localStorage.getItem("WALangPref");
    client.language = clientLanguage.includes("he") ? "he" : "en";
    let languagePath = `languages/${client.language}.json`;
    let htmlUrl = chrome.runtime.getURL(languagePath);
    const response = await fetch(htmlUrl);
    translation = await response.json();
}