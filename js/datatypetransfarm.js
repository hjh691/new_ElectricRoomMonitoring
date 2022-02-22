function bytesarraytofloat(bytes,index){
    var v1=bytes[index];
    var v2=bytes[index+1];
    var v3=bytes[index+2];
    var mfloat = ((bytes[index+3] & 0xFF) << 24) | 
	((bytes[index+2] & 0xFF) << 16) | 
	((bytes[index+1] & 0xFF) << 8) | 
	(bytes[index+0] & 0xFF);
    return mfloat;
}
function hex2float(num) {
    //符号位    1100 0010 0 100 0000 0000 0000 0000 0000
  var sign = (num & 0x80000000) ? -1 : 1;
    //指数位
  var exponent = ((num >> 23) & 0xff) - 127;
    //尾数位
  num=num&0x7fffff
  var mantissa = 1 + ((num) / 0x7fffff);
  return sign * mantissa * Math.pow(2, exponent);
}
function base64toBlob(base64,type) {  
    // 将base64转为Unicode规则编码
	let  bstr = atob(base64, type),  
	n = bstr.length,  
    u8arr = new Uint8Array(n);
    while (n--) {  
        u8arr[n] = bstr.charCodeAt(n) // 转换编码后才可以使用charCodeAt 找到Unicode编码
    }  
    return new Blob([u8arr], {  
        type,
    })
} 

function getFloatValue(base64Str) {  
	let blob = base64toBlob(base64Str, "");
	return blob.arrayBuffer().then(buffer => {
		let view = new DataView(buffer);
		if(buffer.byteLength == 4){
			return view.getFloat32(0, false);
		} else {
			return view.getFloat64(0, false);
		}
	});
} 
function parseFloathex(str) {
    var float = 0, sign, order, mantissa, exp,
    int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str, 16);
    }
    else {
        for (var i = str.length -1; i >=0; i -= 1) {
            if (str.charCodeAt(i) > 255) {
                console.log('Wrong string parameter');
                return false;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int >>> 31) ? -1 : 1;
    exp = (int >>> 23 & 0xff) - 127;
    mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i=0; i<mantissa.length; i+=1) {
        float += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
        exp--;
    }
    return float*sign;
}
//需要用到的函数
function InsertString(t, c, n) {
        var r = new Array();
        for (var i = 0; i * 2 < t.length; i++) {
            r.push(t.substr(i * 2, n));
        }
        return r.join(c);
    }
    //需要用到的函数  
    function FillString(t, c, n, b) {
        if ((t == "") || (c.length != 1) || (n <= t.length)) {
            return t;
        }
        var l = t.length;
        for (var i = 0; i < n - l; i++) {
            if (b == true) {
                t = c + t;
            }
             else {
                t += c;
            }
        }
        return t;
    }
    //16进制转浮点数
    function HexToSingle(t) {
        t = t.replace(/\s+/g, "");
        if (t == "") {
            return "";
        }
        if (t == "00000000") {
            return "0";
        }
        if ((t.length > 8) || (isNaN(parseInt(t, 16)))) {
            return "Error";
        }
        if (t.length < 8) {
            t = FillString(t, "0", 8, true);
        }
        t = parseInt(t, 16).toString(2);
        t = FillString(t, "0", 32, true);
        var s = t.substring(0, 1);
        var e = t.substring(1, 9);
        var m = t.substring(9);
        e = parseInt(e, 2) - 127;
        m = "1" + m;
        if (e >= 0) {
            m = m.substr(0, e + 1) + "." + m.substring(e + 1)
        }
         else {
            m = "0." + FillString(m, "0", m.length - e - 1, true)
        }
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        var a = m.split(".");
        var mi = parseInt(a[0], 2);
        var mf = 0;
        for (var i = 0; i < a[1].length; i++) {
            mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
        }
        m = parseInt(mi) + parseFloat(mf);
        if (s == 1) {
            m = 0 - m;
        }
        return m;
    }
    //浮点数转16进制
    function SingleToHex(t) {
        if (t == "") {
            return "";
        }
        t = parseFloat(t);
        if (isNaN(t) == true) {
            return "Error";
        }
        if (t == 0) {
            return "00000000";
        }
        var s,
        e,
        m;
        if (t > 0) {
            s = 0;
        }
         else {
            s = 1;
            t = 0 - t;
        }
        m = t.toString(2);
        if (m >= 1) {
            if (m.indexOf(".") == -1) {
                m = m + ".0";
            }
            e = m.indexOf(".") - 1;
        }
         else {
            e = 1 - m.indexOf("1");
        }
        if (e >= 0) {
            m = m.replace(".", "");
        }
         else {
            m = m.substring(m.indexOf("1"));
        }
        if (m.length > 24) {
            m = m.substr(0, 24);
        }
         else {
            m = FillString(m, "0", 24, false)
        }
        m = m.substring(1);
        e = (e + 127).toString(2);
        e = FillString(e, "0", 8, true);
        var r = parseInt(s + e + m, 2).toString(16);
        r = FillString(r, "0", 8, true);
        return InsertString(r, " ", 2).toUpperCase();
    }
    	/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
 /*
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf8to16(utf8);
 */
 function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}
function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while(i < len) {
		c = str.charCodeAt(i++);
		switch(c >> 4)
		{
		  case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += str.charAt(i-1);
			break;
		  case 12: case 13:
			// 110x xxxx   10xx xxxx
			char2 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
		  case 14:
			// 1110 xxxx  10xx xxxx  10xx xxxx
			char2 = str.charCodeAt(i++);
			char3 = str.charCodeAt(i++);
			out += String.fromCharCode(((c & 0x0F) << 12) |
										   ((char2 & 0x3F) << 6) |
										   ((char3 & 0x3F) << 0));
			break;
		}
	}
	return out;
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 var base64DecodeChars = new Array(
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
     52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
     -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
     15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
     -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
     41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
 function base64encode(str) {
     var out, i, len;
     var c1, c2, c3;
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {
         c1 = str.charCodeAt(i++) & 0xff;
         if(i == len)
         {
             out += base64EncodeChars.charAt(c1 >> 2);
             out += base64EncodeChars.charAt((c1 & 0x3) << 4);
             out += "==";
             break;
         }
         c2 = str.charCodeAt(i++);
         if(i == len)
         {
             out += base64EncodeChars.charAt(c1 >> 2);
             out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
             out += base64EncodeChars.charAt((c2 & 0xF) << 2);
             out += "=";
             break;
         }
         c3 = str.charCodeAt(i++);
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
         out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
         out += base64EncodeChars.charAt(c3 & 0x3F);
     }
     return out;
 }
 function base64decode(str) {
     var c1, c2, c3, c4;
     var i, len, out;
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {
         /* c1 */
         do {
             c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while(i < len && c1 == -1);
         if(c1 == -1)
             break;
         /* c2 */
         do {
             c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
         } while(i < len && c2 == -1);
         if(c2 == -1)
             break;
         out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
         /* c3 */
         do {
             c3 = str.charCodeAt(i++) & 0xff;
             if(c3 == 61)
                 return out;
             c3 = base64DecodeChars[c3];
         } while(i < len && c3 == -1);
         if(c3 == -1)
             break;
         out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
         /* c4 */
         do {
             c4 = str.charCodeAt(i++) & 0xff;
             if(c4 == 61)
                 return out;
             c4 = base64DecodeChars[c4];
         } while(i < len && c4 == -1);
         if(c4 == -1)
             break;
         out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
     }
     return out;
 }
 function base64ToArrayBuffer (base64) {
    var arr = base64.split(',')
    var binaryString = window.atob(arr[0])
    var len = binaryString.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    //console.log(bytes.buffer)
    return bytes
  }