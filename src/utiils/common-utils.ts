export const addIdToUrl = (value: string): void => {
  const newurl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    `?id=${value}`
  window.history.pushState({ path: newurl }, '', newurl)
}
