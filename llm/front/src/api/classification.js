export async function classificationRequest(method, path) {
  return fetch("http://localhost:3000/classify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method,
      path,
    }),
  }).then((res) => res.json());
}
