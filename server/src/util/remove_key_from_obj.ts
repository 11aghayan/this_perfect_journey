export default function(obj: object, key: string) {
  const newObj = JSON.parse(JSON.stringify(obj));
  delete newObj[key];
  return newObj
}