export default httpclient => ({
  getMe: async () => {
    const { data } = await httpclient.get('/users/me');

    return {
      data
    };
  },
  generateApiKey: async () => {
    const { data } = await httpclient.post('/users/me/apikey');
    return {
      data
    };
  }
});
