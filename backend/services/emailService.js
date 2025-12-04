module.exports = {
  async sendEnquiryNotification(enquiry) {
    console.log('📧 Mock email sent for enquiry:', enquiry);
    // In production: integrate with SendGrid/Mailgun
    return true;
  }
};
