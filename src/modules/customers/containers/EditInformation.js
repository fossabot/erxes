import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries, mutations } from '../graphql';
import { EditInformation } from '../components/detail/sidebar';
import { Spinner } from 'modules/common/components';
import { Sidebar } from 'modules/layout/components';

const EditInformationContainer = (props, context) => {
  const { customer, customersEdit, fieldsQuery } = props;
  if (fieldsQuery.loading) {
    return (
      <Sidebar full>
        <Spinner />
      </Sidebar>
    );
  }

  const { _id } = customer;

  const save = (variables, callback) => {
    customersEdit({
      variables: { _id: _id, ...variables }
    })
      .then(() => {
        callback();
      })
      .catch(e => {
        callback(e);
      });
  };

  const updatedProps = {
    ...props,
    save,
    currentUser: context.currentUser,
    customFields: fieldsQuery.fields
  };

  return <EditInformation {...updatedProps} />;
};

EditInformationContainer.propTypes = {
  customer: PropTypes.object.isRequired,
  sections: PropTypes.node,
  fieldsQuery: PropTypes.object.isRequired,
  customersEdit: PropTypes.func.isRequired
};

EditInformationContainer.contextTypes = {
  currentUser: PropTypes.object
};

const options = ({ customer }) => ({
  refetchQueries: [
    { query: gql`${queries.customerDetail}`, variables: { _id: customer._id } }
  ]
});

export default compose(
  graphql(gql(queries.fields), {
    name: 'fieldsQuery',
    options: () => ({
      notifyOnNetworkStatusChange: true
    })
  }),
  // mutations
  graphql(gql(mutations.customersEdit), {
    name: 'customersEdit',
    options
  })
)(EditInformationContainer);
