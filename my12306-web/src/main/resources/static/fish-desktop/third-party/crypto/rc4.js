/**
 *@class fish.desktop.util.RC4
 * RC4 加解密
 * <pre>
 *  fish.RC4.encrypt('11','123455');
 *  fish.RC4.decrypt(xxxx','123455');
 * </pre>
 */
(function () {
    // Shortcuts
    var C = fish.CryptoJS;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    /**
     * RC4 stream cipher algorithm.
     */
    var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;

            // Init sbox
            var S = this._S = [];
            for (var i = 0; i < 256; i++) {
                S[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                j = (j + S[i] + keyByte) % 256;

                // Swap
                var t = S[i];
                S[i] = S[j];
                S[j] = t;
            }

            // Counters
            this._i = this._j = 0;
        },

        _doProcessBlock: function (M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
        },

        keySize: 256 / 32,

        ivSize: 0
    });

    function generateKeystreamWord() {
        // Shortcuts
        var S = this._S;
        var i = this._i;
        var j = this._j;

        // Generate keystream word
        var keystreamWord = 0;
        for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;

            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
        }

        // Update counters
        this._i = i;
        this._j = j;

        return keystreamWord;
    }

    C.RC4 = StreamCipher._createHelper(RC4);

    /**
     * Modified RC4 stream cipher algorithm.
     */
    var RC4Drop = C_algo.RC4Drop = RC4.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        cfg: RC4.cfg.extend({
            drop: 192
        }),

        _doReset: function () {
            RC4._doReset.call(this);

            // Drop
            for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
            }
        }
    });

    C.RC4Drop = StreamCipher._createHelper(RC4Drop);


    fish.RC4 = {
        /**
         * 加密
         * @param msg 明文
         * @param key 秘钥
         * @returns 返回密文
         */
        encrypt: function (msg, key) {
            var encrypted = C.RC4.encrypt(msg, key);
            return encrypted.toString();
        },
        /**
         *解密
         * @param secrutyMsg 密文
         * @param key 秘钥
         * @returns {*} 返回明文
         */
        decrypt: function (secrutyMsg, key) {
            var decrypted = C.RC4.decrypt(secrutyMsg, key);
            return decrypted.toString(C.enc.Utf8);
        }
    };
}());

