export default class ApiService{
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImg() {
    const key = '21803734-353a7aae41d2d9aadf1e5ce14';
    const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${key}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      return result;
    } catch (error) {
      return console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }


}