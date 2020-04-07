import CryptoJS from 'crypto-js';

// Create a file app-config with your own key and secret

const appConfig = {
  appKey: 'XXX-XXX-XXX-XXX-XXX', // Obtained from Temasys Developers Console
};

const secret = "XXXXXXX"; // 'xxxxx' Use App Key secret
const duration = 2; // 2 hours. Default is 24 for CORS auth
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
