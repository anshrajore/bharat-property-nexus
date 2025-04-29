
const getDorisData = (requestData) => {
  // 10% chance of failure for testing error flows
  if (Math.random() < 0.1) {
    throw new Error('DORIS service unavailable');
  }

  // 20% chance of not finding the property
  if (Math.random() < 0.2) {
    return {
      source: 'DORIS',
      status: 'notFound',
      message: 'No property records found with the given details',
      data: null
    };
  }

  // Success case
  return {
    source: 'DORIS',
    status: 'found',
    data: {
      ownerName: requestData.ownerName,
      propertyId: requestData.propertyId || `DL${Math.floor(Math.random() * 1000000)}`,
      registrationNumber: requestData.registrationNumber || `REG-DEL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      ownership: Math.random() > 0.5 ? 'Freehold' : 'Leasehold',
      encumbrance: Math.random() > 0.7 ? 'Mortgage with XYZ Bank' : 'No Legal Charges',
      area: `${800 + Math.floor(Math.random() * 700)} sq.ft`,
      propertyLocation: requestData.address ? 
        `${requestData.address.line}, ${requestData.address.district}, ${requestData.address.state} - ${requestData.address.pincode}` : 
        'Location details not provided',
      registrationDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toLocaleDateString(),
      marketValue: `₹ ${Math.floor(Math.random() * 9000000) + 2000000}`,
      propertyType: requestData.urban ? 'Urban Residential' : 'Rural Land'
    }
  };
};

module.exports = { getDorisData };
