db = db.getSiblingDB('checkapp');

db.createUser({
  user: 'checkapp',
  pwd: 'checkapp', // Replace with your desired password
  roles: [{ role: 'readWrite', db: 'checkapp' }],
});