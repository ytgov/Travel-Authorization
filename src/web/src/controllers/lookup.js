import { api } from "./config";

export default {
  async getDestinations(data) {
    return await api
      .get("lookup/destination")
      .then(res => {
        return res.data;
      })
      .catch(error => {
        // handle error
        console.error(error);
      });
  }
};
