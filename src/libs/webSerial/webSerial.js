/* eslint-disable no-constant-condition */
import { consoleTimeLog } from '../../utils';

export class WebSerial {
  constructor() {
    this.TAG = 'WebSerial';
    this.port = null;
    this.opened = false;
    this.onConnectedFunc = null;
    this.onErrorFunc = null;
    this.onDataFunc = null;
    this.onDisconnectedFunc = null;

    this.onOpen = this.onOpen.bind(this);
    this.onInternalError = this.onInternalError.bind(this);
    this.onInternalData = this.onInternalData.bind(this);
    this.write = this.write.bind(this);
    this.close = this.close.bind(this);
    this.reader = null;
    this.writer = null;

    consoleTimeLog(`===>>> ${this.TAG} initialized`);
  }

  async connect({ usbVendorId, usbProductId }) {
    try {
      // Request a port and open a connection.
      const port = await navigator.serial.requestPort({
        filters: [{ usbVendorId, usbProductId }],
      });
      await port.open({ baudRate: 9600 });
      this.port = port;

      // Call the onOpen callback if defined
      if (this.onOpen) {
        this.onOpen();
      }

      // Set up a reader to read data from the port.
      this.reader = port.readable.getReader();

      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await this.reader.read();
            if (done) {
              // Allow the serial port to be closed later.
              break;
            }
            // value is a Uint8Array.
            if (this.onInternalData) {
              this.onInternalData(value);
            }
          }
        } catch (error) {
          if (this.onInternalError) {
            this.onInternalError(error);
          }
        } finally {
          // Release the lock on the reader.
          this.reader.releaseLock();
        }
      };

      // Start reading data
      readLoop();

      return port;
    } catch (error) {
      if (this.onInternalError) {
        this.onInternalError(error);
      }
      throw error;
    }
  }

  onInternalData(data) {
    consoleTimeLog(`${this.TAG} onInternalData: `, data);
    if (this.onDataFunc) {
      this.onDataFunc(data);
    }
  }

  onOpen() {
    consoleTimeLog(`${this.TAG} onOpen`, this.port);
    this.opened = this.port.readable && this.port.writable;
    if (this.onConnectedFunc) {
      this.onConnectedFunc();
    }
  }

  onInternalError(error) {
    consoleTimeLog(`${this.TAG} onInternalError: `, error);
    if (this.onErrorFunc) {
      this.onErrorFunc(error);
    }
  }

  onInternalClose(error) {
    consoleTimeLog(`${this.TAG} onInternalClose: `, error);
    this.opened = false;
    this.port = null;
    if (this.onDisconnectedFunc) {
      this.onDisconnectedFunc(error);
    }
  }

  async write(data) {
    if (!this.port) {
      consoleTimeLog(`${this.TAG} write: port is null`);
      return;
    }

    this.writer = this.port.writable.getWriter();
    try {
      await this.writer.write(data);
    } catch (error) {
      console.error('Error writing to port:', error);
    } finally {
      this.writer.releaseLock();
    }
  }

  isOpen() {
    return this.port && this.port.readable && this.port.writable;
  }

  async close() {
    if (this.port) {
      try {
        // Close the writer
        if (this.port.writable) {
          await this.writer?.releaseLock();
        }

        if (this.port.readable) {
          await this.reader?.releaseLock();
        }

        // Close the port
        await this.port?.close();
        this.port = null;
        this.opened = false;
      } catch (error) {
        console.error('Error closing port:', error);
      }
    }
  }

  onConnected(callbackFunc) {
    this.onConnectedFunc = callbackFunc;
  }

  onDisconnected(callbackFunc) {
    this.onDisconnectedFunc = callbackFunc;
  }

  onError(callbackFunc) {
    this.onErrorFunc = callbackFunc;
  }

  onData(callbackFunc) {
    this.onDataFunc = callbackFunc;
  }
}
