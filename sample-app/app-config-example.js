import CryptoJS from 'crypto-js';

const appConfig = {
  appKey: 'XXX-XXX-XXX-XXX-XXX', // Obtain an App Key from the Temasys Developer's Console
  defaultRoom: 'temasys', // Change the room name
};

const secret = "XXXXXXX"; // Use App Key secret
const duration = 2;
const startDateTimeStamp = new Date().toISOString();

if (secret) {
  const genHashForCredentials = CryptoJS.HmacSHA1(
      `${appConfig.defaultRoom}_${duration}_${startDateTimeStamp}`,
      secret
  );
  const credentials = encodeURIComponent(
      genHashForCredentials.toString(CryptoJS.enc.Base64)
  );

  appConfig.credentials = {
    duration,
    startDateTime: startDateTimeStamp,
    credentials
  };
}

export default appConfig;
