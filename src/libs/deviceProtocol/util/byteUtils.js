/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

export const ByteUtils = {
  integerToByteArray(number, order = 'LE') {
    // const byteBuffer = ByteBuffer.allocate(4);
    // if (order === 'LE') {
    //   byteBuffer.LE();
    // } else {
    //   byteBuffer.BE();
    // }
    // byteBuffer.writeInt(number);
    // return byteBuffer.buffer;
    // Step 1: Create an ArrayBuffer of 4 bytes (32 bits)
    const buffer = new ArrayBuffer(4);

    // Step 2: Create a DataView for the buffer
    const view = new DataView(buffer);

    // Step 3: Write the integer to the DataView at offset 0
    // The third parameter is optional and indicates little-endian format
    view.setInt32(0, number, true); // true for little-endian

    // Step 4: Create a Uint8Array from the ArrayBuffer and return it
    return new Uint8Array(buffer);
  },

  integerToByteArraySimple(value) {
    const byteArray = new Uint8Array(2);
    byteArray[0] = value & 0xff;
    byteArray[1] = value >>> 8;
    return byteArray;
  },

  toHexString(a) {
    if (!a) return null;
    return Array.from(a)
      .map((byte) => `0${(byte & 0xff).toString(16)}`.slice(-2))
      .join('');
  },

  concatenateTwoByteArray(firstByteArray, secondByteArray) {
    // Convert to Uint8Array if not already, to ensure byteLength is accurate
    const firstArray = new Uint8Array(firstByteArray);
    const secondArray = new Uint8Array(secondByteArray);

    // Check if either of the byte arrays is empty
    if (firstArray.byteLength === 0) return secondByteArray;
    if (secondArray.byteLength === 0) return firstByteArray;

    // Create a new ArrayBuffer with the combined length of both byte arrays
    const combinedArrayBuffer = new ArrayBuffer(
      firstArray.byteLength + secondArray.byteLength,
    );

    // Create a view to easily set bytes in the combined ArrayBuffer
    const combinedView = new Uint8Array(combinedArrayBuffer);

    // Copy bytes from the first byte array
    combinedView.set(firstArray, 0);

    // Copy bytes from the second byte array, starting at the end of the first
    combinedView.set(secondArray, firstArray.byteLength);

    return combinedView;
  },

  subByteArray(src, startPos, num) {
    if (startPos < 0 || num < 0) return null;
    if (num === 0) return [];
    return src.slice(startPos, startPos + num);
  },

  toInteger(b, order = 'LE') {
    let result = 0;
    if (order === 'LE') {
      for (let i = b.length - 1; i >= 0; i--) {
        result = (result << 8) | b[i];
      }
    } else {
      // Assuming BE
      for (let i = 0; i < b.length; i++) {
        result = (result << 8) | b[i];
      }
    }
    return result;
  },

  toShort(b, order = 'LE') {
    if (b.length < 2) {
      throw new Error('Byte array too short to convert to short integer');
    }

    let result;
    if (order === 'LE') {
      result = b[0] | (b[1] << 8);
    } else {
      // Assuming BE
      result = (b[0] << 8) | b[1];
    }

    // Adjust for signed values
    if (result & 0x8000) {
      result = result - 0x10000;
    }

    return result;
  },

  stringToByteArray(string) {
    const byteArray = [];
    for (let i = 0; i < string.length; i++) {
      const charCode = string.charCodeAt(i);
      if (charCode < 0x80) {
        byteArray.push(charCode);
      } else if (charCode < 0x800) {
        byteArray.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
      } else if (charCode < 0xd800 || charCode >= 0xe000) {
        byteArray.push(
          0xe0 | (charCode >> 12),
          0x80 | ((charCode >> 6) & 0x3f),
          0x80 | (charCode & 0x3f),
        );
      } else {
        // Surrogate pair
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        const codePoint =
          0x10000 + (((charCode & 0x3ff) << 10) | (string.charCodeAt(i) & 0x3ff));
        byteArray.push(
          0xf0 | (codePoint >> 18),
          0x80 | ((codePoint >> 12) & 0x3f),
          0x80 | ((codePoint >> 6) & 0x3f),
          0x80 | (codePoint & 0x3f),
        );
      }
    }
    return byteArray;
  },

  buildUsbPackageData(string) {
    const data = this.stringToByteArray(string);
    const packageData = new Uint8Array(data.length + 1);
    packageData.set(data, 0);
    packageData[data.length] = 0x00; // Appends 0x00 to the end
    return packageData;
  },

  append(src, bytes, startPos) {
    for (let i = 0, j = startPos; i < bytes.length; i++, j++) {
      src[j] = bytes[i];
    }
    return src;
  },

  byteArrayEquals(array1, array2) {
    // Check if both arrays are the same instance
    if (array1 === array2) {
      return true;
    }

    // Check if both arrays have the same length
    if (array1.length !== array2.length) {
      return false;
    }

    // Compare each element
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    // If all elements are equal, return true
    return true;
  },

  cloneArrayBuffer(originalBuffer) {
    // Step 1: Create a new ArrayBuffer with the same length as the original
    const clonedBuffer = new ArrayBuffer(originalBuffer.byteLength);

    // Step 2: Create a view for both the original and cloned buffer to copy the contents
    // You can use any typed array view that matches your use case. Here, Uint8Array is used as an example.
    const originalView = new Uint8Array(originalBuffer);
    const clonedView = new Uint8Array(clonedBuffer);

    // Copy the contents of the original buffer to the cloned buffer
    clonedView.set(originalView);

    // Return the cloned ArrayBuffer
    return clonedBuffer;
  },

  cloneBuffer(originalBuffer) {
    return originalBuffer.slice();
  },

  shortsToByteArray(arrays) {
    const byteBuffer = new ArrayBuffer(arrays.length * 2);
    const shortBuffer = new DataView(byteBuffer);

    for (let i = 0; i < arrays.length; i++) {
      shortBuffer.setInt16(i * 2, arrays[i], true); // true for little-endian
    }

    return new Uint8Array(byteBuffer);
  },

  toShortEcg(byteArray, littleEndian = true) {
    if (byteArray.length !== 2) {
      throw new Error('Input byte array must have exactly 2 elements');
    }

    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);

    // Set the bytes in the buffer
    view.setUint8(0, byteArray[0]);
    view.setUint8(1, byteArray[1]);

    // Read the value as a 16-bit integer with the specified byte order
    return view.getInt16(0, littleEndian);
  },

  arrayBufferToBase64(buffer) {
    // let binary = '';
    // const bytes = new Uint8Array(buffer);
    // const len = bytes.byteLength;
    // for (let i = 0; i < len; i++) {
    //   binary += String.fromCharCode(bytes[i]);
    // }
    return btoa(buffer);
  },

  convertArrayToBase64(array) {
    // let binaryString = '';

    // array.forEach((value) => {
    //   let byteA, byteB;
    //   if (value < 0) {
    //     // Handle negative values
    //     const x = value & 0xffff; // Get the lower 16 bits
    //     byteA = (x >> 8) & 0xff;
    //     byteB = x & 0xff;
    //   } else {
    //     byteA = (value >> 8) & 0xff;
    //     byteB = value & 0xff;
    //   }
    //   binaryString += String.fromCharCode(byteA) + String.fromCharCode(byteB);
    // });

    // return btoa(binaryString);
    // Convert the byte array to a string using US-ASCII encoding
    let binaryString = '';
    for (let i = 0; i < array.length; i++) {
      binaryString += String.fromCharCode(array[i]);
    }
    return btoa(binaryString);
  },
};
