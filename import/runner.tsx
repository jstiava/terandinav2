// src/migrations/run-import-uploadthing-media.ts
import { downloadAndConvertProducts } from "./download-and-convert-products";
import { importTerandinaProducts, loadJSON } from "./import-products"



// const products: any[] = await loadJSON("data/products.json");

// const duplicates = products.filter((product, index, arr) =>
//         arr.findIndex(p => p.name === product.name) !== index
//     ).map(product => product.name);


// const noUpdatedAt = products.filter((product, index) => !product.updatedAt).map(product => product.name);
// const uniqueNameCount = new Set(products.map(product => product.name)).size;
// const noCats =  products.filter(product => !product.categories || product.categories.length == 0)


// console.log([...new Set(noUpdatedAt)]);
// console.log({
//     uniqueNameCount,
//     count: products.length,
//     duplicates: [...new Set(duplicates)],
//     noCats: noCats.length
// });


await importTerandinaProducts();
process.exit(0)