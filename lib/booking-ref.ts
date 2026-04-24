const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function makeBookingRef() {
  let s = "";
  const arr = new Uint8Array(10);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 10; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 10; i++) s += chars[arr[i]! % chars.length];
  return `NMA-${s}`;
}
