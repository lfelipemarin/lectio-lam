import axios from 'axios'
import store from '@/store'

// export default () => {
//   return axios.create({
//     baseURL: `http://localhost:8081/`,
//     headers: {
//       Authorization: `Bearer ${store.state.token}`
//     }
//   })
// }

/*** Uncomment for deployment to firebase ****/
export default () => {
  return axios.create({
    baseURL: `https://us-central1-sizzling-heat-354.cloudfunctions.net/widgets/`,
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
