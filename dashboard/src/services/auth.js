export default httpclient => ({
  login: async ({ email, password }) => {
    const response = await httpclient.post('/auth/login', { email, password });
    let errors = null;

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      };
    }

    return {
      data: response.data,
      errors
    };
  },

  register: async ({ name, email, password }) => {
    const response = await httpclient.post('/auth/register', { email, password, name });
    let errors = null;

    if (!response.data) {
      errors = {
        status: response.request.status,
        statusText: response.request.statusText
      };
    }

    return {
      data: response.data,
      errors
    };
  }
});
