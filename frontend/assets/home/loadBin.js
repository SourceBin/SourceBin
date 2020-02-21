export async function loadBin(route, store, error) {
  try {
    if (route.params.key) {
      await store.dispatch('bin/loadFromKey', route.params.key);
    } else if (route.query.src) {
      await store.dispatch('bin/loadFromQuery', route.query);
    }
  } catch (err) {
    error({
      statusCode: err.response.status,
      message: err.response.data.message,
    });
  }
}
