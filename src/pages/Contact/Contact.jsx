rvices.map((service, index) => (
                              <option key={index} value={service}>{service}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formErrors.service}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Project Budget</Form.Label>
                          <Form.Select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                          >
                            <option value="">Select budget range</option>
                            {budgetRanges.map((range, index) => (
                              <option key={index} value={range}>{range}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Message */}
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Message *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.message}
                            placeholder="Tell us about your project requirements..."
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Terms Checkbox */}
                      <Col md={12}>
                        <Form.Group>
                          <Form.Check
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            isInvalid={!!formErrors.agreeToTerms}
                            label={
                              <>
                                I agree to the Terms of Service and Privacy Policy{' '}
                                <span 
                                  className='tooltip-custom'
                                  style={{color: 'red', cursor: 'pointer'}}
                                >
                                  *
                                  <span className="tooltip-text">
                                    • We may contact you via email or phone regarding your inquiry or service request.<br />
                                    • Your personal information will remain confidential and will not be shared with third parties
                                  </span>
                                </span>
                              </>
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors.agreeToTerms}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Submit Button */}
                      <Col md={12}>
                        <Button
                          type="submit"
                          className="btn"
                          disabled={!isFormValid || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              <div className="contact-sidebar">
                {/* Quick Contact */}
                <Card className="quick-contact-card mb-4">
                  <Card.Body>
                    <h4>Quick Contact</h4>
                    <p>Need immediate assistance? Reach out to us directly.</p>
                    
                    <div className="quick-contact-methods">
                      <a href="tel:+971588481295" className="contact-method-btn">
                        <FontAwesomeIcon icon={faPhoneAlt} />
                        <span>Call Now</span>
                      </a>
                      <a href="mailto:Connect@ftebtech.com" className="contact-method-btn">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>Email Us</span>
                      </a>
                    </div>
                  </Card.Body>
                </Card>

                {/* Social Media */}
                <Card className="social-media-card mb-4">
                  <Card.Body>
                    <h4>Follow Us</h4>
                    <p>Stay connected with us on social media for updates and insights.</p>
                    
                    <div className="social-links">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label={social.label}
                        >
                          <FontAwesomeIcon icon={social.icon} />
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Office Hours */}
                <Card className="office-hours-card">
                  <Card.Body>
                    <h4>Office Hours</h4>
                    <div className="hours-list">
                      <div className="hours-item">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="hours-item">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="hours-item">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Email Client Selection Modal */}
      <Modal
        className="email-client-modal"
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        centered
        size="lg"
      >
          <div className="modal-header">
            <h5 className="modal-title">
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Choose Your Email Client
            </h5>
            <button
              type="button"
              className="btn-close-custom"
              onClick={() => setShowEmailModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="modal-body">
            <p className="modal-description">
              Select your preferred email client to send your message. We'll open it with your message pre-filled.
            </p>

            <div className="email-clients-grid">
              {emailClients.map((client, index) => (
                <button
                  key={index}
                  className="email-client-option"
                  onClick={() => handleEmailClientSelect(client.action)}
                  style={{ '--client-color': client.color }}
                >
                  <div className="client-icon">
                    <FontAwesomeIcon icon={client.icon} />
                  </div>
                  <span className="client-name">{client.name}</span>
                </button>
              ))}
            </div>

            <div className="modal-note">
              <small className="text-muted">
                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                If your preferred email client doesn't open automatically, please check your browser's popup settings.
              </small>
            </div>
          </div>
      </Modal>

      {/* Map Section */}
      <section className="map-section">
        <Container fluid className="p-0">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1234567890!2d55.2708!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDExJzUwLjAiTiA1NcKwMTYnMTUuMCJF!5e0!3m2!1sen!2sae!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FTEB Technology Office Location"
            ></iframe>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;