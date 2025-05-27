export async function fetchProductByBarcode(barcode: string) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Błąd połączenia z Open Food Facts');
  const data = await response.json();
  if (data.status !== 1) throw new Error('Nie znaleziono produktu');
  let category = '';
  if (Array.isArray(data.product.categories_tags)) {
    const plTag = data.product.categories_tags.find((tag: string) => tag.startsWith('pl:'));
    if (plTag) category = plTag.replace('pl:', '');
  }
  return {
    name: data.product.product_name || `Produkt ${barcode}`,
    category,
  };
} 