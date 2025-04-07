# sample_server

# after download the code, cd to the sample_server folder

run npm install to install necessary dependencies.

# create a new .env file in root level of project

PORT=''
MONGODB_URL=''
JWT_SECRET=''

# choose your PORT for server

for example PORT='3000'

# to create JWT SECRET KEY by copy this command line to your cmd to generate the key and save it into JWT_SECRET in .env file

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET='123sdasd3eFGWDSD..........'

# copy your mongoDB url into MONGODB_URL in .env file

MONGODB_URL='mongodb+srv://{UserAccount}:{Password}@cluster0.1y3aoud.mongodb.net/the_database_name'

# run or test code

npm start to run the server
npm test to test the code

## If testing by using postman

# Route list for Authtication:

1. Simple user register:
   Example API: Method: POST, http://localhost:3000/api/auth/register
   in body select raw JSON format
   {
   "username": "testing2",
   "password":"123456"
   }

2. Simple user login:
   Example API: Method: POST, http://localhost:3000/api/auth/login
   in body select raw JSON format
   {
   "username": "testing2",
   "password":"123456"
   }

# Route list for resource:

1. Get all universities with query and pagination:
   Example API: Method: GET, http://localhost:3000/api/resources/university
   in Params: list of key and the default value:
   active=true
   bookmarked=true
   country='any country string'
   deleted=true
   page=1
   limit=10

2. Create a new university
   Example API: Method: POST, http://localhost:3000/api/resources/university
   In Headers put key 'Authorization' and value = 'Bearer ...replace by token...'
   in body select raw JSON format
   {
   "name":"mock university 7",
   "country":"Singapore",
   "webpages":["https://example3.com"]
   }

3. Get a university detail by its id:
   Example API: Method: GET, http://localhost:3000/api/resources/university/67f1622a6542721bbd8ebd86

4. Update details of a specific university
   Example API: Method:PUT, http://localhost:3000/api/resources/university/67f1622a6542721bbd8ebd86
   In Headers put key 'Authorization' and value = 'Bearer ...replace by token...'
   in body select raw JSON format
   {
   "name":"mock university 7"
   }

5. Delete a university by id:
   Example API: Method: DELETE, http://localhost:3000/api/resources/university/67f1622a6542721bbd8ebd86
   In Headers put key 'Authorization' and value = 'Bearer ...replace by token...'

6. Bookmark a university by id:
   Example API: Method: POST, http://localhost:3000/api/resources/university/bookmark/67f16280c531a1caf737c8d6
   In Headers put key 'Authorization' and value = 'Bearer ...replace by token...'
