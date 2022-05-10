import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import ContactCollectiveModal from './ContactCollectiveModal';
import StyledButton from './StyledButton';

const ContactCollectiveBtn = ({ children, collective, LoggedInUser }) => {
  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
  return (
    <Fragment>
      {children({ onClick: () => (LoggedInUser ? setShowModal(true) : router.push(`/${collective.slug}/contact`)) })}
      {showModal && <ContactCollectiveModal collective={collective} onClose={() => setShowModal(null)} />}
    </Fragment>
  );
};

ContactCollectiveBtn.propTypes = {
  children: PropTypes.func.isRequired,
  collective: PropTypes.object.isRequired,
  LoggedInUser: PropTypes.object.isRequired,
};

const DefaultContactCollectiveButton = props => (
  <StyledButton {...props}>
    <FormattedMessage id="Contact" defaultMessage="Contact" />
  </StyledButton>
);

ContactCollectiveBtn.defaultProps = {
  children: DefaultContactCollectiveButton,
};

export default ContactCollectiveBtn;
