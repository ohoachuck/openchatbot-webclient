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

(function() {
  /** **************************************************************************
  *                       YOUR CUSTOM PROJECT CONFIGURATION 
  *             (Replace this url to your openchatbot-webclient path           */
  let webClientURL = 'https:\/\/metaboto.com/openchatbot-webclient\/'
  /*****************************************************************************/


  
  /** ***************************************************************************
   *
   * Statements to create HTML ocb blocks and styling
   *
   ****************************************************************************/

  // import CSS
  let link = document.createElement('link');
  link.id = 'cssocb';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = webClientURL + 'styles/floatingInline.css';
  document.head.appendChild(link);

  // create HTML string
  let strVar = '';
  strVar += '  <header class="header_ocb">';
  strVar += '    <h1 class="header__title_ocb">OpenChatBot client<\/h1>';
  strVar += '    <button id="butAdd" class="headerButton_ocb" aria-label="Add" hidden><\/button>';
  strVar += '    <button id="butHide" class="headerButton_ocb" aria-label="Hide"><\/button>';
  strVar += '  <\/header>';
  strVar += '  <main class="main_ocb">';
  strVar += '        <div class="messageUserContainer_ocb userMessageTemplate_ocb" hidden>';
  strVar += '          <div class="message_ocb"> <\/div>';
  strVar += '        <\/div>';
  strVar += '        <div class="messageocbContainer ocbMessageTemplate" hidden>';
  strVar += '          <div class="ocbFlexBox">';
  strVar += '            <div class="avatarocb"> <\/div>';
  strVar += '            <div class="messageContentocb">';
  strVar += '              <div class="message_ocb"> <\/div>';
  strVar += '              <div class="galleryFlexBox_ocb" hidden> <\/div>';
  strVar += '            <\/div>';
  strVar += '          <\/div>';
  strVar += '          <div class="suggestionsFlexBox_ocb" hidden> <\/div>';
  strVar += '        <\/div>';
  strVar += '        <div class="galleryItemContainer_ocb galleryItemTemplate_ocb" hidden>';
  strVar += '           <div class="galleryItem_ocb">';
  strVar += '               <a class="galleryImageLink_ocb">';
  strVar += '                 <div class="galleryImage_ocb"> <\/div>';
  strVar += '                 <div class="galleryShortDescription_ocb"> <\/div>';
  strVar += '                 <div class="galleryLongDescription_ocb"> <\/div>';
  strVar += '                 <a class="galleryLink_ocb"> <\/a>';
  strVar += '               <\/a">';
  strVar += '            <\/div>';
  strVar += '        <\/div>';
  strVar += '        <div class="galleryItemButton_ocb galleryItemButtonTemplate_ocb" hidden>';
  strVar += '             <a class="galleryItemButtonLink_ocb"> <\/a >';
  strVar += '        <\/div>';
  strVar += '        <div class="suggestionsItemContainer_ocb suggestionsItemTemplate_ocb" hidden>';
  strVar += '            <div class="suggestionsItem_ocb">';
  strVar += '             <a class="suggestionsItemLink_ocb"> <\/a >';
  strVar += '            <\/div>';
  strVar += '        <\/div>';
  strVar += '  <\/main>';
  strVar += '  <div class="loader_ocb">';
  strVar += '    <svg viewBox="0 0 32 32" width="32" height="32">';
  strVar += '      <circle id="spinner" cx="16" cy="16" r="14" fill="none"><\/circle>';
  strVar += '    <\/svg>';
  strVar += '  <\/div>';
  strVar += '    <footerocb keyboard-attach class="footer_ocb">';
  strVar += '      <input id="input" class="footerInput_ocb" type="text" placeholder="Type your message" on-return="sendMessage(); closeKeyboard()" on-focus="inputUp()" on-blur="inputDown()" \/>';
  strVar += '      <div  class="footerButtonContainer_ocb">';
  strVar += '        <div id="butSend" class="footerButton_ocb" aria-label="Send">      <\/div>';
  strVar += '      <\/div>';
  strVar += '      <div  class="footerButtonContainer_ocb">';
  strVar += '        <div id="butMic" class="footerButton_ocb" aria-label="Mic">      <\/div>';
  strVar += '      <\/div>';
  strVar += '    <\/footerocb>';
  strVar += '  <div class="dialog-container_ocb">';
  strVar += '    <div class="dialog_ocb">';
  strVar += '      <div class="dialog-title_ocb">Phone Number<\/div>';
  strVar += '      <input id="inputNumber" class="dialog-input_ocb" type="text" placeholder=" i.e. +33717171717" on-return="closeKeyboard()"><\/input>';
  strVar += '      <div class="dialog-button-container_ocb">';
  strVar += '        <button id="butAddNumber" class="dialog-buttons_ocb">SAVE<\/button>';
  strVar += '        <button id="butAddNumberCancel" class="dialog-buttons_ocb">CANCEL<\/button>';
  strVar += '      <\/div>';
  strVar += '    <\/div>';
  strVar += '  <\/div>';
  strVar += '  <div class="micro-container_ocb">';
  strVar += '    <div class="micro_ocb">';
  strVar += '      <div id="microImg" class="micro-image_ocb"> <\/div>';
  strVar += '    <\/div>';
  strVar += '  <\/div>';
  strVar += '  <div class="ocb_fast_scroll_button" hidden>';
  strVar += '    <div id="ocbScrollBut" class="ocb_arrow_image" aria-label="Scroll"> <\/div>';
  strVar += '  <\/div>';
  // var parser = new DOMParser();
  // var doc = parser.parseFromString(strVar, "text/xml");
  // document.body.appendChild(doc.firstChild);
  let ocb = document.createElement('ocb');
  ocb.innerHTML = strVar;
  ocb.className = 'ocb';
  document.ocbInitiated = false;
  let ocbButton = document.createElement('ocbButton');
  ocbButton.className = 'ocbButton';
  ocbButton.id = 'butClem';

  // set button listeners
  ocbButton.addEventListener('click', function() {
    showocb(true);
  });

  window.showocb = function(visible) {
    if (visible) {
      document.body.appendChild(ocb);
      if (!document.ocbInitiated) {
        let script = document.createElement('script');
        script.src = webClientURL + 'scripts\/appocb.js';
        script.setAttribute('async', 'async');
        document.body.appendChild(script);
        document.ocbInitiated = true;
      }
      showocbButton(false);
    } else {
      document.body.removeChild(ocb);
      showocbButton(true);
    }
  };

  window.showocbButton = function(visible) {
    if (visible) {
      document.body.appendChild(ocbButton);
    } else {
      document.body.removeChild(ocbButton);
    }
  };

  showocbButton(true);

})();
