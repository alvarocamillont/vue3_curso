const defaultPagination = {
  limit: 5,
  offset: 0
};

export default httpclient => ({
  getAll: async ({ type, limit, offset } = defaultPagination) => {
    const query = {
      limit,
      offset
    };

    if (type) {
      query.type = type;
    }
    const { data } = await httpclient.get('/feedbacks', { params: query });

    return {
      data
    };
  },

  getSummary: async () => {
    const { data } = await httpclient.get('/feedbacks/summary');

    return {
      data
    };
  }
});
