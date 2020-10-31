/*
 * Giovanni Battista Accetta Copyright 2016 - 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
    /** **************************************************************************
    *                       YOUR CUSTOM PROJECT CONFIGURATION 
    *             (Replace this url to your Open ChatBot API EndPoint)           */
    let apiEndPoint = "https://openchatbot.io/api/v1.0/ask"
    /*****************************************************************************/



    /** ***************************************************************************
     *
     * Variable
     *
     ****************************************************************************/

    let app = {
        ocb: document.querySelector('.ocb'),
        ocbButton: document.querySelector('.ocbButton'),
        spinner: document.querySelector('.loader_ocb'),
        userMessage: document.querySelector('.messageUserContainer_ocb'),
        ocbMessage: document.querySelector('.messageocbContainer'),
        galleryItem: document.querySelector('.galleryItemContainer_ocb'),
        galleryButton: document.querySelector('.galleryItemButton_ocb'),
        suggestionsItem: document.querySelector('.suggestionsItemContainer_ocb'),
        container: document.querySelector('.main_ocb'),
        phoneDialog: document.querySelector('.dialog-container_ocb'),
        footer: document.querySelector('.footer_ocb'),
        micro: document.querySelector('.micro-container_ocb'),
        dialogInput: document.querySelector('.dialog-input_ocb'),
        footerInput: document.querySelector('.footerInput_ocb'),
        fastScrollButton: document.querySelector('.ocb_fast_scroll_button'),
        isLoading: true,
        dialogVisible: false,
        audioConversation: false,
    };

    var messages = [];

    function newMessageAdded(snapshot, cache) {
        switch (snapshot.t) {
            case 0:
                app.addocbMessage(snapshot.m, cache);
                break;
            case 1:
                app.addUserMessage(snapshot.m, cache);
                break;
        }
    }


    /** ***************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/
    let butHide = document.getElementById('butHide');
    if (butHide != null) {
        butHide.addEventListener('click', function () {
            showocb(false);
        });
    }

    document.getElementById('butSend').addEventListener('click', function () {
        sendMessage();
    });

    document.getElementById('butMic').addEventListener('click', function () {
        app.startConversation();
        app.audioConversation = true;
    });

    document.getElementById('butAdd').addEventListener('click', function () {
        app.toggleDialog(true);
    });

    document.getElementById('butAddNumber').addEventListener('click', function () {
        let text = app.dialogInput.value;
        if (text != '') {
            app.dialogInput.value = '';
            app.savePhoneNumber(text);
            app.toggleDialog(false);
        }
    });

    document.getElementById('butAddNumberCancel').addEventListener('click', function () {
        // Close the add Number dialog
        app.toggleDialog(false);
    });

    document.getElementById('input').addEventListener('keypress', function (e) {
        let key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            sendMessage();
        }
    });

    app.fastScrollButton.addEventListener('click', function () {
        gotoBottom();
    });

    /** ***************************************************************************
     *
     * Document Wide listener to detect ocb added animation
     *
     ****************************************************************************/
    event = function (event) {
        if (event.animationName == 'ocbNodeInserted') gotoBottom();;
    }

    document.addEventListener('animationstart', event, false);
    document.addEventListener('MSAnimationStart', event, false);
    document.addEventListener('webkitAnimationStart', event, false);




    /** ***************************************************************************
     *
     * Method to generate UUID. Source: https://stackoverflow.com/a/2117523/5292951
     *
     ****************************************************************************/
    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    /** ***************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add phone number dialog.
    app.toggleDialog = function (visible) {
        if (visible) {
            app.phoneDialog.classList.add('dialog-container--visible');
            app.dialogVisible = true;
            app.toggleFooter(false);
        } else {
            app.phoneDialog.classList.remove('dialog-container--visible');
            app.dialogVisible = false;
            app.toggleFooter(true);
        }
    };

    // Toggles the visibility of the microphone.
    app.toggleMicro = function (visible) {
        if (visible) {
            app.micro.classList.add('micro-container--visible');
            app.toggleFooter(false);
        } else {
            app.micro.classList.remove('micro-container--visible');
            app.toggleFooter(true);
        }
    };

    // Toggles the visibility of the footer.
    app.toggleFooter = function (visible) {
        if (visible) {
            app.footer.classList.remove('footer--invisible');
        } else {
            app.footer.classList.add('footer--invisible');
        }
    };

    // Toggles the visibility of the suggestions.
    app.toggleSuggestionsVisibility = function (visible) {
        if (app.lastMessageSuggestions) {
            app.lastMessageSuggestions.parentNode.removeChild(app.lastMessageSuggestions);
            app.lastMessageSuggestions = null;
        }
    };

    // add a user message
    app.addUserMessage = function (messageText, cache) {
        //add message to local storage
        if (!cache) {
            var jsonMessage = { 't': 1, 'm': messageText };
            messages.push(jsonMessage);
            localStorage.setItem("messages", JSON.stringify(messages));
        }
        app.toggleSuggestionsVisibility(false);
        let message = app.userMessage.cloneNode(true);
        message.classList.remove('userMessageTemplate_ocb');
        message.removeAttribute('hidden');
        app.container.appendChild(message);
        message.querySelector('.message_ocb').textContent = messageText;
        app.setSpinnerVisible(false);
        app.container.scrollTop = message.offsetTop;
    };

    // ohodebug
    var printError = function(error, explicit) {
        console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
    }

    // add a ocb answer
    app.addocbMessage = function (messageJson, cache) {
        // ohodebug
        try{
            console.log("About to give messageJson")
            console.log("messageJson: "+ JSON.stringify(messageJson));  //ohodebug
        } catch (e) {
            if (e instanceof SyntaxError) {
                printError(e, true);
            } else {
                printError(e, false);
            }
        }

        //add message to local storage
        if (!cache) {
            try {
                var jsonMessage = { 't': 0, 'm': messageJson };
                messages.push(jsonMessage);
                localStorage.setItem("messages", JSON.stringify(messages));    
            } catch (e) {
                if (e instanceof SyntaxError) {
                    printError(e, true);
                } else {
                    printError(e, false);
                }    
            }
        }
        
        app.toggleSuggestionsVisibility(false);
        let messageText = messageJson.response.text;
        if (messageText != '') {
            let message = app.ocbMessage.cloneNode(true);
            message.classList.remove('ocbMessageTemplate');
            message.removeAttribute('hidden');

            //look for bot icon div to set bot icon
            let avatar = message.querySelector('.avatarocb');
            if (messageJson.meta.botIcon != null && messageJson.meta.botIcon.startsWith("https"))
                avatar.setAttribute("style", "background-image: url(" + messageJson.meta.botIcon + ");background-repeat: no-repeat;background-position: center;");
            else 
                avatar.setAttribute("style", "background-image: url(../images/default-icon.png);background-repeat: no-repeat;background-position: center;");

            app.container.appendChild(message);
            let textDiv = message.querySelector('.message_ocb');
            textDiv.textContent = messageText;
            app.setSpinnerVisible(false);
            let gallery = message.querySelector('.galleryFlexBox_ocb');
            gallery.appendChild(document.createElement('div'));
            let medias = messageJson.response.media;
            if (medias != null) medias.forEach(function (element) {
                //no mimeType for now
                //if (element.mimeType == 'image/png' || element.mimeType == 'image/jpeg') {
                let galleryItem = app.galleryItem.cloneNode(true);
                galleryItem.classList.remove('galleryItemTemplate_ocb');
                galleryItem.removeAttribute('hidden');
                gallery.removeAttribute('hidden');
                textDiv.setAttribute('hidden', true);
                gallery.appendChild(galleryItem);
                galleryItem.querySelector('.galleryImage_ocb').style.backgroundImage = 'url(' + element.src + ')';
                galleryItem.querySelector('.galleryShortDescription_ocb').textContent = element.title;
                galleryItem.querySelector('.galleryLongDescription_ocb').textContent = element.shortDesc;
                if (element.longDesc != null) galleryItem.querySelector('.galleryLongDescription_ocb').textContent = element.longDesc;

                let button = galleryItem.querySelector('.galleryLink_ocb');
                if (element.urlText != null && element.url != null) {
                    button.href = element.url;
                    button.textContent = element.urlText;
                    button.target = '_blank';
                } else {
                    button.setAttribute("hidden", true);
                }

                if (element.default_action != null && element.default_action.url != null) {
                    let imageLink = galleryItem.querySelector('.galleryImageLink_ocb');
                    imageLink.href = element.default_action.url;
                    imageLink.target = '_blank';
                }
                let buttonsList = element.buttons;
                if (buttonsList != null) {
                    buttonsList.forEach(function (element) {
                        if (element.type == 'web_url' && element.payload != null) {

                            let galleryButton = app.galleryButton.cloneNode(true);
                            galleryButton.classList.remove('galleryItemButtonTemplate_ocb');
                            galleryButton.removeAttribute('hidden');
                            galleryItem.querySelector('.galleryItem_ocb').appendChild(galleryButton);
                            let buttonLink = galleryButton.querySelector('.galleryItemButtonLink_ocb');
                            buttonLink.href = element.payload;
                            buttonLink.target = '_blank';
                            buttonLink.textContent = element.label;

                        }
                        if (element.type == 'natural_language') {

                            let galleryButton = app.galleryButton.cloneNode(true);
                            galleryButton.classList.remove('galleryItemButtonTemplate_ocb');
                            galleryButton.removeAttribute('hidden');
                            galleryButton.textContent = element.label;
                            galleryItem.querySelector('.galleryItem_ocb').appendChild(galleryButton);
                            galleryButton.addEventListener("click", function () {
                                app.addUserMessage(element.payload);
                                app.getocbMessage(element.payload);
                                let text = app.footerInput.value;
                                if (text.startsWith('@')) {
                                    const regex = /^(@\S+)/g;
                                    let m;
                                    if ((m = regex.exec(text)) !== null) {
                                        // The result can be accessed through the `m`-variable.
                                        app.footerInput.value = m[0] + " ";
                                    }
                                } else {
                                    app.footerInput.value = '';
                                }
                            });

                        }
                    }, this);
                }
            }, this);


            let suggestionsList = messageJson.response.suggestions;
            if (suggestionsList != null) {
                let suggestions = message.querySelector('.suggestionsFlexBox_ocb');
                suggestions.removeAttribute('hidden');
                app.lastMessageSuggestions = suggestions;
                suggestionsList.forEach(function (element) {
                    if (element.type == 'web_url' && element.payload != null) {
                        let suggestionsItem = app.suggestionsItem.cloneNode(true);
                        suggestionsItem.classList.remove('suggestionsItemTemplate_ocb');
                        suggestionsItem.removeAttribute('hidden');
                        suggestions.appendChild(suggestionsItem);
                        let suggestionLink = suggestionsItem.querySelector('.suggestionsItemLink_ocb');
                        suggestionLink.href = element.payload;
                        suggestionLink.target = '_blank';
                        suggestionLink.textContent = element.label;
                    }
                    if (element.type == 'natural_language') {
                        let suggestionsItem = app.suggestionsItem.cloneNode(true);
                        suggestionsItem.classList.remove('suggestionsItemTemplate_ocb');
                        suggestionsItem.removeAttribute('hidden');
                        suggestions.appendChild(suggestionsItem);
                        suggestionsItem.querySelector('.suggestionsItem_ocb').textContent = element.label;
                        suggestionsItem.addEventListener("click", function () {
                            app.addUserMessage(element.payload);
                            app.getocbMessage(element.payload);
                            let text = app.footerInput.value;
                            if (text.startsWith('@')) {
                                const regex = /^(@\S+)/g;
                                let m;
                                if ((m = regex.exec(text)) !== null) {
                                    // The result can be accessed through the `m`-variable.
                                    app.footerInput.value = m[0] + " ";
                                }
                            } else {
                                app.footerInput.value = '';
                            }
                        });
                    }
                }, this);
            } else {
                app.previousMessage = null;
            }
            app.container.scrollTop = message.offsetTop;
            app.speakMessage(messageText);
        }
    };

    // toggle spinner visibility
    // TODO use class tag such as pour toggleDialog
    app.setSpinnerVisible = function (visible) {
        if (visible) {
            app.spinner.setAttribute('hidden', true);
            app.isLoading = true;
        } else {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };

    /** ***************************************************************************
     *
     * Methods to send messages to ocb
     *
     ****************************************************************************/


    // sendMessage from input text box
    window.sendMessage = function () {
        let text = app.footerInput.value;
        if (text != '') {
            app.setSpinnerVisible(true);
            app.footerInput.value = '';
            app.addUserMessage(text);
            app.getocbMessage(text);
            if (text.startsWith('@')) {
                const regex = /^(@\S+)/g;
                let m;
                if ((m = regex.exec(text)) !== null) {
                    // The result can be accessed through the `m`-variable.
                    app.footerInput.value = m[0] + " ";
                }
            }
        }
    };

    app.startConversation = function () {
        if (!app.dialogVisible) {
            app.recognition.start();
        }
    };


    /** ***************************************************************************
     *
     * Methods for dealing with the model
     *
     ****************************************************************************/

    /*
     * Gets a forecast for a specific city and updates the card with the data.
     * getForecast() first checks if the weather data is in the cache. If so,
     * then it gets that data and populates the card with the cached data.
     * Then, getForecast() goes to the network for fresh data. If the network
     * request goes through, then the card gets updated a second time with the
     * freshest data.
     */

    app.getocbMessage = function (query) {
        let url = apiEndPoint + '?userId=' + app.phoneNumber + '&query=' + query + '&callback=parseocbAnswer';
        let encodedURL = encodeURI(url);
        // Fetch ocb response
        app.script = document.createElement('script');
        app.script.type = 'text/javascript';
        app.script.async = true;
        app.script.src = encodedURL;
        app.script.charset = 'utf-8'; //oho addition
        document.head.appendChild(app.script);
    };

    window.parseocbAnswer = function (json) {
        if (json != null) {
            app.addocbMessage(json, false);
        }
        document.head.removeChild(app.script);
    };

    // savePhoneNumber to localStorage.
    app.savePhoneNumber = function (phone) {
        app.phoneNumber = encodeURIComponent(phone);
        messages = [];
        localStorage.setItem("messages", JSON.stringify(messages));
        localStorage.phoneNumber = app.phoneNumber;
        removeElementsByClass('messageUserContainer_ocb');
        removeElementsByClass('messageocbContainer');
        app.getocbMessage('Bonjour');
    };

    app.speakMessage = function (messageText) {
        if (app.tts != null) {
            window.speechSynthesis.cancel();
            app.tts.text = messageText;
            window.speechSynthesis.speak(app.tts);
        }
    };

    /** **********************************************************************
     *
     * Utility functions
     * 
     ************************************************************************/

    function gotoBottom() {
        app.container.scrollTop = app.container.scrollHeight - app.container.clientHeight;
    }

    function removeElementsByClass(className) {
        var elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    app.container.onscroll = function (ev) {
        if ((app.container.clientHeight + app.container.scrollTop) >= app.container.scrollHeight) {
            app.fastScrollButton.setAttribute('hidden', true);
        } else {
            app.fastScrollButton.removeAttribute('hidden');
        }
    };


    /** **********************************************************************
     *
     * Code required to start the app
     *
     * NOTE: To simplify this codelab, we've used localStorage.
     *   localStorage is a synchronous API and has serious performance
     *   implications. It should not be used in production applications!
     *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
     *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
     ************************************************************************/

    if (('webkitSpeechRecognition' in window)) {
        app.recognition = new webkitSpeechRecognition();
        app.recognition.continuous = false;
        app.recognition.interimResults = false;
        app.recognition.lang = 'fr-FR';
        app.recognition.onstart = function () {
            app.toggleMicro(true);
        };
        app.recognition.onresult = function (event) {
            app.toggleMicro(false);
            let transcript = '';
            transcript = event.results[0][0].transcript;
            if (transcript != '') {
                app.addUserMessage(transcript);
                app.getocbMessage(transcript);
            } else app.audioConversation = false;
        };
        app.recognition.onend = function () {
            app.toggleMicro(false);
        };
        app.recognition.onerror = function (event) {
            app.toggleMicro(false);
            app.audioConversation = false;
        };
    }

    if (('speechSynthesis' in window)) {
        /*
        app.tts = new SpeechSynthesisUtterance();
        // wait on voices to be loaded before fetching list
        window.speechSynthesis.onvoiceschanged = function() {
          let voices = window.speechSynthesis.getVoices();
          app.tts.voice = voices.filter(function(voice) {
            return voice.lang == 'fr-FR';
          })[0]; // Note: some voices don't support altering params
        };
        app.tts.volume = 1; // 0 to 1
        app.tts.rate = 1; // 0.1 to 10
        app.tts.pitch = 1; // 0 to 2
        app.tts.lang = 'fr-FR';
        app.tts.onend = function(e) {
          if (app.audioConversation) app.startConversation();
        };
        */
    }


    app.phoneNumber = localStorage.phoneNumber;
    if (app.phoneNumber) {
        //todo to be commented if datasync is used
        Array.prototype.push.apply(messages, JSON.parse(localStorage.getItem("messages")));
        Array.prototype.forEach.call(messages, child => {
            newMessageAdded(child, true);
        });

    } else {
    /* The user is using the app for the first time, or the user has not
     * saved the number, so show the user some fake data. A real app in this
     * scenario could guess the user's location via IP lookup and then inject
     * that data into the page.
     */
    app.savePhoneNumber(uuidv4());
    console.log(app.phoneNumber);
    //todo this line is to toggle login dialog
    //app.toggleDialog(true);
}

// TODO add service worker code here
if (butHide == null && 'serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/openchatbot-webclient/service-worker.js', {scope: '/openchatbot-webclient/'})
        .then(function () {
            console.log('Service Worker Registered');
        })
        .catch(function(error) {
            console.log('Registrtation failed: ' + error);
        })
}
})();
