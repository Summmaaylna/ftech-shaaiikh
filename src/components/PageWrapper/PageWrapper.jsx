import React from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/components/PageWrapper/PageWrapper.css';

const PageWrapper = ({ children, title, description }) => {
  return (
    <div className="page-wrapper">
      {title && (
        <div className="page-header">
          <Container>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </Container>
        </div>
      )}
      {children}
    </div>
  );
};

export default PageWrapper;
