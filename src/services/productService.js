
const API_URL = "http://localhost:5000/api/products";

export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data = await response.json();

  return data.products.map((product) => ({
    ...product,
    id: product._id,
  }));
}

export async function getProductById(id) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(id)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load product details");
  }

  const data = await response.json();

  return {
    ...data.product,
    id: data.product._id,
  };
}
