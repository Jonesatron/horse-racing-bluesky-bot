export const getTodaysDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Return in YYYY-MM-DD Format
};
