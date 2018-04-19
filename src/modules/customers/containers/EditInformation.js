import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FIELDS_GROUPS_CONTENT_TYPES } from 'modules/settings/properties/constants';
import { queries } from '../graphql';
import { queries as fieldQueries } from 'modules/settings/properties/graphql';
import { EditInformation } from '../components/detail/sidebar';
import { Spinner } from 'modules/common/components';
import { Sidebar } from 'modules/layout/components';

const EditInformationContainer = (props, context) => {
  const {
    customerId,
    customer,
    fieldsGroupsQuery,
    customerDetailQuery,
    wide
  } = props;

  let customerDetailQueryLoading = false;
  let customerDetail = customer || {};

  if (customerId) {
    customerDetailQueryLoading = customerDetailQuery.loading;
    customerDetail = customerDetailQuery.customerDetail || {};
  }

  const customFieldsData = customerDetail.customFieldsData || {};

  if (fieldsGroupsQuery.loading || customerDetailQueryLoading) {
    return (
      <Sidebar full wide={wide}>
        <Spinner />
      </Sidebar>
    );
  }

  const updatedProps = {
    ...props,
    customer: customerDetail,
    customFieldsData: customFieldsData,
    currentUser: context.currentUser,
    fieldsGroups: fieldsGroupsQuery.fieldsGroups || []
  };

  return <EditInformation {...updatedProps} />;
};

EditInformationContainer.propTypes = {
  customerId: PropTypes.string,
  sections: PropTypes.node,
  wide: PropTypes.bool,
  customer: PropTypes.object,
  fieldsGroupsQuery: PropTypes.object.isRequired,
  customerDetailQuery: PropTypes.object,
  query: PropTypes.object
};

EditInformationContainer.contextTypes = {
  currentUser: PropTypes.object
};

export default compose(
  graphql(gql(fieldQueries.fieldsGroups), {
    name: 'fieldsGroupsQuery',
    options: () => ({
      variables: {
        contentType: FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER
      }
    })
  }),
  graphql(gql(queries.customerDetail), {
    name: 'customerDetailQuery',
    skip: ({ customerId }) => (customerId ? false : true),
    options: ({ customerId }) => ({
      variables: {
        _id: customerId
      }
    })
  })
)(EditInformationContainer);
