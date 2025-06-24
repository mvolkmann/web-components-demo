export function dom(object) {
  const { $children, $name, $text } = object;

  const element = document.createElement($name);

  for (const attr of Object.keys(object)) {
    if (!attr.startsWith("$")) {
      element.setAttribute(attr, object[attr]);
    }
  }

  if ($text) element.textContent = $text;

  if ($children) {
    for (const child of $children) {
      const childElement = dom(child);
      element.appendChild(childElement);
    }
  }

  return element;
}
