// import { BACKEND_URL } from "./config.js";




// export async function getItems() {
//   const items = await fetch(`${BACKEND_URL}/items`).then((r) => r.json());

//   return items;
// }

// export async function createItem(item) {
//   await fetch(`${BACKEND_URL}/items`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(item),
//   });
// }

// export async function deleteItem(id, item) {
//   await fetch(`${BACKEND_URL}/items/${id}`, {
//     method: "DELETE",
//   });
// }

// export async function filterItems(filterName, lowerPrice, upperPrice) {
//   try {
//     let data = {
//       filterName: filterName,
//       lowerPrice: lowerPrice,
//       upperPrice: upperPrice,
//     };

//     // Make a POST request to the backend with the data in the body
//     const response = await fetch(`${BACKEND_URL}/items/filter`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok.");
//     }

//     // Parse the response as JSON
//     const filteredItems = await response.json();

//     // Return the filtered items
//     return filteredItems;
//   } catch (error) {
//     console.error("Error fetching filtered items:", error);
//     return [];
//   }
// }

// export async function getMembers() {
//   const members = await fetch(`${BACKEND_URL}/members`).then((r) => r.json());
//   return members;
// }

// export async function createMember(member) {
//   await fetch(`${BACKEND_URL}/members`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(member),
//   });
// }

// export async function deleteMember(id, item) {
//   await fetch(`${BACKEND_URL}/members/${id}`, {
//     method: "DELETE",
//   });
// }