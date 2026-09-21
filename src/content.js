export const redraw = (content, html, drawn) => {
  if (content && html != null && html !== drawn) content.innerHTML = html
}
