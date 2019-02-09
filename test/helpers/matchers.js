expect.extend({
  async validEncrypted(value) {
    return {
      pass: value.length === 70,
      message: () => "valid encrypted"
    };
  }
});
