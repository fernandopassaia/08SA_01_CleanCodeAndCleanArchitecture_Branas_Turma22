import { createApp } from 'vue'
import App from './App.vue'
import { AccountGatewayHttp } from './AccountGateway';
import { AxiosAdapter, FetchAdapter } from './HttpClient';

const app = createApp(App);
// const httpClient = new FetchAdapter();
const httpClient = new AxiosAdapter();
app.provide("accountGateway", new AccountGatewayHttp(httpClient));
app.mount('#app')
