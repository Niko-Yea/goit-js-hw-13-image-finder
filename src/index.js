import { notice } from '@pnotify/core';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import * as basicLightbox from '../node_modules/basiclightbox/dist/basicLightbox.min';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';

import './sass/main.scss';
import ApiService from './js/apiService';
import card from './partials/card.hbs';

const refs = {
  listEl: document.querySelector('.gallery'),
  inputEl: document.querySelector('input'),
  searchBtn: document.querySelector('.search-btn'),
  loadMoreBtn: document.querySelector('.btn'),
}

refs.searchBtn.addEventListener('click', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

const apiService = new ApiService();

async function onSearchBtnClick(e) {
  e.preventDefault();

  const inputValue = refs.inputEl.value;
  const voidSearchQueryText = 'Please type search query';
  const badRequestText = 'Nothing found';

  clearImgList();
  refs.loadMoreBtn.classList.add('is-hiden');

  if (inputValue === '') {
    showNotice(voidSearchQueryText);
    return;
  }

  apiService.query = inputValue;
  apiService.resetPage();
  const response = await apiService.fetchImg();

  if (response.hits.length !==0) {
    renderImgList(response);
    refs.loadMoreBtn.classList.remove('is-hiden');
    refs.listEl.addEventListener('click', showModal);
  } else {
    showNotice(badRequestText);
  }
}

async function onLoadMoreBtnClick(e) {
  e.preventDefault();

  refs.loadMoreBtn.setAttribute('disabled', 'true');
  refs.loadMoreBtn.textContent = 'In progress'

  apiService.incrementPage();

  const response = await apiService.fetchImg();
  if(response.hits.length !==0) {
    refs.loadMoreBtn.removeAttribute('disabled', 'true');
    refs.loadMoreBtn.textContent = 'Load More';
  }

  renderImgList(response);

  refs.loadMoreBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function renderImgList(imgArr) {
  const fetchList = imgArr.hits.map(card).join('');
  refs.listEl.insertAdjacentHTML('beforeend', fetchList);
}

function clearImgList() {
  refs.listEl.innerHTML = '';
}

function showNotice(noticeText) {
  notice({
    text: noticeText,
    type: 'notice',
    sticker: false,
    maxTextHeight: null,
    delay: 3000,
  });
}

function showModal(e) {
  if (e.target.nodeName === 'IMG'){
    const instance = basicLightbox.create(`<img src="${e.srcElement.dataset.largeimg}" alt="large image">`);
    instance.show();
  }
}