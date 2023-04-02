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
        galleryContainer.innerHTML=markup;
        gallery.on('show.simplelightbox');
        gallery.refresh();
      }
    })
    .catch(error => console.error(error));
}

function handleLoadMoreClick() {
  searchImagesApi.page += 1;
  searchImagesApi
    .searchImages()
    .then(data => {
      const newMarkup = renderGallery(data.data);
      galleryContainer.innerHTML=newMarkup;
      gallery.refresh();
    })
    .catch(error => console.error(error));
}
