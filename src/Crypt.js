 
//  ========== REQUIRE CRYPTO JS ==============
 
 // ENCRYPT & DECRYPT FUNCTIONS
 var Crypt = function() {

            // (B1) THE SECRET KEY
  secret : "CIPHERKEY";

    
   var obj = {};

    //  ENCRYPT
    obj.encrypt = (plainText) => {
      var cipher = CryptoJS.AES.encrypt(plainText, plainText);
      cipher = cipher.toString();
      return cipher;
    },
   
    // DECRYPT
    obj.decrypt = (cipher) => {
      var decipher = CryptoJS.AES.decrypt(cipher, this.secret);
      decipher = decipher.toString(CryptoJS.enc.Utf8);
      return decipher;
    }

  };
   