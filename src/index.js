import { SearchImagesAPI } from './js/searchAPI';
import { renderGallery } from './js/render-gallery';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchImagesApi = new SearchImagesAPI();

const galleryContainer = document.querySelector('.gallery');
const searchQuery = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

searchQuery.addEventListener('submit', handleSearchBtnSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

async function handleSearchBtnSubmit(e) {
  e.preventDefault();
  reset();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  searchImagesApi.page = 1;
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
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      const newMarkup = renderGallery(items);
      galleryContainer.insertAdjacentHTML('beforeend', newMarkup);
      gallery.refresh();
    })
    .catch(error => console.error(error));
}

function reset() {
  galleryContainer.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
}
