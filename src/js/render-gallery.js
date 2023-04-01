import { Notify } from 'notiflix';

export function renderGallery(data) {
  if (data.hits.length === 0) {
   return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  const galleryMarkup = createMarkup(data.hits);
  return galleryMarkup;
}

function createMarkup(items) {
  const itemsMarkup = items.map(
      ({
        comments,
        downloads,
        largeImageURL,
        likes,
        tags,
        views,
        webformatURL,
      }) =>
        `<div class="photo-card"><a class="gallery__item" href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}", alt="${tags} "loading="lazy" /></a><div class="info">
        <p class="info-item">
          <b>Likes</b> ${likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${downloads}
        </p>
      </div>
    </div>`
    )
    .join(' ');
  return itemsMarkup;
}
