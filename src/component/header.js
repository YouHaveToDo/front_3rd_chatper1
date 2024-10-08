import Component from './component.js';
import router from '../router.js';
import { html } from 'code-tag';
import UserStore from '../store/userStore.js';
import Authorizer from "../authorizer.js";

export default class Header extends Component {
  #userStore = null;
  #authorizer = null;

  constructor() {
    super();

    this.#userStore = new UserStore();
    this.#authorizer = new Authorizer();

    this._handleEvents.handleHomeClickBound = this.#handleHomeClick.bind(this);
    this._handleEvents.handleProfileClickBound = this.#handleProfileClick.bind(this);
    this._handleEvents.handleLoginClickBound = this.#handleLoginClick.bind(this);
    this._handleEvents.handleLogoutClickBound = this.#handleLogoutClick.bind(this);
  }

  #navigate(path) {
    window.history.pushState({}, '', path);
    router.router();
  }

  #logout() {
    localStorage.removeItem('user');
    this.#userStore.clearState();
    this.#authorizer.logout()
    router.router();
  }

  #handleHomeClick(e) {
    e.preventDefault();
    this.#navigate('/');
  }

  #handleProfileClick(e) {
    e.preventDefault();
    this.#navigate('/profile');
  }

  #handleLoginClick(e) {
    e.preventDefault();
    this.#navigate('/login');
  }

  #handleLogoutClick(e) {
    e.preventDefault();
    this.#logout();
  }

  template() {
    const user = this.#userStore.getUser();

    return html`
      <header class="bg-blue-600 text-white p-4 sticky top-0">
        <h1 class="text-2xl font-bold">항해플러스</h1>
      </header>

      <nav class="bg-white shadow-md p-2 sticky top-14">
        <ul class="flex justify-around">
          <li id="home"><a class="${router.path() === '/' ? 'text-blue-600 font-bold' : 'text-gray-600'}" href="#">홈</a>
          </li>
          <li id="profile"><a class="${router.path() === '/profile' ? 'text-blue-600 font-bold' : 'text-gray-600'}"
                              href="#">프로필</a>
          </li>
          ${user?.username ? html`
              <li id="logout"><a class="text-gray-600" href="#">로그아웃</a></li>` :
            html`
              <li id="login"><a class="text-gray-600" href="/login">로그인</a></li>`}
        </ul>
      </nav>
    `;
  }

  #addEventListeners() {
    const home = document.getElementById('home');
    const profile = document.getElementById('profile');
    const login = document.getElementById('login');
    const logout = document.getElementById('logout');

    home.addEventListener('click', this._handleEvents.handleHomeClickBound);
    profile.addEventListener('click', this._handleEvents.handleProfileClickBound);
    login?.addEventListener('click', this._handleEvents.handleLoginClickBound);
    logout?.addEventListener('click', this._handleEvents.handleLogoutClickBound);
  }

  hydrate() {
    this.#addEventListeners();
  }

  #removeEventListeners() {
    const home = document.getElementById('home');
    const profile = document.getElementById('profile');
    const login = document.getElementById('login');
    const logout = document.getElementById('logout');

    home.removeEventListener('click', this._handleEvents.handleHomeClickBound);
    profile.removeEventListener('click', this._handleEvents.handleProfileClickBound);
    login?.removeEventListener('click', this._handleEvents.handleLogoutClickBound);
    logout?.removeEventListener('click', this._handleEvents.handleLogoutClickBound);
  }

  dehydrate() {
    this.#removeEventListeners();
  }
}