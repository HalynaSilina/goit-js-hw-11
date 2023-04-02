import { SearchImagesAPI } from './js/searchAPI';
import { renderGallery } from './js/render-gallery';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchImagesApi = new SearchImagesAPI();

const galleryContainer = document.querySelector('.gallery');
const searchQuery = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const page = searchImagesApi.page;

const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

searchQuery.addEventListener('submit', handleSearchBtnSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

function handleSearchBtnSubmit(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.currentTarget;
  searchImagesApi.query = searchQuery.value;
  searchImagesApi
    .searchImages()
    .then(data => {
      const markup = renderGallery(data.data);
      if (markup !== undefined) {
        galleryContainer.insertAdjacentHTML('beforeend', markup);
        gallery.on();
      }
    })
    .catch(error => console.error(error));
}

function handleLoadMoreClick(page) {
  page += 1;
  searchImagesApi.page = page;
  searchImagesApi
    .searchImages()
    .then(data => {
      const newMarkup = renderGallery(data.data);
      galleryContainer.insertAdjacentHTML('beforeend', newMarkup);
      gallery.refresh();
    })
    .catch(error => console.error(error));
}
