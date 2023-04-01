import axios from 'axios';

export class SearchImagesAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34876532-12c4d31b2d24c62c03fddc81b';

  page = 1;
  query = null;

  searchImages() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }
}
