export async function loadBin(key, error, store) {
  if (!key) {
    store.commit('bin/reset');
    return;
  }

  try {
    await store.dispatch('bin/load', key);
  } catch (err) {
    error({
      statusCode: err.response.status,
      message: err.response.data.message,
    });
  }
}
