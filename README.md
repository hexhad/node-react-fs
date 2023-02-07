## REACT - NODE - FS

#### after cloning the code

##### download node_modules and make wokspace first
```
cd server && npm i
```

##### before run the server create .env file and declate below variables
```
GITHUB_AUTH="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" <----need this for octokit but commented those parts
TWILIO_ACCOUNT_SID="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" <--- sid
TWILIO_AUTH_TOKEN="your_auth_token" <---- twilio token
TWILIO_NUMBER="+12345678901" <---- twilio mobilenumber
PORT=5000 <---- port
```
##### for run the server
```
npm run dev
```

#### Then move to the react-submodule dir and install node_modules
```
cd .. && cd react-submodule && npm i
```

#### After that you will be able to run the frontend project
```
npm run start
```

### ATTACHMENTS
#### Request OTP
![](/imgs/requestOtp.JPG)

#### Validate OTP
![](/imgs/validateOtp.JPG)

#### Search User
![](/imgs/searchUser.JPG)

#### User Search 01
![](/imgs/charactorSearch.JPG)

#### User Search 02
![](/imgs/charactorSearch2.JPG)

#### Fire Store
![](/imgs/firesotre.JPG)




#### ASSUMPTIONS
##### since twilio dosent provide free sms api used to console otp in server cli 
