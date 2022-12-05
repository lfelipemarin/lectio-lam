import axios from 'axios';
import store from '@/store';

export default () => {
  return axios.create({
    baseURL:
      process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_SERVER_URL
        : 'http://localhost:5001/sizzling-heat-354/us-central1/widgets',
    headers: {
      Authorization: `Bearer ${store.state.token}`,
    },
  });
};
