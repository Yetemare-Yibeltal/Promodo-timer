export function validateDuration(minutes, min = 1, max = 120) {
  const parsed = Number(minutes);
  if (isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
}

export function sanitizeInput(inputStr) {
  const div = document.createElement("div");
  div.textContent = inputStr;
  return div.innerHTML.trim();
}
