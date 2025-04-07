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