import { SearchImagesAPI } from './js/searchAPI';
import { renderGallery } from './js/render-gallery';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

// init new search api instance
const searchImagesApi = new SearchImagesAPI();

const galleryContainer = document.querySelector('.gallery');
const searchQuery = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const toTheTopBtn = document.querySelector('.top-btn');

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  overlayOpacity: 0.9,
  widthRatio: 0.9,
});
let isActive = false;

searchQuery.addEventListener('submit', handleSearchBtnSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);
toTheTopBtn.addEventListener('click', scrollToTop);

async function handleSearchBtnSubmit(e) {
  e.preventDefault();
  reset();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  // check search request
  if (searchQuery.value === '') {
    return Notify.warning('Please, enter your search request');
  }
  searchImagesApi.query = searchQuery.value.trim();
  try {
    const images = await searchImagesApi.searchImages().then(data => {
      const items = data.data.hits;
      const totalItems = data.data.totalHits;
      if (items.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notify.success(`Hooray! We found ${totalItems} images.`);
      const markup = renderGallery(items);
      if (markup !== undefined) {
        galleryContainer.innerHTML = markup;
        gallery.on('show.simplelightbox');
        gallery.refresh();
        loadMoreBtn.classList.remove('is-hidden');
      }
    });
  } catch {
    error => console.error(error);
  }
}

function handleLoadMoreClick() {
  searchImagesApi.page += 1;
  searchImagesApi
    .searchImages()
    .then(data => {
      const items = data.data.hits;
      if (
        data.data.totalHits <=
        searchImagesApi.page * searchImagesApi.per_page
      ) {
        loadMoreBtn.classList.add('is-hidden');
        toTheTopBtn.classList.remove('is-hidden');
        searchQuery.reset();
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      const newMarkup = renderGallery(items);
      galleryContainer.insertAdjacentHTML('beforeend', newMarkup);
      gallery.refresh();
      // window.addEventListener('scroll', onScroll);
    })
    .catch(error => console.error(error));
}

function reset() {
  // add some resets
  searchImagesApi.page = 1;
  galleryContainer.innerHTML = '';

  loadMoreBtn.classList.add('is-hidden');
  toTheTopBtn.classList.add('is-hidden');
}

// function onScroll() {
//   // add smooth skroll on window
//     const { height: cardHeight } = document
//       .querySelector('.gallery')
//       .firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * 1,
//       behavior: 'smooth',
//     });
//   }

function scrollToTop() {
  // Scroll to top logic
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  loadMoreBtn.classList.add('is-hidden');
  toTheTopBtn.classList.add('is-hidden');
}
