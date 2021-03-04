export default httpclient => ({
  getMe: async () => {
    const response = await httpclient.get('/users/me');

    return {
      data: response.data
    };
  }
});
