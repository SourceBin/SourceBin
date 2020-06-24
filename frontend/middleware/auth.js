export default function ({ store, redirect, route }) {
  if (!store.state.auth.loggedIn) {
    redirect('/login', {
      redirect: route.fullPath,
    });
  }
}
